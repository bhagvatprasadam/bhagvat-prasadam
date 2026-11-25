import React from 'react';
import AnnouncementBar from './AnnouncementBar';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

export default function Header() {
  return (
    <>
      {/* Non-sticky Announcement Bar (scrolls away) */}
      <AnnouncementBar />

      {/* Sticky Header: Only this remains sticky at top-0 across the whole page */}
      <header className="sticky top-0 z-40 bg-white shadow-xs transition-shadow duration-200">
        <DesktopHeader />
        <MobileHeader />
      </header>
    </>
  );
}
