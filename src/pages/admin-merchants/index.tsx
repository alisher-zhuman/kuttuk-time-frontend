import { useSearchParams } from "react-router";

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
    <div className="flex-1 flex flex-col">
      <CategoryFilter active={activeCategory} onChange={handleCategoryChange} />
    </div>
  );
};
