import type { PropsWithChildren } from "react";
import { useState } from "react";
import React from "react";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { useLocation } from "@remix-run/react";
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

type LinkOptions = { title: string; to: string };

type DropDownProps = {
  title: string;
  options: LinkOptions[];
};

const DropDown: React.FC<DropDownProps> = ({
  title,
  options,
}: DropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div
      className="relative flex flex-col"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`rounded-sm py-2.5 px-4 font-bold uppercase ${
          options.some((option) => location.pathname.includes(option.to))
            ? "bg-neutral-900 text-white"
            : ""
        }`}
      >
        {title}
      </button>
      {isOpen ? (
        <ul className="relative w-full">
          {options.map((option) => {
            return (
              <li
                key={option.title}
                className="rounded-sm py-2.5 px-4 font-bold hover:bg-neutral-900 hover:text-white"
              >
                <Link className="block" to={option.to}>
                  {option.title}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

const links = {
  program: "/",
  praktisk: "/praktisk",
  kontakt: "/kontakt",
} as const;

const options = [{ title: "2022", to: "/2022" }];

export const Header: React.FC = () => {
  return (
    <header className="flex w-full justify-center tablet:justify-end">
      <nav className="box-border flex h-24 gap-2 p-6">
        {Object.entries(links).map(([text, to]) => (
          <NavLink key={text} to={to}>
            {text}
          </NavLink>
        ))}
        <DropDown title="Tidligere år" options={options} />
      </nav>
    </header>
  );
};
