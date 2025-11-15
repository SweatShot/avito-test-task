import { useMemo } from "react";
import { Advertisement } from "../../../types/apiTypes";

export const useCategories = (ads: Advertisement[]) =>
  useMemo(() => {
    return Array.from(new Set(ads.map((ad) => ad.category))).filter(Boolean);
  }, [ads]);
