import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  type AdminCategory,
  useCreateCategoryMutation,
  useEditCategoryMutation
} from "@entities/category";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useGenericError, useHaptic, useNavigateTo } from "@shared/hooks";

import { CategoryFormSchema } from "../model/schemas";
import type { CategoryFormValues } from "../model/types";

// Edit mode receives an already-loaded category (the page gates on the query),
// so defaultValues are final on the first render — no reset() racing user input.
export const useCategoryForm = (category?: AdminCategory) => {
  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const showGenericError = useGenericError();

  const { mutate: create, isPending: isCreating } = useCreateCategoryMutation();
  const { mutate: edit, isPending: isEditing } = useEditCategoryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    mode: "onChange",
    defaultValues: {
      ru: category?.name.ru ?? "",
      kg: category?.name.kg ?? "",
      en: category?.name.en ?? "",
      order: ""
    }
  });

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
      onError: showGenericError
    };

    if (category) {
      edit({ id: category.id, name }, callbacks);
    } else {
      create({ name, ...(values.order.trim() && { order: Number(values.order) }) }, callbacks);
    }
  });

  return {
    register,
    errors,
    isPending: category ? isEditing : isCreating,
    isDirty,
    submit
  };
};
