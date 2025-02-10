import type { PropsWithChildren } from "react";

export const ContentBox: React.FC<
  PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = ({ children, ...rest }) => {
  return (
    <main
      className="mx-auto min-h-[90vh] p-4 sm:max-w-[1200px] sm:px-12"
      {...rest}
    >
      {children}
    </main>
  );
};
