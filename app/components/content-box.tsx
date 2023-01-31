import type { PropsWithChildren } from "react";

export const ContentBox: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <article className="container mx-auto bg-white px-4 pt-12 pb-24 text-black shadow-md tablet:my-12 tablet:px-12 laptop:max-w-5xl">
      {children}
    </article>
  );
};
