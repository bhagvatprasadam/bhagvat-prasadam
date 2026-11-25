import React from 'react';
import WhatsAppIcon from './WhatsAppIcon';

const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/Ft1TM6WNHaALWyYQSbIF52?mode=ems_copy_c';

export default function WhatsAppCommunitySection() {
  return (
    <section className="bg-[#700B10] text-white py-8 sm:py-10 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg sm:text-[21px] font-bold text-white tracking-tight mb-2">
          Join Bhagvat Prasadam WhatsApp Community
        </h2>

        <p className="text-xs sm:text-[13px] font-normal text-white/95 max-w-xl mx-auto mb-6 leading-relaxed">
          Get exclusive updates, early access to new products, and special offers directly to your WhatsApp.
        </p>

        <div className="flex justify-center">
          <a
            href={WHATSAPP_COMMUNITY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm sm:text-[15px] px-7 py-2.5 sm:py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon variant="monochrome" className="w-5 h-5 text-white" />
            <span>Join Now</span>
          </a>
        </div>
      </div>
    </section>
  );
}

