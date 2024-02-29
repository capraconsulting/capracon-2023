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
        classNames("rounded-sm p-3 font-bold uppercase", {
          "bg-neutral-900 text-primary-light": isActive,
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
  className?: string;
};

const DropDown: React.FC<DropDownProps> = ({
  title,
  options,
  className,
}: DropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div
      className={classNames("relative flex flex-col", className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`rounded-sm p-3 font-bold uppercase ${
          options.some((option) => location.pathname.includes(option.to))
            ? "bg-neutral-900 text-primary-light"
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
                className="rounded-sm p-3 font-bold hover:bg-neutral-900 hover:text-primary-light"
              >
                {option.to.startsWith("http") ? (
                  <a
                    className="block"
                    target="_blank"
                    href={option.to}
                    rel="noreferrer"
                  >
                    {option.title}
                  </a>
                ) : (
                  <Link className="block" to={option.to}>
                    {option.title}
                  </Link>
                )}
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

const options = [
  { title: "2022", to: "https://capracon-2022.netlify.app/2022" },
];

export const Header: React.FC = () => {
  return (
    <header className="flex w-full justify-center tablet:justify-end">
      <nav className="box-border flex h-24 gap-2 p-6">
        {Object.entries(links).map(([text, to]) => (
          <NavLink key={text} to={to}>
            {text}
          </NavLink>
        ))}
        <DropDown
          className="hidden sm:block"
          title="Tidligere år"
          options={options}
        />
      </nav>
    </header>
  );
};
