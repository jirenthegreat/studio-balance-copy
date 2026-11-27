import { useState } from "react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { Loader2, Upload } from "lucide-react";
import { PField } from "./ui";

export default function ImageUpload({ value, onChange, label = "Zdjęcie" }) {
  const [busy, setBusy] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      onChange(file_url);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <PField label={label}>
        <input
          className="input"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Wklej adres zdjęcia lub wgraj plik"
        />
      </PField>
      <div className="flex items-center gap-3">
        <label className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 border border-graphite/20 px-3 text-[0.68rem] uppercase tracking-[0.1em] text-graphite/70">
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {busy ? "Wgrywanie…" : "Wgraj zdjęcie"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => upload(e.target.files?.[0])}
          />
        </label>
        {value && (
          <Image src={value} alt="Podgląd" className="h-14 w-14 rounded-sm object-cover" />
        )}
      </div>
    </div>
  );
}