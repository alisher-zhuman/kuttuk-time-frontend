import { useTranslation } from "react-i18next";

import { Pencil } from "lucide-react";

import { type Category } from "@entities/category";
import { type AdminMerchantDetail } from "@entities/merchant";

import { cn, formatDate, formatMoney } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

interface Props {
  merchant: AdminMerchantDetail;
  categories: Category[];
  onEdit: () => void;
}

export const AdminMerchantDetailContent = ({
  merchant,
  categories,
  onEdit
}: Props) => {
  const { t, i18n } = useTranslation();

  const haptic = useHaptic();

  const merchantCategories = categories.filter((category) =>
    merchant.categories.includes(category.id)
  );

  return (
    <div className="flex-1 flex flex-col py-4 gap-5">
      <div className="flex items-center gap-3.5">
        <img
          src={merchant.logo}
          alt={merchant.name}
          className="size-16 rounded-xl shrink-0 object-cover"
        />

        <div className="flex-1 flex flex-col min-w-0 gap-1">
          <span className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight truncate">
            {merchant.name}
          </span>
          <span className="text-sm text-(--color-slate) font-semibold truncate">
            {merchant.slug}
          </span>
        </div>

        <span
          className={cn(
            "flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0",
            merchant.isActive
              ? "bg-(--color-green-tint) text-(--color-green)"
              : "bg-(--color-surface) text-(--color-hint)"
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
          {t(
            merchant.isActive
              ? "admin.merchants.active"
              : "admin.merchants.inactive"
          )}
        </span>

        <button
          type="button"
          aria-label={t("admin.merchants.form.edit")}
          onClick={() => {
            haptic.light();
            onEdit();
          }}
          className="flex items-center justify-center size-9 rounded-full border border-(--color-line) bg-(--color-chip) text-(--color-hint) shrink-0 cursor-pointer"
        >
          <Pencil size={16} />
        </button>
      </div>

      {merchant.description && (
        <div>
          <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-1">
            {t("admin.merchants.detail.description")}
          </p>
          <p className="text-sm text-(--color-ink) font-medium px-1">
            {
              merchant.description[
                i18n.language as keyof typeof merchant.description
              ]
            }
          </p>
        </div>
      )}

      {merchantCategories.length > 0 && (
        <div>
          <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-2.5">
            {t("admin.merchants.detail.categories")}
          </p>

          <div className="flex flex-wrap gap-2">
            {merchantCategories.map((category) => (
              <span
                key={category.id}
                className="px-3 py-1.5 rounded-full text-sm font-bold bg-(--color-chip) text-(--color-chip-ink) border border-(--color-line)"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-2.5">
          {t("admin.merchants.detail.nominals")}
        </p>

        <div className="flex flex-wrap gap-2">
          {merchant.nominals.map((nominal) => (
            <span
              key={nominal}
              className="px-3 py-1.5 rounded-full text-sm font-bold bg-(--color-chip) text-(--color-chip-ink) border border-(--color-line)"
            >
              {formatMoney(nominal, t("certificate.currency"))}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        <div>
          <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-1">
            {t("admin.merchants.detail.validity")}
          </p>
          <p className="text-sm font-bold text-(--color-ink) px-1">
            {t("admin.merchants.detail.validityValue", {
              months: merchant.validityMonths
            })}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-1">
            {t("admin.merchants.detail.telegramId")}
          </p>
          <p className="text-sm font-bold text-(--color-ink) px-1">
            {merchant.merchantTelegramId}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-1">
            {t("admin.merchants.detail.createdAt")}
          </p>
          <p className="text-sm font-bold text-(--color-ink) px-1">
            {formatDate(merchant.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};
