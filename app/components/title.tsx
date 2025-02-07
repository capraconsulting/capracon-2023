import type { PropsWithChildren } from "react";

import { classNames } from "~/utils/misc";

type Props = PropsWithChildren<{
  as: "h1" | "h2" | "h3";
  className?: string;
  withBackground?: boolean;
  color?: `text-${string}`;
}>;

export const Title: React.FC<Props> = ({
  as: Component,
  children,
  withBackground = false,
  className,
  color = withBackground ? "text-primary-light" : "text-primary",
}) => {
  return (
    <Component
      className={classNames(
        className,
        color,
        "mb-4 inline-block font-bold leading-normal dark:text-white",
        {
          "bg-primary p-4": withBackground,
        },
      )}
    >
      {children}
    </Component>
  );
};
