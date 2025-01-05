import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";

import "./embla.css";
import { cn } from "@/lib/utils";

type PropType = {
  options?: EmblaOptionsType;
  children: React.ReactNode;
  control?: {
    prev: React.ReactNode;
    next: React.ReactNode;
    className?: string;
  };
  onSelect?: (index: number) => void;
  className?: string;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options, children, control, onSelect, className } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const ref = React.useRef<HTMLDivElement>(null);

  emblaApi?.on("select", () => {
    if (ref.current) {
      for (let index = 0; index < ref.current?.children?.length; index++) {
        ref.current?.children[index].scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }
    if (onSelect) {
      onSelect(emblaApi?.selectedScrollSnap());
    }
  });

  return (
    <section className={cn("embla", className)}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container" ref={ref}>
          {children}
        </div>
      </div>

      <div className={control?.className}>
        {control?.prev && (
          <div
            onClick={() => {
              emblaApi?.scrollPrev();
            }}
          >
            {control.prev}
          </div>
        )}
        {control?.next && (
          <div onClick={() => emblaApi?.scrollNext()}>{control.next}</div>
        )}
      </div>
    </section>
  );
};

export default EmblaCarousel;
