import { useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { isAxiosError } from "axios";

import {
  type MerchantOptions,
  useCreateMerchantMutation,
  useUpdateMerchantMeMutation,
  useUpdateMerchantMutation
} from "@entities/merchant";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useGenericError, useHaptic, useNavigateTo } from "@shared/hooks";

import { createMerchantFormSchema } from "../model/schemas";
import type { MerchantFormValues, MerchantFormVariant } from "../model/types";

const CONFLICT_FIELDS = ["slug", "merchantTelegramId"] as const;

// The API reports unique-constraint conflicts as 409 with a message like
// `slug "sierra-coffee" is already in use` — the field name precedes the quote.
const getConflictField = (error: unknown) => {
  if (!isAxiosError(error) || error.response?.status !== 409) return null;

  const data = error.response.data as { message?: string } | undefined;
  const field = /^(\w+)\s+"/.exec(data?.message ?? "")?.[1];

  return CONFLICT_FIELDS.find((name) => name === field) ?? null;
};

// Product defaults for a new merchant — not an allowed-values list; used only
// while the backend still offers them.
const DEFAULT_NOMINAL = 500;
const DEFAULT_VALIDITY_MONTHS = 12;

// Edit variants receive an already-loaded merchant (the page gates on the
// query), so defaultValues are final on the first render — no reset() that
// could wipe what the user typed while the request was in flight.
export const useMerchantForm = (options: MerchantOptions, variant: MerchantFormVariant) => {
  const isAdmin = variant.kind !== "own";
  const merchant = variant.kind === "create" ? undefined : variant.merchant;

  const schema = useMemo(() => createMerchantFormSchema(options, isAdmin), [options, isAdmin]);

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const showGenericError = useGenericError();

  const { mutate: create, isPending: isCreating } = useCreateMerchantMutation();
  const { mutate: update, isPending: isUpdating } = useUpdateMerchantMutation();
  const { mutate: updateOwn, isPending: isUpdatingOwn } = useUpdateMerchantMeMutation();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isDirty }
  } = useForm<MerchantFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: merchant
      ? {
          logo: merchant.logo,
          name: merchant.name,
          slug: merchant.slug,
          descriptionRu: merchant.description.ru,
          descriptionKg: merchant.description.kg,
          descriptionEn: merchant.description.en,
          categories: merchant.categories,
          nominals: merchant.nominals,
          validityMonths: merchant.validityMonths,
          isActive: merchant.isActive,
          merchantTelegramId: String(merchant.merchantTelegramId)
        }
      : {
          logo: "",
          name: "",
          slug: "",
          descriptionRu: "",
          descriptionKg: "",
          descriptionEn: "",
          categories: [],
          nominals: options.nominals.includes(DEFAULT_NOMINAL) ? [DEFAULT_NOMINAL] : [],
          validityMonths: options.validityMonths.includes(DEFAULT_VALIDITY_MONTHS)
            ? DEFAULT_VALIDITY_MONTHS
            : options.validityMonths[0]!,
          isActive: true,
          merchantTelegramId: ""
        }
  });

  const logo = useWatch({ control, name: "logo" });
  const categories = useWatch({ control, name: "categories" });
  const nominals = useWatch({ control, name: "nominals" });
  const validityMonths = useWatch({ control, name: "validityMonths" });
  const isActive = useWatch({ control, name: "isActive" });

  const setValueOptions = { shouldValidate: true, shouldDirty: true };

  const setLogo = (url: string) => setValue("logo", url, setValueOptions);
  const setNominals = (next: number[]) => setValue("nominals", next, setValueOptions);
  const setCategories = (next: number[]) => {
    setValue("categories", next, setValueOptions);
  };
  const setValidityMonths = (months: number) => {
    setValue("validityMonths", months, setValueOptions);
  };
  const setIsActive = (next: boolean) => setValue("isActive", next, setValueOptions);

  const submit = handleSubmit((values) => {
    const storefront = {
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
    };

    if (variant.kind === "own") {
      updateOwn(storefront, {
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
      });
      return;
    }

    const payload = {
      ...storefront,
      merchantTelegramId: Number(values.merchantTelegramId),
      slug: values.slug.trim()
    };

    const callbacks = {
      onSuccess: () => {
        haptic.success();
        navigateTo(ROUTE_PATTERNS.ADMIN_MERCHANTS);
      },
      onError: (error: unknown) => {
        const field = getConflictField(error);

        if (field) {
          haptic.error();
          setError(field, { message: "merchantForm.alreadyInUse" });
          return;
        }

        showGenericError();
      }
    };

    if (variant.kind === "edit") {
      update(
        { id: variant.merchant.id, payload: { ...payload, isActive: values.isActive } },
        callbacks
      );
    } else {
      create(payload, callbacks);
    }
  });

  const isPending = { create: isCreating, edit: isUpdating, own: isUpdatingOwn }[variant.kind];

  return {
    register,
    errors,
    isPending,
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
