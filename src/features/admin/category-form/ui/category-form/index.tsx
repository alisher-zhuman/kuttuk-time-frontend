import { useTranslation } from "react-i18next";

import { Trash2 } from "lucide-react";

import { useMainButton } from "@shared/hooks";
import { Input } from "@shared/ui";

import { useCategoryForm } from "../../hooks/useCategoryForm";

interface Props {
  categoryId?: number;
}

export const CategoryForm = ({ categoryId }: Props) => {
  const { t } = useTranslation();

  const isEdit = categoryId !== undefined;

  const { register, errors, isPending, isDeleting, isDirty, submit, handleDelete } =
    useCategoryForm(categoryId);

  useMainButton({
    text: t(isEdit ? "admin.categories.save" : "admin.categories.create"),
    onClick: () => void submit(),
    loading: isPending,
    hidden: isEdit && !isDirty
  });

  return (
    <div className="flex flex-col gap-4 mt-3.5">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
          {t(isEdit ? "admin.categories.editTitle" : "admin.categories.title")}
        </h1>

        {isEdit && (
          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={isDeleting}
            aria-label={t("admin.categories.delete")}
            className="shrink-0 p-2 -m-2 text-(--color-accent) cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

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

      {!isEdit && (
        <Input
          type="number"
          min={0}
          label={t("admin.categories.order")}
          placeholder={t("admin.categories.orderPlaceholder")}
          error={errors.order?.message && t(errors.order.message)}
          {...register("order")}
        />
      )}
    </div>
  );
};
