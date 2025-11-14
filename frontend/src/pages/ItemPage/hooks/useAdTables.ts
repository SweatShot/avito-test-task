import { Advertisement } from "../../../types/apiTypes";


export function useAdTables(ad: Advertisement) {
  const characteristicsRows = Object.entries(ad.characteristics).map(
    ([key, value]) => [key, value]
  );

  const sellerRows = [
    ["Имя", ad.seller.name],
    ["Рейтинг", ad.seller.rating],
    ["Количество объявлений", ad.seller.totalAds],
    ["Дата регистрации", new Date(ad.seller.registeredAt).toLocaleDateString()],
  ];

  const moderationRows = ad.moderationHistory.map(h => [
    h.moderatorName,
    new Date(h.timestamp).toLocaleString(),
    h.action,
    h.comment || "-",
  ]);

  return { characteristicsRows, sellerRows, moderationRows };
}
