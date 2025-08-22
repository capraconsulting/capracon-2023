import type { RichTextItem } from "../notion/helpers";

type RichTextAnnotation = Exclude<keyof RichTextItem["annotations"], "color">;
type RichTextColor = RichTextItem["annotations"]["color"];
type RichTextAnnotationClass = `annotation_${RichTextAnnotation}`;
type RichTextColorClass = `color_${RichTextColor}`;
type RichTextHrefClass = "href";

export type RichTextClasses = Record<
  RichTextAnnotationClass | RichTextColorClass | RichTextHrefClass,
  string
>;

export const richTextClasses: RichTextClasses = {
  annotation_code: "",
  annotation_bold: "",
  annotation_italic: "",
  annotation_strikethrough: "",
  annotation_underline: "",
  color_default: "",
  color_gray: "",
  color_brown: "",
  color_orange: "",
  color_yellow: "",
  color_green: "",
  color_blue: "",
  color_purple: "",
  color_pink: "",
  color_red: "",
  color_gray_background: "",
  color_brown_background: "",
  color_orange_background: "",
  color_yellow_background: "",
  color_green_background: "",
  color_blue_background: "",
  color_purple_background: "",
  color_pink_background: "",
  color_red_background: "",
  href: "underline",
};

interface RichTextProps {
  richText: RichTextItem;
  classes?: RichTextClasses;
}
export const RichText = ({
  richText,
  classes = richTextClasses,
}: RichTextProps) => {
  if (richText.type === "equation") return null;
  const color = classes[`color_${richText.annotations.color}`];

  let element: JSX.Element;
  element = <span className={color}>{richText.plain_text}</span>;

  if (richText.annotations.bold) {
    element = (
      <strong className={color + " " + classes.annotation_bold}>
        {richText.plain_text}
      </strong>
    );
  } else if (richText.annotations.code) {
    element = (
      <code className={color + " " + classes.annotation_code}>
        {richText.plain_text}
      </code>
    );
  } else if (richText.annotations.italic) {
    element = (
      <em className={color + " " + classes.annotation_italic}>
        {richText.plain_text}
      </em>
    );
  } else if (richText.annotations.strikethrough) {
    element = (
      <s className={color + " " + classes.annotation_strikethrough}>
        {richText.plain_text}
      </s>
    );
  } else if (richText.annotations.underline) {
    element = (
      <u className={color + " " + classes.annotation_underline}>
        {richText.plain_text}
      </u>
    );
  }

  if (richText.href !== null) {
    element = (
      <a className={classes.href} href={richText.href}>
        {element}
      </a>
    );
  }
  return element;
};
interface RichTextListProps {
  richTextList: RichTextItem[];
  classes?: RichTextClasses;
}
export const RichTextList = ({
  richTextList,
  classes = richTextClasses,
}: RichTextListProps) => {
  return (
    <>
      {richTextList?.map((richText, index) => (
        <RichText key={index} richText={richText} classes={classes} />
      ))}
    </>
  );
};
