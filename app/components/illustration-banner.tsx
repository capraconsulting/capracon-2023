export const IllustrationBanner = () => {
  return (
    <div className="max-h-[200px] min-h-[200px] w-full overflow-clip bg-[#09090B] [mask-image:url(/mask-sm.svg)] [mask-position:left_center] [mask-repeat:no-repeat] [mask-size:80%] tablet:[mask-image:url(/mask.svg)] tablet:[mask-size:50%] desktop:mt-24 dark:bg-white">
      <picture className="motion-reduce:hidden">
        <source media="(min-width: 640px)" srcSet="/logo.webp" />
        <img
          alt="Bakgrunnsfarger til logo"
          src="/logo-sm.webp"
          className="pointer-events-none -ml-[60px] max-h-[200px] min-h-[200px] w-[2100px] max-w-none object-cover blur-2xl contrast-125 tablet:-ml-[100px] tablet:w-[6000px] "
        />
      </picture>
    </div>
  );
};
