import { useRef, useState } from "react";
import type { CSSProperties, FormEvent, ChangeEvent } from "react";
import { supabase } from "./supabaseClient";

const CATEGORIES = [
  "Off-Campus Housing/Rent",
  "Campus Water/Light",
  "Academic/Results",
  "Security",
  "General Welfare",
] as const;

type Category = (typeof CATEGORIES)[number];

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: 12,
  background: "oklch(0.2 0.02 250)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "oklch(0.95 0.01 180)",
  fontSize: "0.9rem",
  outline: "none",
  marginTop: 6,
};

const labelStyle: CSSProperties = {
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "oklch(0.62 0.02 250)",
  display: "block",
};

interface SUGComplaintFormProps {
  onSubmitted?: () => void;
}

export default function SUGComplaintForm({ onSubmitted }: SUGComplaintFormProps) {
  const [category, setCategory] = useState<Category | "">("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [studentName, setStudentName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOffCampus = category === "Off-Campus Housing/Rent";

  const resetForm = () => {
    setCategory("");
    setLocation("");
    setDescription("");
    setStudentName("");
    setRegNumber("");
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImagePick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!category || !description.trim() || !studentName.trim() || !regNumber.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("complaint-evidence")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("complaint-evidence").getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const { error: insertError } = await supabase.from("sug_complaints").insert({
        category,
        location: isOffCampus ? location.trim() || null : null,
        description: description.trim(),
        student_name: studentName.trim(),
        reg_number: regNumber.trim(),
        image_url: imageUrl,
      });

      if (insertError) throw insertError;

      setSuccess(true);
      resetForm();
      onSubmitted?.();
    } catch (err) {
      console.error("Complaint submission failed:", err);
      setError("Something went wrong submitting your complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="glass-card rounded-2xl p-6 sm:p-8" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✅</div>
        <h3 className="text-lg font-display font-semibold">Complaint submitted</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you — the SUG Welfare desk has received your report and will follow up.
        </p>
        <button
          onClick={() => setSuccess(false)}
          style={{
            marginTop: "1.25rem",
            padding: "0.7rem 1.4rem",
            borderRadius: 12,
            border: "1px solid color-mix(in oklab, var(--emerald-glow) 45%, transparent)",
            background: "color-mix(in oklab, var(--emerald-glow) 10%, transparent)",
            color: "var(--emerald-bright)",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8">
      <h2 className="text-lg sm:text-xl font-display font-semibold tracking-tight">
        SUG Complaint &amp; Welfare Form
      </h2>
      <p className="mt-2 text-sm text-muted-foreground" style={{ marginBottom: "1.5rem" }}>
        Report housing, utility, academic, security, or welfare issues directly to the SUG.
      </p>

      <label style={labelStyle}>
        Issue Category <span style={{ color: "#f87171" }}>*</span>
      </label>
      <select
        style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        required
      >
        <option value="" disabled style={{ background: "oklch(0.18 0.02 250)" }}>
          Select a category
        </option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c} style={{ background: "oklch(0.18 0.02 250)" }}>
            {c}
          </option>
        ))}
      </select>

      {isOffCampus && (
        <div style={{ marginTop: "1.25rem" }}>
          <label style={labelStyle}>Location / Lodge Name</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="e.g. Zaranda Lodge, Behind FUD Gate"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      )}

      <div style={{ marginTop: "1.25rem" }}>
        <label style={labelStyle}>
          Brief Description of Issue <span style={{ color: "#f87171" }}>*</span>
        </label>
        <textarea
          style={{ ...inputStyle, minHeight: 96, resize: "vertical" }}
          placeholder="Describe what happened, when, and where."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: "1.25rem" }}>
        <div>
          <label style={labelStyle}>
            Student Name <span style={{ color: "#f87171" }}>*</span>
          </label>
          <input
            style={inputStyle}
            type="text"
            placeholder="Full name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={labelStyle}>
            Registration Number <span style={{ color: "#f87171" }}>*</span>
          </label>
          <input
            style={inputStyle}
            type="text"
            placeholder="FUD/CSC/21/1234"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            required
          />
        </div>
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        <label style={labelStyle}>Upload Image / Evidence</label>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagePick} style={{ display: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "0.7rem 1.1rem",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              color: "oklch(0.9 0.01 180)",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {imagePreview ? "📷 Change photo" : "📷 Attach photo"}
          </button>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          )}
        </div>
      </div>

      {error && <p style={{ color: "#f87171", fontSize: "0.8rem", marginTop: "1rem" }}>{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        style={{
          marginTop: "1.75rem",
          width: "100%",
          padding: "0.9rem",
          borderRadius: 14,
          border: "none",
          background: "oklch(0.72 0.21 152)",
          color: "oklch(0.12 0.02 160)",
          fontWeight: 700,
          fontSize: "0.9375rem",
          cursor: submitting ? "default" : "pointer",
          opacity: submitting ? 0.6 : 1,
          boxShadow: "0 0 30px -5px oklch(0.72 0.21 152)",
        }}
      >
        {submitting ? "Submitting..." : "Submit Complaint"}
      </button>
    </form>
  );
}
