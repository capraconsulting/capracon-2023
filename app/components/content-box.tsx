import type { PropsWithChildren } from "react";

export const ContentBox: React.FC<
  PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = ({ children, ...rest }) => {
  return (
    <article
      className="container mx-auto px-4 pt-12 pb-24 tablet:my-12 tablet:px-12 laptop:max-w-5xl"
      {...rest}
    >
      {children}
    </article>
  );
};
