import { useTranslation } from "react-i18next";

import { type AdminCategory } from "@entities/category";
import { type AdminMerchantDetail } from "@entities/merchant";

import { cn, formatDate, formatMoney } from "@shared/helpers";

interface Props {
  merchant: AdminMerchantDetail;
  categories: AdminCategory[];
}

export const AdminMerchantDetailContent = ({ merchant, categories }: Props) => {
  const { t, i18n } = useTranslation();

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
            /{merchant.slug}
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
          {t(merchant.isActive ? "admin.merchants.active" : "admin.merchants.inactive")}
        </span>
      </div>

      {merchant.description && (
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-1">
              {t("admin.merchants.detail.descriptionRu")}
            </p>
            <p className="text-sm text-(--color-ink) font-medium px-1">
              {merchant.description.ru}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-1">
              {t("admin.merchants.detail.descriptionKg")}
            </p>
            <p className="text-sm text-(--color-ink) font-medium px-1">
              {merchant.description.kg}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-1">
              {t("admin.merchants.detail.descriptionEn")}
            </p>
            <p className="text-sm text-(--color-ink) font-medium px-1">
              {merchant.description.en}
            </p>
          </div>
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
                {category.name[i18n.language as keyof typeof category.name]}
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
            {t("admin.merchants.detail.validityValue", { months: merchant.validityMonths })}
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
