import { useNavigate, useLocation } from "react-router-dom";

export const useItemNavigation = (currentId: number, allIds?: number[]) => {
  const navigate = useNavigate();
  const location = useLocation();

  const adsIdsFromList: number[] | undefined =
    (location.state as { adsIds?: number[] } | undefined)?.adsIds;

  const adsIds: number[] | undefined = adsIdsFromList || allIds;
  const currentIndex = adsIds?.findIndex((i) => i === currentId) ?? -1;

  const goPrev = () => {
    if (!adsIds || currentIndex <= 0) return;
    navigate(`/item/${adsIds[currentIndex - 1]}`, { state: { adsIds } });
  };

  const goNext = () => {
    if (!adsIds || currentIndex === -1 || currentIndex >= adsIds.length - 1)
      return;
    navigate(`/item/${adsIds[currentIndex + 1]}`, { state: { adsIds } });
  };

  const goList = () => navigate("/list");

  return { goPrev, goNext, goList, currentIndex };
};
