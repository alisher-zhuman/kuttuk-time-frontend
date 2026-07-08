import { useTranslation } from "react-i18next";

import { useMainButton } from "@shared/hooks";
import { Input } from "@shared/ui";

import { useCategoryEditForm } from "../../hooks/useCategoryEditForm";

interface Props {
  categoryId: number;
}

export const CategoryEditForm = ({ categoryId }: Props) => {
  const { t } = useTranslation();

  const { register, errors, isPending, submit } = useCategoryEditForm(categoryId);

  useMainButton({
    text: t("admin.categories.save"),
    onClick: () => void submit(),
    loading: isPending,
  });

  return (
    <div className="flex flex-col gap-4 mt-3.5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t("admin.categories.editTitle")}
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
    </div>
  );
};
