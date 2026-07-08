import { useEffect } from "react";

import { useTranslation } from "react-i18next";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAdminCategoriesQuery, useEditCategoryMutation } from "@entities/category";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useNavigateTo, usePopup } from "@shared/hooks";

import { CategoryEditFormSchema } from "../model/schemas";
import type { CategoryEditFormValues } from "../model/types";

export const useCategoryEditForm = (categoryId: number) => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const showPopup = usePopup();

  const { categories } = useAdminCategoriesQuery();

  const category = categories.find((c) => c.id === categoryId);

  const { mutate, isPending } = useEditCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryEditFormValues>({
    resolver: zodResolver(CategoryEditFormSchema),
    mode: "onChange",
    defaultValues: { ru: "", kg: "", en: "" },
  });

  useEffect(() => {
    if (category) {
      reset({ ru: category.name.ru, kg: category.name.kg, en: category.name.en });
    }
  }, [category, reset]);

  const submit = handleSubmit((values) => {
    mutate(
      {
        id: categoryId,
        name: {
          ru: values.ru.trim(),
          kg: values.kg.trim(),
          en: values.en.trim(),
        },
      },
      {
        onSuccess: () => {
          haptic.success();
          navigateTo(ROUTE_PATTERNS.ADMIN_CATEGORIES);
        },
        onError: () => {
          haptic.error();
          showPopup({
            title: t("errors.genericTitle"),
            message: t("errors.generic"),
          });
        },
      },
    );
  });

  return { register, errors, isPending, submit };
};
