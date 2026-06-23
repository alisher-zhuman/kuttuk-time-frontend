import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../api";

export const useCategories = () =>
  useQuery({
    queryKey: ["merchants", "categories"],
    queryFn: getCategories,
  });
