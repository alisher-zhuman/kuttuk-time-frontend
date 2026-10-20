import { useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { isAxiosError } from "axios";

import {
  type AdminMerchantDetail,
  type MerchantOptions,
  useUpdateMerchantMeMutation
} from "@entities/merchant";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useGenericError, useHaptic, useNavigateTo } from "@shared/hooks";

import { createMerchantProfileFormSchema } from "../model/schemas";
import type { MerchantProfileFormValues } from "../model/types";

// Receives an already-loaded profile (the page gates on the query), so
// defaultValues are final on the first render — no reset() racing user input.
export const useMerchantProfileForm = (
  merchant: AdminMerchantDetail,
  options: MerchantOptions
) => {
  const schema = useMemo(() => createMerchantProfileFormSchema(options), [options]);

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const showGenericError = useGenericError();

  const { mutate, isPending } = useUpdateMerchantMeMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty }
  } = useForm<MerchantProfileFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      logo: merchant.logo,
      name: merchant.name,
      descriptionRu: merchant.description.ru,
      descriptionKg: merchant.description.kg,
      descriptionEn: merchant.description.en,
      categories: merchant.categories,
      nominals: merchant.nominals,
      validityMonths: merchant.validityMonths
    }
  });

  const logo = useWatch({ control, name: "logo" });
  const categories = useWatch({ control, name: "categories" });
  const nominals = useWatch({ control, name: "nominals" });
  const validityMonths = useWatch({ control, name: "validityMonths" });

  const setValueOptions = { shouldValidate: true, shouldDirty: true };

  const setLogo = (url: string) => setValue("logo", url, setValueOptions);
  const setNominals = (next: number[]) => setValue("nominals", next, setValueOptions);
  const setCategories = (next: number[]) => {
    setValue("categories", next, setValueOptions);
  };
  const setValidityMonths = (months: number) => {
    setValue("validityMonths", months, setValueOptions);
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
        onError: (error) => {
          // Deactivated mid-edit: the page swaps to the deactivated notice once
          // the mutation's refetch lands, so a generic popup would only confuse.
          if (isAxiosError(error) && error.response?.status === 403) {
            haptic.error();
            return;
          }

          showGenericError();
        }
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
