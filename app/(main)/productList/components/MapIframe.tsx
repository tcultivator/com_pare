import { MapPin, X, Navigation, Store, Tag, FileText, User, ChevronRight, Loader2 } from "lucide-react";
export default function MapIframe({
  mapLoaded,
  onLoad,
  src,
}: {
  mapLoaded: boolean;
  onLoad: () => void;
  src: string;
}) {
  return (
    <div className="relative w-full h-full">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      )}

      <iframe
        className="w-full h-full border-0"
        loading="lazy"
        allowFullScreen
        onLoad={onLoad}
        src={src}
      />
    </div>
  );
}