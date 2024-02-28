import type { PropsWithChildren } from "react";

import { classNames } from "~/utils/misc";

type Props = PropsWithChildren<{
  as: "h1" | "h2" | "h3";
  className?: string;
  withBackground?: boolean;
  color?: `text-${string}`;
  size?: `text-${number}xl`;
}>;

export const Title: React.FC<Props> = ({
  as: Component,
  children,
  withBackground = false,
  className,
  color = withBackground ? "text-primary-light" : "text-primary",
  size = Component === "h1"
    ? "text-7xl laptop:text-9xl"
    : Component === "h2"
    ? "text-3xl"
    : "text-2xl",
}) => {
  return (
    <Component
      className={classNames(
        className,
        color,
        size,
        "mb-4 inline-block font-bold leading-normal",
        {
          "bg-primary p-4": withBackground,
        },
      )}
    >
      {children}
    </Component>
  );
};
