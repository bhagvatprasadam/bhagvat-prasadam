import React from 'react';
import { Link } from 'react-router-dom';
import SafeImage from './SafeImage';

export default function DivinePrasadamGlobalSection() {
  const imageUrl = "https://bhagvatprasadam.com/cdn/shop/files/Untitled_design_12.webp?v=1781780829&width=3840";

  return (
    <section className="w-full bg-white p-0 m-0 overflow-hidden" id="bhagwan-ka-prasad-banner">
      {/* Full-width responsive banner - fits edge-to-edge on all screen sizes */}
      <Link
        to="/collections/all"
        className="block w-full focus:outline-none group"
        aria-label="भगवान का प्रसाद - हर जाति और हर धर्म घर घर पहुंचे है हम"
      >
        <SafeImage
          src={imageUrl}
          alt="भगवान का प्रसाद - शुद्धता और प्यार का प्रतीक! हर जाति और हर धर्म घर घर पहुंचे है हम"
          className="w-full bg-transparent"
          imgClassName="w-full h-auto block object-contain mx-auto"
          aspectRatio="aspect-auto"
        />
      </Link>
    </section>
  );
}
