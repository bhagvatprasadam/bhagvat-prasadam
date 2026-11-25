import React, { useState } from 'react';

const YOUTUBE_VIDEO_ID = '-EHgjLrqknE';
const POSTER_IMAGE = 'https://bhagvatprasadam.com/cdn/shop/files/videoframe_4196_a6fe3313-5faa-4d5f-b3a3-76e5ff08b66c.png?v=1782101163&width=3840';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-6 sm:py-10 bg-white">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        <div className="relative w-full aspect-video sm:aspect-[16/9] lg:aspect-[21/9] max-h-[720px] rounded-2xl sm:rounded-2xl overflow-hidden shadow-xl bg-black border border-stone-200/80 group">
          {isPlaying ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&playlist=${YOUTUBE_VIDEO_ID}&loop=1`}
              title="Bhagvat Prasadam Sacred Offerings"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full cursor-pointer overflow-hidden"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsPlaying(true);
                }
              }}
              aria-label="Play sacred prasadam offering video"
            >
              {/* Video Poster Image */}
              <img
                src={POSTER_IMAGE}
                alt="Bhagvat Prasadam Divine Offerings"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Pulsing Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/30 animate-ping opacity-60 pointer-events-none" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-[#700B10] flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-active:scale-95">
                    <svg
                      className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.375 8.48516C16.5417 9.15874 16.5417 10.8427 15.375 11.5163L7.875 15.8464C6.70833 16.52 5.25 15.678 5.25 14.3308L5.25 5.67058C5.25 4.32343 6.70833 3.48146 7.875 4.15504L15.375 8.48516Z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom Label Banner */}
              <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-8 flex items-center justify-between text-white pointer-events-none">
                <div>
                  <span className="inline-block bg-[#E5A800] text-black text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider mb-1">
                    Divine Darshan
                  </span>
                  <h3 className="text-base sm:text-xl font-bold drop-shadow-md">
                    NilkanthDham Swaminarayan Temple Offerings
                  </h3>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Watch Video
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

