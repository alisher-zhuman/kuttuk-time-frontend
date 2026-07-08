import { useEffect } from "react";

import { useTranslation } from "react-i18next";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  useAdminCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation
} from "@entities/category";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useNavigateTo, usePopup } from "@shared/hooks";

import { CategoryFormSchema } from "../model/schemas";
import type { CategoryFormValues } from "../model/types";

export const useCategoryForm = (categoryId?: number) => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const showPopup = usePopup();

  const { categories } = useAdminCategoriesQuery();
  const category = categories.find((c) => c.id === categoryId);

  const { mutate: create, isPending: isCreating } = useCreateCategoryMutation();
  const { mutate: edit, isPending: isEditing } = useEditCategoryMutation();
  const { mutate: remove, isPending: isDeleting } = useDeleteCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    mode: "onChange",
    defaultValues: { ru: "", kg: "", en: "", order: "" }
  });

  useEffect(() => {
    if (category) {
      reset({ ru: category.name.ru, kg: category.name.kg, en: category.name.en, order: "" });
    }
  }, [category, reset]);

  const submit = handleSubmit((values) => {
    const name = {
      ru: values.ru.trim(),
      kg: values.kg.trim(),
      en: values.en.trim()
    };

    const callbacks = {
      onSuccess: () => {
        haptic.success();
        navigateTo(ROUTE_PATTERNS.ADMIN_CATEGORIES);
      },
      onError: () => {
        haptic.error();
        showPopup({
          title: t("errors.genericTitle"),
          message: t("errors.generic")
        });
      }
    };

    if (categoryId !== undefined) {
      edit({ id: categoryId, name }, callbacks);
    } else {
      create({ name, ...(values.order.trim() && { order: Number(values.order) }) }, callbacks);
    }
  });

  const handleDelete = async () => {
    if (categoryId === undefined) return;

    const buttonId = await showPopup({
      title: t("admin.categories.deleteConfirmTitle"),
      message: t("admin.categories.deleteConfirmMessage"),
      buttons: [
        { id: "cancel", type: "cancel" },
        { id: "delete", type: "destructive", text: t("admin.categories.delete") }
      ]
    });

    if (buttonId !== "delete") return;

    remove(categoryId, {
      onSuccess: () => {
        haptic.success();
        navigateTo(ROUTE_PATTERNS.ADMIN_CATEGORIES);
      },
      onError: () => {
        haptic.error();
        showPopup({
          title: t("errors.genericTitle"),
          message: t("errors.generic")
        });
      }
    });
  };

  return {
    register,
    errors,
    isPending: categoryId !== undefined ? isEditing : isCreating,
    isDeleting,
    isDirty,
    submit,
    handleDelete
  };
};
