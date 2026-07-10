import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../supabaseClient"; // adjust path if your client lives elsewhere

/**
 * KekeCallRouter
 * ----------------
 * Standalone, self-contained "call a keke driver" widget for FUD Hub.
 *
 * Reality this is built for: 14 drivers on button phones, no apps,
 * no internet, no GPS. So there is no live map, no tracking, no order
 * status. This is a phone book with a zone filter — the entire job is
 * getting a student's thumb onto the right driver's number in one tap.
 *
 * Rendered via createPortal straight into document.body, so it always
 * sits fixed to the real viewport corner — even if some parent element
 * elsewhere on the page has a CSS transform on it (which would otherwise
 * hijack position:fixed and break the FAB's positioning).
 *
 * Drop into /src/components/ and render <KekeCallRouter /> once.
 * It owns its own open/close + zone-selection state internally.
 */

// ---------- Types & data ----------

export type DriverStatus = "available" | "busy" | "offline";

export interface KekeDriver {
  id: string;   // display label derived from the row's numeric id, e.g. "Driver 01"
  name: string;
  phone: string; // full number incl. country code, e.g. "+2348012345678"
  zone: string;  // the single zone this driver serves
  status: DriverStatus;
}

export const ZONES = ["On-Campus Hostels", "Yalwawa", "Gida Dubu", "Takur"] as const;
export type Zone = (typeof ZONES)[number];

// Sample data — used as a fallback if the Supabase fetch fails, or if the
// caller passes their own `drivers` prop to skip fetching entirely.
const DEFAULT_DRIVERS: KekeDriver[] = [
  { id: "Driver 01", name: "Ibrahim Sule", phone: "+2348012345601", zone: "On-Campus Hostels", status: "available" },
  { id: "Driver 02", name: "Musa Aliyu", phone: "+2348012345602", zone: "On-Campus Hostels", status: "busy" },
  { id: "Driver 03", name: "Nura Bello", phone: "+2348012345603", zone: "On-Campus Hostels", status: "available" },
  { id: "Driver 04", name: "Sani Yusuf", phone: "+2348012345604", zone: "Yalwawa", status: "available" },
  { id: "Driver 05", name: "Abba Garba", phone: "+2348012345605", zone: "Yalwawa", status: "offline" },
  { id: "Driver 06", name: "Lawal Ahmed", phone: "+2348012345606", zone: "Gida Dubu", status: "available" },
  { id: "Driver 07", name: "Tanko Umar", phone: "+2348012345607", zone: "Gida Dubu", status: "available" },
  { id: "Driver 08", name: "Bala Idris", phone: "+2348012345608", zone: "Takur", status: "busy" },
  { id: "Driver 09", name: "Haruna Musa", phone: "+2348012345609", zone: "Takur", status: "available" },
];

const STATUS_META: Record<DriverStatus, { label: string; dot: string; text: string }> = {
  available: { label: "Available now", dot: "bg-emerald-400", text: "text-emerald-300" },
  busy: { label: "On a trip", dot: "bg-amber-400", text: "text-amber-300" },
  offline: { label: "Offline", dot: "bg-white/25", text: "text-white/40" },
};

// ---------- Icons (inline, no external deps) ----------

function KekeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M8 30h6l3-10h12l4 10h5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 20h9l2 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="13" cy="34" r="4" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="35" cy="34" r="4" stroke="currentColor" strokeWidth="2.4" />
      <path d="M27 30V20" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MapPinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 21s7-6.1 7-11.5S16.6 2 12 2 5 4.8 5 9.5 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------- FAB ----------

function KekeFAB({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Call a keke driver"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full
                 bg-emerald-400 text-neutral-950 shadow-[0_8px_24px_-4px_rgba(16,185,129,0.5)]
                 transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      <KekeIcon className="h-6 w-6" />
    </button>
  );
}

// ---------- Driver card ----------

function DriverCard({ driver }: { driver: KekeDriver }) {
  const meta = STATUS_META[driver.status];
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-white">{driver.name}</p>
          <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/50">
            {driver.id}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
          <span className={`text-xs ${meta.text}`}>{meta.label}</span>
        </div>
      </div>
      <a
        href={`tel:${driver.phone}`}
        aria-label={`Call ${driver.name}`}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10
                   px-3.5 py-2 text-xs font-semibold text-emerald-300 transition-colors duration-150
                   hover:bg-emerald-400/20 active:scale-95"
      >
        <PhoneIcon className="h-3.5 w-3.5" />
        Call
      </a>
    </div>
  );
}

// ---------- Main sheet ----------

interface KekeCallSheetProps {
  open: boolean;
  onClose: () => void;
  drivers: KekeDriver[];
  loading?: boolean;
}

function KekeCallSheet({ open, onClose, drivers, loading }: KekeCallSheetProps) {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const zoneDrivers = useMemo(() => {
    if (!selectedZone) return [];
    return drivers
      .filter((d) => d.zone === selectedZone)
      .sort((a, b) => (a.status === "available" ? -1 : 1) - (b.status === "available" ? -1 : 1));
  }, [drivers, selectedZone]);

  const primaryDriver = zoneDrivers[0] ?? null;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Call a keke driver"
    >
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl
                   border border-white/10 bg-neutral-950 shadow-2xl
                   animate-[kekeSlideUp_0.3s_cubic-bezier(0.32,0.72,0,1)]"
      >
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1.5 w-10 rounded-full bg-white/20" />
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 hidden sm:flex h-8 w-8 items-center justify-center
                     rounded-full text-white/50 hover:bg-white/10 hover:text-white"
        >
          <ChevronDown className="h-5 w-5 rotate-180" />
        </button>

        <div className="px-6 pb-8 pt-4 sm:pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
              <KekeIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-300/80">FUD Hub Keke</p>
              <h2 className="font-display text-lg font-semibold text-white">Call a driver</h2>
            </div>
          </div>

          {loading && <p className="mt-4 text-xs text-white/40">Loading drivers…</p>}

          <div className="mt-5">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/50">
              <MapPinIcon className="h-3.5 w-3.5" />
              Where are you right now?
            </p>
            <div className="flex flex-wrap gap-2">
              {ZONES.map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors duration-150 ${
                    selectedZone === zone
                      ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white/80"
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            {!selectedZone && (
              <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-center text-sm text-white/40">
                Pick your zone above to see drivers near you
              </div>
            )}

            {selectedZone && !primaryDriver && (
              <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-center text-sm text-white/40">
                No drivers assigned to {selectedZone} yet
              </div>
            )}

            {primaryDriver && (
              <a
                href={`tel:${primaryDriver.phone}`}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400
                           px-4 py-4 text-base font-semibold text-neutral-950 transition-transform duration-150
                           hover:scale-[1.02] active:scale-95"
              >
                <PhoneIcon className="h-5 w-5" />
                Call nearest driver — {primaryDriver.name}
              </a>
            )}
          </div>

          {zoneDrivers.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-xs font-medium text-white/50">Drivers in {selectedZone}</p>
              {zoneDrivers.map((d) => (
                <DriverCard key={d.id} driver={d} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes kekeSlideUp {
          from { transform: translateY(100%); opacity: 0.6; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (min-width: 640px) {
          @keyframes kekeSlideUp {
            from { transform: translateY(24px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
}

// ---------- Public default export ----------

interface KekeCallRouterProps {
  /** Optional override — pass this to skip the Supabase fetch (e.g. in tests
   *  or a storybook-style preview). Leave it out for normal, live use. */
  drivers?: KekeDriver[];
}

export default function KekeCallRouter({ drivers: driversOverride }: KekeCallRouterProps) {
  const [open, setOpen] = useState(false);
  const [fetchedDrivers, setFetchedDrivers] = useState<KekeDriver[]>(DEFAULT_DRIVERS);
  const [loading, setLoading] = useState(!driversOverride);

  useEffect(() => {
    if (driversOverride) return; // caller supplied their own list, skip fetch

    const fetchDrivers = async () => {
      const { data, error } = await supabase
        .from("keke_drivers")
        .select("id, name, phone, zone, status")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching keke drivers:", error);
        setLoading(false);
        return;
      }

      if (data) {
        const mapped: KekeDriver[] = data.map((row) => ({
          id: `Driver ${String(row.id).padStart(2, "0")}`,
          name: row.name,
          phone: row.phone,
          zone: row.zone,
          status: row.status as DriverStatus,
        }));
        setFetchedDrivers(mapped);
      }
      setLoading(false);
    };

    fetchDrivers();
  }, [driversOverride]);

  const drivers = driversOverride ?? fetchedDrivers;

  // Rendered via a portal straight into document.body so this always
  // sits fixed to the real screen corner, regardless of any transform
  // on ancestor elements elsewhere in the page (e.g. scroll-reveal
  // animations), which would otherwise hijack position:fixed.
  return createPortal(
    <>
      <KekeFAB onClick={() => setOpen(true)} />
      <KekeCallSheet open={open} onClose={() => setOpen(false)} drivers={drivers} loading={loading} />
    </>,
    document.body
  );
}

/**
 * Status is manually maintained, not live:
 * Drivers are on button phones with no app, so "available / busy / offline"
 * can only change when a human updates the row — either you, from the
 * Supabase Table Editor, or a designated student marshal via a small
 * password-gated page (same LoginGate pattern as your ManagementPortal).
 */
