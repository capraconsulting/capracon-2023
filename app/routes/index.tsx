import type { HeadersFunction, V2_MetaFunction } from "@remix-run/cloudflare";

import { ArrowUpRight, Clock, ForkKnife, MapPin, Tag } from "phosphor-react";

import { ContentBox } from "~/components/content-box";
import { RichTextList } from "~/components/notion-rich-text";
import { config } from "~/config";
import type { RootLoader } from "~/root";
import { useRootData } from "~/root";

export const headers: HeadersFunction = () => config.cacheControlHeaders;

export const meta: V2_MetaFunction<never, { root: RootLoader }> = ({
  parentsData,
}) => [
  {
    title: parentsData["root"].conference.title,
  },
  { name: "description", content: parentsData["root"].conference.description },
];

export default function Praktisk() {
  const data = useRootData();

  return (
    <ContentBox>
      <div className="overflow-clip [mask-image:url(/mask-sm.svg)] [mask-position:left_center] [mask-repeat:no-repeat] [mask-size:70%] motion-reduce:hidden tablet:[mask-image:url(/mask.svg)] desktop:mt-24 desktop:[mask-size:75%] dark:bg-black">
        <picture>
          <source media="(min-width: 640px)" srcSet="/logo.webp" />
          <img
            alt="Bakgrunnsfarger til logo"
            src="/logo-sm.webp"
            className="pointer-events-none -ml-[75px] max-h-[200px] min-h-[200px] w-[5000px] max-w-none object-cover blur-[50px]"
          />
        </picture>
      </div>
      <p className="mb-12 max-w-[700px] whitespace-pre-line text-pretty text-[18px] leading-[32px] tablet:text-[24px]">
        <RichTextList richTextList={data.conference.praktiskDescription} />
      </p>

      <h2 className="mb-8 text-[32px] font-semibold leading-[40px]">
        Praktisk info
      </h2>

      <div className="mb-12 flex max-w-fit flex-col gap-3 rounded-md border border-[#999] p-4">
        <div className="flex items-center gap-2">
          <Tag size={16} />
          <span>Konferanse</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} />
          <time dateTime={data.conference.date}>
            {data.formattedConferenceDate}
          </time>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{data.conference.locationName}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <dd>{data.conference.locationAddress}</dd>
        </div>

        <div className="flex items-center gap-2">
          <ForkKnife size={16} />

          <span>Det blir mat gjennom dagen</span>
        </div>
      </div>

      <h2 className="mb-8 text-[32px] font-semibold leading-[40px]">
        Mer om selskapene
      </h2>

      <div className="mb-32 grid grid-cols-1 gap-9 sm:grid-cols-2 laptop:grid-cols-3">
        <a
          href="https://www.capraconsulting.no"
          className="group relative rounded-md border border-[#999] p-4 transition-colors hover:bg-[#DEFCF5] dark:hover:bg-[#056650]"
        >
          <div className="flex items-start justify-between">
            <div className="relative h-12 w-12">
              <img
                src="/capra-outline.svg"
                alt="Capra logo outline"
                className="absolute inset-0 transition-opacity group-hover:opacity-0 dark:invert"
              />
              <img
                src="/capra.avif"
                alt="Capra logo"
                className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
            <ArrowUpRight size={24} className="text-black dark:text-white" />
          </div>
          <h3 className="mt-4 text-lg font-medium">IT Konsulenter</h3>
        </a>
        <a
          href="https://www.liflig.no"
          className="group relative rounded-md border border-[#999] p-4 transition-colors hover:bg-[#FFE8FD] dark:hover:bg-[#851e7c]"
        >
          <div className="flex items-start justify-between">
            <div className="relative h-12 w-12">
              <img
                src="/liflig-outline.svg"
                alt="Liflig logo outline"
                className="absolute inset-0 transition-opacity group-hover:opacity-0 dark:invert"
              />
              <img
                src="/liflig.avif"
                alt="Liflig logo"
                className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
            <ArrowUpRight size={24} className="text-black dark:text-white" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Produktteam as a Service</h3>
        </a>
        <a
          href="https://www.fryde.no"
          className="group relative rounded-md border border-[#999] p-4 transition-colors hover:bg-[#FFF9E5] dark:hover:bg-[#cea931]"
        >
          <div className="flex items-start justify-between">
            <div className="relative h-12 w-12">
              <img
                src="/fryde-outline.svg"
                alt="Fryde logo outline"
                className="absolute inset-0 transition-opacity group-hover:opacity-0 dark:invert"
              />
              <img
                src="/fryde.avif"
                alt="Fryde logo"
                className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
            <ArrowUpRight size={24} className="text-black dark:text-white" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Design som fryder</h3>
        </a>
      </div>
    </ContentBox>
  );
}
