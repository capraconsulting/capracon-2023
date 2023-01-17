import type { PropsWithChildren } from "react";

export const ContentBox: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <article className="container my-12 mx-auto max-w-[90%] bg-white px-4 pt-12 pb-24 text-black shadow-md tablet:px-12 laptop:max-w-5xl">
      {children}
    </article>
  );
};
