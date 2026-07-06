// ── ManagementPortal.tsx ──────────────────────────────────────────────
// Self-contained. Requires one prop: the setter for your Agri-Market
// products array (the same `setAgriProducts` from useState<FacultyProduct[]>).

import { useRef, useState } from "react";

type FacultyProduct = {
  id: string;
  name: string;
  department: string;
  price: string;
  quantity: string;
  image?: string;
};

const DEPARTMENTS = ["Fisheries", "Animal Science", "Crop Science"];

export function ManagementPortal({
  setAgriProducts,
}: {
  setAgriProducts: React.Dispatch<React.SetStateAction<FacultyProduct[]>>;
}) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [photoName, setPhotoName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onAddProduct = () => {
    if (!name.trim() || !price.trim() || !quantity.trim()) {
      alert("Fill in product name, price, and quantity first.");
      return;
    }
    const newProduct: FacultyProduct = {
      id: `agri-${Date.now()}`,
      name: name.trim(),
      department,
      price: price.trim(),
      quantity: quantity.trim(),
    };
    setAgriProducts((prev) => [newProduct, ...prev]);
    alert("Success! Pushed live to campus.");
    setName("");
    setPrice("");
    setQuantity("");
    setPhotoName(null);
    setDepartment(DEPARTMENTS[0]);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "oklch(0.22 0.022 250)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "0.75rem 1rem",
    fontSize: "0.9rem",
    color: "oklch(0.95 0.01 180)",
    outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "oklch(0.65 0.02 250)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 6,
    display: "block",
  };

  return (
    <div
      className="glass-card rounded-2xl p-6 sm:p-8"
      style={{ maxWidth: 480, margin: "0 auto" }}
    >
      <h3
        style={{ fontFamily: "var(--font-display)" }}
        className="text-lg sm:text-xl font-semibold tracking-tight mb-5"
      >
        🌾 Faculty Farm Management Portal
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Product Name</label>
          <input
            style={inputStyle}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Fresh Faculty Catfish"
          />
        </div>

        <div>
          <label style={labelStyle}>Department</label>
          <select
            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d} style={{ background: "oklch(0.18 0.02 250)" }}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label style={labelStyle}>Price</label>
            <input
              style={inputStyle}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="₦2,500 per kg"
            />
          </div>
          <div>
            <label style={labelStyle}>Quantity</label>
            <input
              style={inputStyle}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="40kg available"
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Photo</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)}
            style={{ display: "none" }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "0.7rem 1rem",
              borderRadius: 12,
              border: "1px dashed rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.03)",
              color: "oklch(0.75 0.02 250)",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            cj {photoName ? photoName : "Upload Photo"}
          </button>
        </div>

        <button
          onClick={onAddProduct}
          style={{
            marginTop: "0.25rem",
            width: "100%",
            padding: "0.95rem",
            borderRadius: 14,
            border: "none",
            background: "oklch(0.72 0.21 152)",
            color: "oklch(0.12 0.02 160)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            boxShadow: "0 0 24px -6px oklch(0.72 0.21 152)",
          }}
        >
           Publish Live to Agri-Market
        </button>
      </div>
    </div>
  );
}