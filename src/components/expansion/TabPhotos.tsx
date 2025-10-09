import { PropertyGallery } from './PropertyGallery';

interface TabPhotosProps {
  images: string[];
  title: string;
}

export const TabPhotos = ({ images, title }: TabPhotosProps) => {
  return (
    <div className="space-y-6">
      <PropertyGallery images={images} title={title} />

      <div className="prose max-w-none">
        <p className="text-black/60 font-light">
          Browse through {images.length} high-quality images of this property.
          Use the arrows or dots to navigate between photos.
        </p>
      </div>
    </div>
  );
};
