import { useMemo, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { isAxiosError } from "axios";

import {
  useCreateVenueMutation,
  useUpdateOwnVenueMutation,
  useUpdateVenueMutation,
  type VenueOptions
} from "@entities/venue";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useGenericError, useHaptic, useNavigateTo } from "@shared/hooks";

import { createVenueFormSchema } from "../model/schemas";
import type { VenueFormValues, VenueFormVariant } from "../model/types";

// 409 = slug already taken: `slug "sierra-coffee" is already in use`.
// 400 on the map link: not 2GIS / Google Maps / Yandex Maps (the backend's
// list) - «mapUrl must be a 2GIS, Google Maps or Yandex Maps https link».
const isMapUrlRejected = (error: unknown) =>
  isAxiosError(error) &&
  error.response?.status === 400 &&
  JSON.stringify((error.response.data as { message?: unknown } | undefined)?.message ?? "").includes("mapUrl");

const isSlugConflict = (error: unknown) =>
  isAxiosError(error) &&
  error.response?.status === 409 &&
  /^slug\s+"/.test((error.response.data as { message?: string } | undefined)?.message ?? "");

// Product defaults for a new venue - not an allowed-values list; used only
// while the backend still offers them.
const DEFAULT_NOMINAL = 500;
const DEFAULT_VALIDITY_MONTHS = 12;

// Edit variants receive an already-loaded venue (the page gates on the query),
// so defaultValues are final on the first render - no reset() that could wipe
// what the user typed while the request was in flight.
export const useVenueForm = (
  options: VenueOptions,
  variant: VenueFormVariant,
  categoryIds: number[]
) => {
  const isAdmin = variant.kind !== "own";
  const venue = variant.kind === "create" ? undefined : variant.venue;

  const schema = useMemo(
    () => createVenueFormSchema(options, isAdmin, categoryIds),
    [options, isAdmin, categoryIds]
  );

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const showGenericError = useGenericError();

  const { mutate: create, isPending: isCreating } = useCreateVenueMutation();
  const { mutate: update, isPending: isUpdating } = useUpdateVenueMutation();
  const { mutate: updateOwn, isPending: isUpdatingOwn } = useUpdateOwnVenueMutation();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isDirty }
  } = useForm<VenueFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: venue
      ? {
          logo: venue.logo,
          name: venue.name,
          slug: venue.slug,
          merchantId: variant.kind === "edit" ? variant.venue.merchantId : 0,
          descriptionRu: venue.description.ru,
          descriptionKg: venue.description.kg,
          descriptionEn: venue.description.en,
          categories: venue.categories,
          nominals: venue.nominals,
          validityMonths: venue.validityMonths,
          isActive: venue.isActive,
          address: venue.address,
          mapUrl: venue.mapUrl
        }
      : {
          logo: "",
          name: "",
          slug: "",
          // 0 = not chosen yet → "choose a merchant" on submit.
          merchantId: variant.kind === "create" ? (variant.merchantId ?? 0) : 0,
          descriptionRu: "",
          descriptionKg: "",
          descriptionEn: "",
          categories: [],
          nominals: options.nominals.includes(DEFAULT_NOMINAL) ? [DEFAULT_NOMINAL] : [],
          validityMonths: options.validityMonths.includes(DEFAULT_VALIDITY_MONTHS)
            ? DEFAULT_VALIDITY_MONTHS
            : options.validityMonths[0]!,
          isActive: true,
          address: "",
          mapUrl: ""
        }
  });

  const logo = useWatch({ control, name: "logo" });
  const merchantId = useWatch({ control, name: "merchantId" });
  const categories = useWatch({ control, name: "categories" });
  const nominals = useWatch({ control, name: "nominals" });
  const validityMonths = useWatch({ control, name: "validityMonths" });
  const isActive = useWatch({ control, name: "isActive" });
  const address = useWatch({ control, name: "address" });
  const mapUrl = useWatch({ control, name: "mapUrl" });

  // Every venue says where it is - no saving without both.
  const hasPlace = address.trim() !== "" && mapUrl.trim() !== "";

  const setValueOptions = { shouldValidate: true, shouldDirty: true };

  const setLogo = (url: string) => setValue("logo", url, setValueOptions);
  const setMerchantId = (id: number) => setValue("merchantId", id, setValueOptions);
  const setNominals = (next: number[]) => setValue("nominals", next, setValueOptions);
  const setCategories = (next: number[]) => setValue("categories", next, setValueOptions);
  const setValidityMonths = (months: number) => {
    setValue("validityMonths", months, setValueOptions);
  };
  const setIsActive = (next: boolean) => setValue("isActive", next, setValueOptions);

  // isPending lands a render late - two taps in one frame would both submit
  // (and create two records).
  const isSubmittingRef = useRef(false);
  const release = () => {
    isSubmittingRef.current = false;
  };

  const onValid = (values: VenueFormValues) => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;

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
      logo: values.logo,
      address: values.address.trim(),
      mapUrl: values.mapUrl.trim()
    };

    const onMapUrlRejected = (error: unknown) => {
      if (!isMapUrlRejected(error)) return false;

      haptic.error();
      setError("mapUrl", { message: "venueForm.mapUrlInvalid" });
      return true;
    };

    if (variant.kind === "own") {
      updateOwn(
        { venueId: variant.venue.id, payload: storefront },
        {
          onSuccess: () => {
            haptic.success();
            navigateTo(ROUTE_PATTERNS.MERCHANT_HOME);
          },
          onError: (error) => {
            // Deactivated mid-edit: the page swaps to the deactivated notice
            // once the mutation's refetch lands, so a popup would only confuse.
            if (isAxiosError(error) && error.response?.status === 403) {
              haptic.error();
              return;
            }

            if (onMapUrlRejected(error)) return;

            showGenericError();
          },
          onSettled: release
        }
      );
      return;
    }

    const payload = { ...storefront, merchantId: values.merchantId, slug: values.slug.trim() };

    const callbacks = {
      // Back to where the form was opened: the venue list, the venue's page, or
      // the merchant's page ("add venue").
      onSuccess: () => {
        haptic.success();
        navigateTo(-1);
      },
      onError: (error: unknown) => {
        if (isSlugConflict(error)) {
          haptic.error();
          setError("slug", { message: "venueForm.alreadyInUse" });
          return;
        }

        if (onMapUrlRejected(error)) return;

        showGenericError();
      },
      onSettled: release
    };

    if (variant.kind === "edit") {
      update(
        { id: variant.venue.id, payload: { ...payload, isActive: values.isActive } },
        callbacks
      );
    } else {
      create(payload, callbacks);
    }
  };

  // handleSubmit runs on tap, not during render - onValid reads the ref.
  const submit = () => handleSubmit(onValid)();

  const isPending = { create: isCreating, edit: isUpdating, own: isUpdatingOwn }[variant.kind];

  return {
    register,
    errors,
    isPending,
    isDirty,
    logo,
    merchantId,
    categories,
    nominals,
    validityMonths,
    isActive,
    hasPlace,
    setLogo,
    setMerchantId,
    setCategories,
    setNominals,
    setValidityMonths,
    setIsActive,
    submit
  };
};
