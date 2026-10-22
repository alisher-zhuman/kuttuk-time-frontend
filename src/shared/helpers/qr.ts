import { encode } from "uqr";

// One SVG path, one 1×1 square per dark module; `size` includes the border.
export const encodeQr = (value: string) => {
  const qr = encode(value, { ecc: "M", border: 2 });

  const path = qr.data
    .flatMap((row, y) => row.flatMap((isDark, x) => (isDark ? [`M${x} ${y}h1v1h-1z`] : [])))
    .join("");

  return { size: qr.size, path, modules: qr.data };
};

// The QR as a black-on-white PNG file — for printing.
export const downloadQrPng = (value: string, fileName: string) => {
  const MODULE_PX = 16;

  const { size, modules } = encodeQr(value);

  const canvas = document.createElement("canvas");
  canvas.width = size * MODULE_PX;
  canvas.height = size * MODULE_PX;

  const context = canvas.getContext("2d");

  if (!context) return;

  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#000";

  modules.forEach((row, y) =>
    row.forEach((isDark, x) => {
      if (isDark) context.fillRect(x * MODULE_PX, y * MODULE_PX, MODULE_PX, MODULE_PX);
    })
  );

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = fileName;
  link.click();
};
