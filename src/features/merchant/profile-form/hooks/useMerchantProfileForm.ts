import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import {
  useMerchantMeQuery,
  useUpdateMerchantMeMutation
} from "@entities/merchant";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useGenericError, useHaptic, useNavigateTo } from "@shared/hooks";

import { MerchantProfileFormSchema } from "../model/schemas";
import type { MerchantProfileFormValues } from "../model/types";

export const useMerchantProfileForm = () => {
  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const showGenericError = useGenericError();

  const { merchant } = useMerchantMeQuery();

  const { mutate, isPending } = useUpdateMerchantMeMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isDirty }
  } = useForm<MerchantProfileFormValues>({
    resolver: zodResolver(MerchantProfileFormSchema),
    mode: "onChange",
    defaultValues: {
      logo: "",
      name: "",
      descriptionRu: "",
      descriptionKg: "",
      descriptionEn: "",
      categories: [],
      nominals: [500],
      validityMonths: 12
    }
  });

  useEffect(() => {
    if (!merchant) return;

    reset({
      logo: merchant.logo,
      name: merchant.name,
      descriptionRu: merchant.description?.ru ?? "",
      descriptionKg: merchant.description?.kg ?? "",
      descriptionEn: merchant.description?.en ?? "",
      categories: merchant.categories,
      nominals: merchant.nominals,
      validityMonths: merchant.validityMonths
    });
  }, [merchant, reset]);

  const logo = useWatch({ control, name: "logo" });
  const categories = useWatch({ control, name: "categories" });
  const nominals = useWatch({ control, name: "nominals" });
  const validityMonths = useWatch({ control, name: "validityMonths" });

  const options = { shouldValidate: true, shouldDirty: true };

  const setLogo = (url: string) => setValue("logo", url, options);
  const setNominals = (next: number[]) => setValue("nominals", next, options);
  const setCategories = (next: number[]) => {
    setValue("categories", next, options);
  };
  const setValidityMonths = (months: number) => {
    setValue("validityMonths", months, options);
  };

  const submit = handleSubmit((values) => {
    mutate(
      {
        name: values.name.trim(),
        description: {
          ru: values.descriptionRu.trim(),
          kg: values.descriptionKg.trim(),
          en: values.descriptionEn.trim()
        },
        categories: values.categories,
        nominals: values.nominals,
        validityMonths: values.validityMonths,
        logo: values.logo
      },
      {
        onSuccess: () => {
          haptic.success();
          navigateTo(ROUTE_PATTERNS.MERCHANT_HOME);
        },
        onError: () => showGenericError()
      }
    );
  });

  return {
    register,
    errors,
    isPending,
    isDirty,
    logo,
    categories,
    nominals,
    validityMonths,
    setLogo,
    setCategories,
    setNominals,
    setValidityMonths,
    submit
  };
};
