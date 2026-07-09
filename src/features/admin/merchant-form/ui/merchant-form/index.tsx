import { useTranslation } from "react-i18next";

import { useMainButton } from "@shared/hooks";

import { useMerchantForm } from "../../hooks/useMerchantForm";
import { MerchantFormAttributes } from "../merchant-form-attributes";
import { MerchantFormContact } from "../merchant-form-contact";
import { MerchantFormDescription } from "../merchant-form-description";
import { MerchantFormIdentity } from "../merchant-form-identity";

interface Props {
  merchantId?: number;
}

export const MerchantForm = ({ merchantId }: Props) => {
  const { t } = useTranslation();

  const isEdit = merchantId !== undefined;

  const {
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
  } = useMerchantForm(merchantId);

  useMainButton({
    text: t(isEdit ? "admin.merchants.form.save" : "admin.merchants.form.create"),
    onClick: () => void submit(),
    loading: isPending,
    hidden: isEdit && !isDirty
  });

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t(isEdit ? "admin.merchants.form.editTitle" : "admin.merchants.form.title")}
      </h1>

      <MerchantFormIdentity
        register={register}
        errors={errors}
        logo={logo}
        onLogoChange={setLogo}
        isEdit={isEdit}
        isActive={isActive}
        onIsActiveChange={setIsActive}
      />

      <MerchantFormDescription register={register} errors={errors} />

      <MerchantFormAttributes
        categories={categories}
        nominals={nominals}
        validityMonths={validityMonths}
        onCategoriesChange={setCategories}
        onNominalsChange={setNominals}
        onValidityMonthsChange={setValidityMonths}
        categoriesError={errors.categories?.message && t(errors.categories.message)}
        nominalsError={errors.nominals?.message && t(errors.nominals.message)}
        validityError={
          errors.validityMonths?.message && t(errors.validityMonths.message)
        }
      />

      <MerchantFormContact register={register} errors={errors} />
    </div>
  );
};
