import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AnswerButton(props) {
  const { children, className, onClick } = props;
  return (
    <Button
      className={cn(
        "question-options w-10/12 mb-4 border-black",
        "relative inline-flex h-[44px] items-center justify-center rounded-[6px] border leading-none",
        className
      )}
      onClick={onClick || (() => {})}
    >
      {children}
    </Button>
  );
}
