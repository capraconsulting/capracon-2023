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
  color = withBackground ? "text-white" : "text-black",
  size = Component === "h1"
    ? "text-7xl"
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
        "inline-block p-2 font-bold tablet:px-4",
        {
          "laptop:text-9xl": Component === "h1",
          "bg-black": withBackground,
        },
      )}
    >
      {children}
    </Component>
  );
};
