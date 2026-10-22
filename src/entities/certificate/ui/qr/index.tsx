import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { encode } from "uqr";

interface Props {
  // The 8 digits as stored — no spaces, so the cashier's scanner gets a code.
  code: string;
}

// The certificate code as a QR for the owner's scanner. Always black on white
// (not themed): phone cameras read dark-on-light best, also from a dark-mode
// screen. One SVG path, one 1×1 square per dark module.
export const CertificateQr = ({ code }: Props) => {
  const { t } = useTranslation();

  const { size, path } = useMemo(() => {
    const qr = encode(code, { ecc: "M", border: 2 });

    const squares = qr.data.flatMap((row, y) =>
      row.flatMap((isDark, x) => (isDark ? [`M${x} ${y}h1v1h-1z`] : []))
    );

    return { size: qr.size, path: squares.join("") };
  }, [code]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={t("certificate.qrHint")}
        shapeRendering="crispEdges"
        className="size-48 rounded-2xl bg-white p-2"
      >
        <path d={path} fill="#000" />
      </svg>

      <span className="text-xs font-semibold text-(--color-hint)">{t("certificate.qrHint")}</span>
    </div>
  );
};
