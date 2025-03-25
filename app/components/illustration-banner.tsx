export const IllustrationBanner = () => {
  return (
    <div className="w-full overflow-clip bg-[#09090B] [mask-image:url(/mask.svg)] [mask-position:left_center] [mask-repeat:no-repeat] [mask-size:290px] tablet:mt-16  tablet:[mask-size:400px] desktop:[mask-size:600px] dark:bg-white">
      <picture className="motion-reduce:hidden">
        <source media="(min-width: 640px)" srcSet="/logo.webp" />
        <img
          alt="Bakgrunnsfarger til logo"
          src="/logo-sm.webp"
          className="pointer-events-none -ml-[60px] h-[100px] w-[2500px] max-w-none object-cover blur-2xl contrast-150 tablet:-ml-[100px] tablet:h-[142px] tablet:w-[6000px] "
        />
      </picture>
    </div>
  );
};
