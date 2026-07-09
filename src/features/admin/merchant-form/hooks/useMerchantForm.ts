import { useTranslation } from "react-i18next";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { isAxiosError } from "axios";

import { useCreateMerchantMutation } from "@entities/merchant";

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

export const useMerchantForm = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const showPopup = usePopup();

  const { mutate: create, isPending } = useCreateMerchantMutation();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors }
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
      nominals: [],
      validityMonths: "12",
      merchantTelegramId: ""
    }
  });

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
  const setValidityMonths = (months: string) => {
    setValue("validityMonths", months, options);
  };

  const submit = handleSubmit((values) => {
    create(
      {
        name: values.name.trim(),
        description: {
          ru: values.descriptionRu.trim(),
          kg: values.descriptionKg.trim(),
          en: values.descriptionEn.trim()
        },
        categories: values.categories,
        nominals: values.nominals,
        validityMonths: Number(values.validityMonths),
        logo: values.logo,
        merchantTelegramId: Number(values.merchantTelegramId),
        slug: values.slug.trim()
      },
      {
        onSuccess: () => {
          haptic.success();
          navigateTo(ROUTE_PATTERNS.ADMIN_MERCHANTS);
        },
        onError: (error) => {
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
      }
    );
  });

  return {
    register,
    errors,
    isPending,
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
