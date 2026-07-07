import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCreateCategoryMutation } from "@entities/category";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";

import { CategoryFormSchema } from "../model/schemas";
import type { CategoryFormValues } from "../model/types";

export const useCategoryForm = () => {
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

  const submit = handleSubmit((values) => {
    mutate(
      {
        name: {
          ru: values.ru.trim(),
          kg: values.kg.trim(),
          en: values.en.trim(),
        },
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

  return { register, errors, isValid, isPending, submit };
};
