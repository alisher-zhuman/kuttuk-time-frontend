import { useTranslation } from "react-i18next";

import { cn } from "@shared/helpers";

type CertStatus = "active" | "used";

interface MockCert {
  id: string;
  merchant: string;
  code: string;
  amount: number;
  status: CertStatus;
  gradient: [string, string];
}

const MOCK_CERTS: MockCert[] = [
  {
    id: "1",
    merchant: "Sierra Coffee",
    code: "KUTT-7F3A-9B2C",
    amount: 2000,
    status: "active",
    gradient: ["#5A4BE8", "#8B7DFB"],
  },
  {
    id: "2",
    merchant: "Navat",
    code: "KUTT-1D8E-4A55",
    amount: 1000,
    status: "active",
    gradient: ["#FF6B5E", "#FF9486"],
  },
  {
    id: "3",
    merchant: "Pinta Burgers",
    code: "KUTT-3E6A-2B19",
    amount: 500,
    status: "used",
    gradient: ["#8B5CF6", "#A78BFA"],
  },
];

export const CertificatesTab = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2.5">
      {MOCK_CERTS.map((cert) => {
        const isUsed = cert.status === "used";

        return (
          <div
            key={cert.id}
            className={cn(
              "flex items-center gap-3 p-3 bg-(--color-card) rounded-2xl border border-(--color-line)",
              isUsed && "opacity-55",
            )}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
              style={{
                background: `linear-gradient(140deg, ${cert.gradient[0]}, ${cert.gradient[1]})`,
              }}
            >
              {cert.merchant[0]}
            </div>

            <div className="flex flex-1 min-w-0 flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2.5">
                <span className="text-base font-extrabold text-(--color-ink) truncate">
                  {cert.merchant}
                </span>
                <span className="text-base font-extrabold text-(--color-primary) shrink-0">
                  {cert.amount.toLocaleString("ru-RU")} {t("certificate.currency")}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2.5">
                <span className="font-mono text-xs font-bold text-(--color-slate) tracking-wide whitespace-nowrap">
                  {cert.code}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0",
                    isUsed
                      ? "bg-(--color-surface) text-(--color-hint)"
                      : "bg-(--color-green-tint) text-(--color-green)",
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                  {t(`certificate.status.${cert.status}`)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
