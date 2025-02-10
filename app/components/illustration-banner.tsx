export const IllustrationBanner = () => {
  return (
    <div className="max-h-[200px] min-h-[200px] overflow-clip bg-black [mask-image:url(/mask-sm.svg)] [mask-position:left_center] [mask-repeat:no-repeat] [mask-size:70%] tablet:[mask-image:url(/mask.svg)] desktop:mt-24 desktop:[mask-size:75%] dark:bg-white">
      <img
        alt="Bakgrunnsfarger til logo"
        src="https://res.cloudinary.com/dbbgdlgj3/image/upload/v1739188389/logo_ecdyiz.webp"
        className="pointer-events-none -ml-[60px] max-h-[200px] min-h-[200px] w-[2100px] max-w-none object-cover blur-2xl contrast-125 motion-reduce:hidden tablet:-ml-[175px] tablet:w-[6000px] "
      />

      <picture className="motion-reduce:hidden">
        <source media="(min-width: 640px)" srcSet="/logo.webp" />
        <img
          alt="Bakgrunnsfarger til logo"
          src="/logo-sm.webp"
          className="pointer-events-none -ml-[60px] max-h-[200px] min-h-[200px] w-[2100px] max-w-none object-cover blur-2xl contrast-125 tablet:-ml-[175px] tablet:w-[6000px] "
        />
      </picture>
    </div>
  );
};
