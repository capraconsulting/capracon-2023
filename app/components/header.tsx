import React, { useState } from "react";
import { Link } from "@remix-run/react";

import { isSafariOrIOS } from "~/utils/misc";
import { DesktopMenu } from "./desktop-menu";
import { MobileMenu } from "./mobile-menu";

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const isLowPerformance = isSafariOrIOS();

  return (
    <header className="flex h-[100px] w-full items-center justify-between px-4 pt-2 desktop:px-20">
      <Link className="flex items-center" to="/">
        <img
          className="absolute h-12 select-none opacity-100 sm:h-14 dark:opacity-5"
          alt="Logo"
          src={isLowPerformance ? "/logo-sm.webp" : "/logo.webp"}
        />
        <img
          className="absolute h-12 select-none opacity-5 sm:h-14 dark:opacity-100"
          alt="Logo"
          src={isLowPerformance ? "/logo-dark-sm.webp" : "/logo-dark.webp"}
        />
      </Link>

      <div className="flex items-center gap-4">
        <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        <DesktopMenu />
      </div>
    </header>
  );
};
