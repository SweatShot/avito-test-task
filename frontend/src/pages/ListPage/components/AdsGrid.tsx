import AdCard from "./AdsCard";
import { Advertisement } from "../../../types/apiTypes";
import "./AdsGrid.css"

export default function AdsGrid({ ads, allIds }: { ads: Advertisement[]; allIds: number[] }) {
  return (
    <div className="ads-grid">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} allIds={allIds} />
      ))}
    </div>
  );
}
