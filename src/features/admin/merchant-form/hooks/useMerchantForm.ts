import { useEffect } from "react";

import { useTranslation } from "react-i18next";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { isAxiosError } from "axios";

import {
  useAdminMerchantQuery,
  useCreateMerchantMutation,
  useUpdateMerchantMutation
} from "@entities/merchant";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useNavigateTo, usePopup } from "@shared/hooks";

import { MerchantFormSchema } from "../model/schemas";
import type { MerchantFormValues } from "../model/types";

const CONFLICT_FIELDS = ["slug", "merchantTelegramId"] as const;

// The API reports unique-constraint conflicts as 409 with a message like
// `slug "sierra-coffee" is already in use` — the field name precedes the quote.
const getConflictField = (error: unknown) => {
  if (!isAxiosError(error) || error.response?.status !== 409) return null;

  const data = error.response.data as { message?: string } | undefined;
  const field = /^(\w+)\s+"/.exec(data?.message ?? "")?.[1];

  return CONFLICT_FIELDS.find((name) => name === field) ?? null;
};

export const useMerchantForm = (merchantId?: number) => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const showPopup = usePopup();

  const { merchant } = useAdminMerchantQuery(
    merchantId !== undefined ? String(merchantId) : undefined
  );

  const { mutate: create, isPending: isCreating } = useCreateMerchantMutation();
  const { mutate: update, isPending: isUpdating } = useUpdateMerchantMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    control,
    formState: { errors, isDirty }
  } = useForm<MerchantFormValues>({
    resolver: zodResolver(MerchantFormSchema),
    mode: "onChange",
    defaultValues: {
      logo: "",
      name: "",
      slug: "",
      descriptionRu: "",
      descriptionKg: "",
      descriptionEn: "",
      categories: [],
      nominals: [500],
      validityMonths: 12,
      isActive: true,
      merchantTelegramId: ""
    }
  });

  useEffect(() => {
    if (!merchant) return;

    reset({
      logo: merchant.logo,
      name: merchant.name,
      slug: merchant.slug,
      descriptionRu: merchant.description?.ru ?? "",
      descriptionKg: merchant.description?.kg ?? "",
      descriptionEn: merchant.description?.en ?? "",
      categories: merchant.categories,
      nominals: merchant.nominals,
      validityMonths: merchant.validityMonths,
      isActive: merchant.isActive,
      merchantTelegramId: String(merchant.merchantTelegramId)
    });
  }, [merchant, reset]);

  const logo = useWatch({ control, name: "logo" });
  const categories = useWatch({ control, name: "categories" });
  const nominals = useWatch({ control, name: "nominals" });
  const validityMonths = useWatch({ control, name: "validityMonths" });
  const isActive = useWatch({ control, name: "isActive" });

  const options = { shouldValidate: true, shouldDirty: true };

  const setLogo = (url: string) => setValue("logo", url, options);
  const setNominals = (next: number[]) => setValue("nominals", next, options);
  const setCategories = (next: number[]) => {
    setValue("categories", next, options);
  };
  const setValidityMonths = (months: number) => {
    setValue("validityMonths", months, options);
  };
  const setIsActive = (next: boolean) => setValue("isActive", next, options);

  const submit = handleSubmit((values) => {
    const payload = {
      name: values.name.trim(),
      description: {
        ru: values.descriptionRu.trim(),
        kg: values.descriptionKg.trim(),
        en: values.descriptionEn.trim()
      },
      categories: values.categories,
      nominals: values.nominals,
      validityMonths: values.validityMonths,
      logo: values.logo,
      merchantTelegramId: Number(values.merchantTelegramId),
      slug: values.slug.trim()
    };

    const callbacks = {
      onSuccess: () => {
        haptic.success();
        navigateTo(ROUTE_PATTERNS.ADMIN_MERCHANTS);
      },
      onError: (error: unknown) => {
        haptic.error();

        const field = getConflictField(error);

        if (field) {
          setError(field, { message: "admin.merchants.form.alreadyInUse" });
          return;
        }

        showPopup({
          title: t("errors.genericTitle"),
          message: t("errors.generic")
        });
      }
    };

    if (merchantId !== undefined) {
      update(
        { id: merchantId, payload: { ...payload, isActive: values.isActive } },
        callbacks
      );
    } else {
      create(payload, callbacks);
    }
  });

  return {
    register,
    errors,
    isPending: merchantId !== undefined ? isUpdating : isCreating,
    isDirty,
    logo,
    categories,
    nominals,
    validityMonths,
    isActive,
    setLogo,
    setCategories,
    setNominals,
    setValidityMonths,
    setIsActive,
    submit
  };
};
