import { useState } from "react";

import { useTranslation } from "react-i18next";

import { useCreateCategoryMutation } from "@entities/merchant";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useMainButton, useNavigateTo } from "@shared/hooks";
import { Input } from "@shared/ui";

export const AdminCategoriesPage = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const [ru, setRu] = useState("");
  const [kg, setKg] = useState("");
  const [en, setEn] = useState("");

  const { mutate, isPending } = useCreateCategoryMutation();

  const canSubmit = Boolean(ru.trim() && kg.trim() && en.trim());

  const handleSubmit = () => {
    if (!canSubmit) return;

    mutate(
      { name: { ru: ru.trim(), kg: kg.trim(), en: en.trim() } },
      {
        onSuccess: () => {
          haptic.success();
          navigateTo(ROUTE_PATTERNS.ADMIN_MERCHANTS);
        },
        onError: () => haptic.error(),
      },
    );
  };

  useMainButton({
    text: t("admin.categories.create"),
    onClick: handleSubmit,
    disabled: !canSubmit,
    loading: isPending,
  });

  return (
    <div className="flex flex-col gap-4 mt-3.5">
      <h1 className="text-xs font-bold text-(--color-hint) tracking-wider pb-1 px-1">
        {t("admin.categories.title")}
      </h1>

      <Input
        label={t("admin.categories.nameRu")}
        value={ru}
        onChange={(e) => setRu(e.target.value)}
        placeholder={t("admin.categories.namePlaceholder")}
      />

      <Input
        label={t("admin.categories.nameKg")}
        value={kg}
        onChange={(e) => setKg(e.target.value)}
        placeholder={t("admin.categories.namePlaceholder")}
      />

      <Input
        label={t("admin.categories.nameEn")}
        value={en}
        onChange={(e) => setEn(e.target.value)}
        placeholder={t("admin.categories.namePlaceholder")}
      />
    </div>
  );
};
