import "./Gallery.css";

interface GalleryProps {
  images: string[];
  title: string;
  maxImages?: number; 
}

export default function Gallery({ images, title, maxImages = 3 }: GalleryProps) {
  return (
    <div className="gallery">
      {images.slice(0, maxImages).map((img, idx) => (
        <img
          key={idx}
          src={img || "https://via.placeholder.com/200x150"}
          alt={`${title} ${idx + 1}`}
          className="gallery-img"
        />
      ))}
    </div>
  );
}
