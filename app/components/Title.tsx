import type { PropsWithChildren } from "react";

import { classNames } from "~/utils/misc";

type Props = PropsWithChildren<{
  as: "h1" | "h2";
  className?: string;
  withBackground?: boolean;
  color?: `text-${string}`;
}>;

export const Title: React.FC<Props> = ({
  as: Component,
  children,
  withBackground = false,
  className,
  color = withBackground ? "text-white" : "text-black",
}) => {
  return (
    <Component
      className={classNames(
        className,
        color,
        "inline-block p-2 font-bold tablet:px-4",
        {
          "text-7xl laptop:text-9xl": Component === "h1",
          "text-3xl": Component === "h2",
          "bg-black": withBackground,
        },
      )}
    >
      {children}
    </Component>
  );
};
