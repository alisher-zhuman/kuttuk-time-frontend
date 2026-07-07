import { useTranslation } from "react-i18next";

import { useMainButton } from "@shared/hooks";
import { Input } from "@shared/ui";

import { useCategoryForm } from "../../hooks/useCategoryForm";

export const CategoryForm = () => {
  const { t } = useTranslation();

  const { register, errors, isValid, isPending, submit } = useCategoryForm();

  useMainButton({
    text: t("admin.categories.create"),
    onClick: () => void submit(),
    disabled: !isValid,
    loading: isPending,
  });

  return (
    <div className="flex flex-col gap-4 mt-3.5">
      <h1 className="text-xs font-bold text-(--color-hint) tracking-wider pb-1 px-1">
        {t("admin.categories.title")}
      </h1>

      <Input
        label={t("admin.categories.nameRu")}
        placeholder={t("admin.categories.namePlaceholder")}
        error={errors.ru?.message && t(errors.ru.message)}
        {...register("ru")}
      />

      <Input
        label={t("admin.categories.nameKg")}
        placeholder={t("admin.categories.namePlaceholder")}
        error={errors.kg?.message && t(errors.kg.message)}
        {...register("kg")}
      />

      <Input
        label={t("admin.categories.nameEn")}
        placeholder={t("admin.categories.namePlaceholder")}
        error={errors.en?.message && t(errors.en.message)}
        {...register("en")}
      />

      <Input
        type="number"
        label={t("admin.categories.order")}
        placeholder={t("admin.categories.orderPlaceholder")}
        error={errors.order?.message && t(errors.order.message)}
        {...register("order")}
      />
    </div>
  );
};
