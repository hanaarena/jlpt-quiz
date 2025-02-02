import React, { useEffect } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";

import "./embla.css";
import { cn } from "@heroui/react";

type PropType = {
  options?: EmblaOptionsType;
  children: React.ReactNode;
  control?: {
    prev: React.ReactNode;
    next: React.ReactNode;
    className?: string;
    customDom?: React.ReactNode;
  };
  onSelect?: (index: number) => void;
  className?: string;
  onInit?: (index: number) => void;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options, children, control, onSelect, className, onInit } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    watchResize: () => {
      return true;
    },
    ...options,
  });
  const ref = React.useRef<HTMLDivElement>(null);

  emblaApi?.on("select", () => {
    if (onSelect) {
      onSelect(emblaApi?.selectedScrollSnap());
    }
  });

  useEffect(() => {
    if (!emblaApi) return;

    if (onInit) {
      onInit(emblaApi?.selectedScrollSnap());
    }
  }, [emblaApi]);

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
        {control?.customDom && control.customDom}
      </div>
    </section>
  );
};

export default EmblaCarousel;
