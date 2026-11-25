import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { navigationLinks } from '../data/navigation';
import MegaMenu from './MegaMenu';

export default function Navigation() {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMouseEnter = (name) => {
    setActiveMenu(name);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <nav
      className="hidden lg:block bg-white border-t border-b border-stone-100 relative z-30 shadow-nav"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[1480px] mx-auto px-3 sm:px-6">
        <ul className="flex items-center justify-center space-x-1 xl:space-x-2 text-sm font-semibold">
          {navigationLinks.map((item) => {
            const isMenuOpen = activeMenu === item.name;

            return (
              <li
                key={item.name}
                className="relative py-3.5"
                onMouseEnter={() => handleMouseEnter(item.name)}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1 px-3 py-1 rounded-md transition-colors duration-150 ${
                      isActive || isMenuOpen
                        ? 'text-brand-maroon bg-brand-maroon-subtle/70'
                        : 'text-stone-800 hover:text-brand-maroon hover:bg-stone-50'
                    }`
                  }
                >
                  <span>{item.name}</span>
                  {item.hasMegaMenu && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isMenuOpen ? 'rotate-180 text-brand-maroon' : 'text-stone-400'
                      }`}
                    />
                  )}
                  {item.badge && (
                    <span className="ml-1 text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </NavLink>

                {/* Dropdown / Mega Menu */}
                {item.hasMegaMenu && isMenuOpen && (
                  <MegaMenu item={item} onClose={() => setActiveMenu(null)} />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
