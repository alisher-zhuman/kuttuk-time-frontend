import { useSearchParams } from "react-router";

import { AdminMerchantList } from "@widgets/admin-merchants";
import { CategoryFilter } from "@widgets/home";

export const AdminMerchantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");
  const activeCategory = categoryParam ? Number(categoryParam) : null;

  const handleCategoryChange = (category: number | null) => {
    setSearchParams(
      (prev) => {
        if (category !== null) {
          prev.set("category", String(category));
        } else {
          prev.delete("category");
        }

        return prev;
      },
      { replace: true },
    );
  };

  return (
    <>
      <CategoryFilter active={activeCategory} onChange={handleCategoryChange} />

      <AdminMerchantList />
    </>
  );
};
