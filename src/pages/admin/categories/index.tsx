import { useTranslation } from "react-i18next";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCreateCategoryMutation } from "@entities/merchant";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useMainButton, useNavigateTo } from "@shared/hooks";
import { Input } from "@shared/ui";

import { CategoryFormSchema, type CategoryFormValues } from "./schema";

export const AdminCategoriesPage = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const { mutate, isPending } = useCreateCategoryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    mode: "onChange",
    defaultValues: { ru: "", kg: "", en: "", order: "" },
  });

  const onSubmit = handleSubmit((values) => {
    mutate(
      {
        name: { ru: values.ru.trim(), kg: values.kg.trim(), en: values.en.trim() },
        ...(values.order.trim() && { order: Number(values.order) }),
      },
      {
        onSuccess: () => {
          haptic.success();
          navigateTo(ROUTE_PATTERNS.ADMIN_MERCHANTS);
        },
        onError: () => haptic.error(),
      },
    );
  });

  useMainButton({
    text: t("admin.categories.create"),
    onClick: () => void onSubmit(),
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
