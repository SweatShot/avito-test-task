import NavigationButtons from "../../../components/NavigationButtons/NavigationButtons";
import { Advertisement } from "../../../types/apiTypes";
import Gallery from "./Gallery";

interface AdHeaderProps {
  ad: Advertisement; 
  navigation: {
    goPrev: () => void;
    goNext: () => void;
    goList: () => void;
    currentIndex: number;
    total: number;
  };
}

export default function AdHeader({ ad, navigation }: AdHeaderProps) {
  const { goPrev, goNext, goList, currentIndex, total } = navigation;

  return (
    <>
      <NavigationButtons
        onGoList={goList}
        onGoPrev={goPrev}
        onGoNext={goNext}
        disablePrev={currentIndex <= 0}
        disableNext={currentIndex >= total - 1}
      />

      <h1>{ad.title}</h1>

      <Gallery images={ad.images} title={ad.title} />

      <p>{ad.description}</p>
    </>
  );
}
