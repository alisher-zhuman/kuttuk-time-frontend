import { useTranslation } from "react-i18next";

import { type AdminOrderDetail } from "@entities/order";

import { formatDateTime } from "@shared/helpers";

interface Props {
  resolutions: AdminOrderDetail["resolutions"];
}

// Who decided what on a needs_review order (backend script). Read-only.
export const OrderResolutions = ({ resolutions }: Props) => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-xs font-bold text-(--color-hint) tracking-wider px-1">
        {t("admin.orders.detail.resolutions")}
      </h2>

      <ul className="flex flex-col gap-2 list-none">
        {resolutions.map((resolution, index) => (
          <li
            key={`${resolution.resolvedAt}-${index}`}
            className="flex flex-col gap-1 p-3 rounded-2xl bg-(--color-card) border border-(--color-line)"
          >
            <span className="text-sm font-bold text-(--color-ink)">
              {t(`admin.orders.detail.${resolution.action}`)}
              {resolution.certificateCode && (
                <span className="font-mono tracking-wider text-(--color-slate)">
                  {" · "}
                  {resolution.certificateCode}
                </span>
              )}
            </span>
            <span className="text-xs font-semibold text-(--color-slate)">
              {t(`admin.orders.status.${resolution.fromStatus}`, resolution.fromStatus)} →{" "}
              {t(`admin.orders.status.${resolution.toStatus}`, resolution.toStatus)}
            </span>
            {resolution.note && (
              <span className="text-sm text-(--color-ink)">{resolution.note}</span>
            )}
            <span className="text-xs text-(--color-hint)">
              {t("admin.orders.detail.resolvedBy", {
                by: resolution.resolvedBy,
                date: formatDateTime(resolution.resolvedAt)
              })}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
