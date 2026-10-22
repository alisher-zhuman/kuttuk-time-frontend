import { useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { isAxiosError } from "axios";

import { useCreateMerchantMutation, useUpdateMerchantMutation } from "@entities/merchant";

import { getAdminMerchantDetailRoute } from "@shared/constants";
import { useGenericError, useHaptic, useNavigateTo } from "@shared/hooks";

import { MerchantFormSchema } from "../model/schemas";
import type { MerchantFormValues, MerchantFormVariant } from "../model/types";

// 409 = another merchant already has this Telegram ID:
// `telegramId "123456789" is already in use`.
const isTelegramIdConflict = (error: unknown) =>
  isAxiosError(error) && error.response?.status === 409;

// The edit page gates on the query, so defaultValues are final on the first
// render — no reset() that could wipe input typed while loading.
export const useMerchantForm = (variant: MerchantFormVariant) => {
  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const showGenericError = useGenericError();

  const { mutate: create, isPending: isCreating } = useCreateMerchantMutation();
  const { mutate: update, isPending: isUpdating } = useUpdateMerchantMutation();

  const merchant = variant.kind === "edit" ? variant.merchant : undefined;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isDirty }
  } = useForm<MerchantFormValues>({
    resolver: zodResolver(MerchantFormSchema),
    mode: "onChange",
    defaultValues: {
      name: merchant?.name ?? "",
      telegramId: merchant ? String(merchant.telegramId) : "",
      isActive: merchant?.isActive ?? true
    }
  });

  const isActive = useWatch({ control, name: "isActive" });

  const setIsActive = (next: boolean) =>
    setValue("isActive", next, { shouldValidate: true, shouldDirty: true });

  // isPending lands a render late — two taps in one frame would both submit
  // (and create two records).
  const isSubmittingRef = useRef(false);
  const release = () => {
    isSubmittingRef.current = false;
  };

  const onValid = (values: MerchantFormValues) => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;

    const payload = { name: values.name.trim(), telegramId: Number(values.telegramId) };

    const onError = (error: unknown) => {
      if (isTelegramIdConflict(error)) {
        haptic.error();
        setError("telegramId", { message: "merchantForm.alreadyInUse" });
        return;
      }

      showGenericError();
    };

    if (merchant) {
      update(
        { id: merchant.id, payload: { ...payload, isActive: values.isActive } },
        {
          // Back to the merchant's page, which the edit was opened from.
          onSuccess: () => {
            haptic.success();
            navigateTo(-1);
          },
          onError,
          onSettled: release
        }
      );
      return;
    }

    create(payload, {
      // Straight to the new merchant's page — the next step is adding a venue.
      // replace: "back" from there returns to the list, not to this form.
      onSuccess: (created) => {
        haptic.success();
        navigateTo(getAdminMerchantDetailRoute(created.id), { replace: true });
      },
      onError,
      onSettled: release
    });
  };

  // handleSubmit runs on tap, not during render — onValid reads the ref.
  const submit = () => handleSubmit(onValid)();

  return {
    register,
    errors,
    isPending: isCreating || isUpdating,
    isDirty,
    isActive,
    setIsActive,
    submit
  };
};
