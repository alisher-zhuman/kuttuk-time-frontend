// Certificate codes are 8 digits (../backend src/certificates/certificate-code.ts),
// always a string — leading zeros happen ("04718263"), so never Number() them.
export const CERTIFICATE_CODE_LENGTH = 8;

// "04718263" → "0471 8263", as in the bot's messages; a partial "047182" →
// "0471 82" while typing. Anything else is shown as is.
export const formatCertificateCode = (code: string) =>
  /^\d{5,8}$/.test(code) ? `${code.slice(0, 4)} ${code.slice(4)}` : code;

// What the cashier typed or pasted ("0471-8263", "Код: 0471 8263") → its digits,
// at most 8.
export const toCertificateCodeDigits = (input: string) =>
  input.replace(/\D/g, "").slice(0, CERTIFICATE_CODE_LENGTH);
