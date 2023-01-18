import type { PropsWithChildren } from "react";
import React from "react";
import type { LinkProps } from "@remix-run/react";
import { NavLink as RemixNavLink } from "@remix-run/react";

import { classNames } from "~/utils/misc";

const NavLink: React.FC<PropsWithChildren<Pick<LinkProps, "to">>> = ({
  to,
  children,
}) => {
  return (
    <RemixNavLink
      to={to}
      prefetch="intent"
      className={({ isActive }) =>
        classNames("rounded-sm py-2.5 px-4 font-bold uppercase", {
          "bg-neutral-900 text-white": isActive,
        })
      }
    >
      {children}
    </RemixNavLink>
  );
};

const links = {
  program: "/",
  praktisk: "/praktisk",
  kontakt: "/kontakt",
} as const;

export const Header: React.FC = () => {
  return (
    <header className="flex w-full justify-center tablet:justify-end">
      <nav className="box-border flex h-24 gap-2 p-6">
        {Object.entries(links).map(([text, to]) => (
          <NavLink key={text} to={to}>
            {text}
          </NavLink>
        ))}
        {/* TODO: Tidligere år */}
      </nav>
    </header>
  );
};
