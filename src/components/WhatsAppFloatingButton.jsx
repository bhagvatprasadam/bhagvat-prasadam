import React from 'react';
import WhatsAppIcon from './WhatsAppIcon';
import { siteConfig } from '../data/siteConfig';

export default function WhatsAppFloatingButton() {
  return (
    <a
      href={siteConfig.socials.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-5 sm:bottom-6 sm:right-6 z-40 bg-[#25D366] hover:bg-[#1EBE5D] text-white p-3 sm:p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat with Bhagvat Prasadam Support on WhatsApp"
    >
      <WhatsAppIcon variant="monochrome" className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pl-0 group-hover:pl-2">
        Chat with us
      </span>
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300"></span>
      </span>
    </a>
  );
}
