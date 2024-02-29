import type { PropsWithChildren } from "react";
import { useState } from "react";
import React from "react";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { useLocation } from "@remix-run/react";
import { NavLink as RemixNavLink } from "@remix-run/react";

import { classNames } from "~/utils/misc";
import capraGroupHeadImage from "./../images/capra_group.png";
import capraGroupSmallerHeadImage from "./../images/capra_group_smaller.png";

const NavLink: React.FC<PropsWithChildren<Pick<LinkProps, "to">>> = ({
  to,
  children,
}) => {
  return (
    <RemixNavLink
      to={to}
      prefetch="intent"
      className={({ isActive }) =>
        classNames("rounded-sm p-3 font-bold uppercase text-white", {
          "border-b-2 border-white": isActive,
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
                className="rounded-sm p-3 font-bold" // hover:bg-neutral-900 hover:text-white"
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
    <header>
      <div className="flex h-24 w-full justify-center tablet:justify-end laptop:h-60">
        <img
          src={capraGroupHeadImage}
          alt="Logoene i Capra Gruppen"
          className="absolute z-0 hidden w-full laptop:block"
        />
        <img
          src={capraGroupSmallerHeadImage}
          alt="Logoene i Capra Gruppen"
          className="absolute z-0 w-full laptop:hidden"
        />
        <nav className="z-10 box-border flex h-24 gap-2 p-6">
          {Object.entries(links).map(([text, to]) => (
            <NavLink key={text} to={to}>
              {text}
            </NavLink>
          ))}
          <DropDown
            className="hidden text-white sm:block"
            title="Tidligere år"
            options={options}
          />
        </nav>
      </div>
    </header>
  );
};
