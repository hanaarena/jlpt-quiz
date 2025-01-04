import { cn } from "@nextui-org/react";
import style from "./page.module.css";

type PropType = {
  title?: string;
  className?: string;
  content?: string;
  children?: React.ReactNode;
};

export default function GrammarV2DetailCard({
  className,
  title,
  content,
  children,
}: PropType) {
  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-2",
        style.icon_border,
        style.icon_bg,
        style.dot_bg,
        className
      )}
    >
      {title && (
        <p
          className={cn(style.card_title, "bold text-2xl mb-3 underline")}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}

      {children ? (
        <div>{children}</div>
      ) : (
        <p
          className={cn(style.title_color_thin, "text-xl")}
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />
      )}
    </div>
  );
}
