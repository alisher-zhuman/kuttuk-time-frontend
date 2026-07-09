import { type ChangeEvent, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { ImagePlus, Loader2 } from "lucide-react";

import { MAX_UPLOAD_SIZE, uploadImage } from "@shared/api";
import { cn } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

interface Props {
  value: string;
  onChange: (url: string) => void;
  error?: string | undefined;
}

export const LogoUpload = ({ value, onChange, error }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { t } = useTranslation();

  const haptic = useHaptic();

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError(t("admin.merchants.form.fileType"));
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      setUploadError(t("admin.merchants.form.fileTooLarge"));
      return;
    }

    setUploadError(null);
    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      onChange(await uploadImage(file));
      haptic.success();
    } catch {
      haptic.error();
      setUploadError(t("admin.merchants.form.uploadFailed"));
      onChange("");
    } finally {
      setIsUploading(false);
    }
  };

  const src = preview ?? value;
  const message = uploadError ?? error;

  return (
    <div className="flex flex-col items-center gap-2">
      <label
        className={cn(
          "relative size-24 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer border-2 border-dashed bg-(--color-chip)",
          message ? "border-(--color-accent)" : "border-(--color-line)"
        )}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void handleChange(event)}
        />

        {src ? (
          <img src={src} alt="" className="size-full object-cover" />
        ) : (
          <ImagePlus
            size={28}
            strokeWidth={1.5}
            className="text-(--color-hint)"
          />
        )}

        {isUploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 size={24} color="#FFFFFF" className="animate-spin" />
          </span>
        )}
      </label>

      <span
        className={cn(
          "text-xs font-semibold",
          message ? "text-(--color-accent)" : "text-(--color-hint)"
        )}
      >
        {message ?? t("admin.merchants.form.logoHint")}
      </span>
    </div>
  );
};
