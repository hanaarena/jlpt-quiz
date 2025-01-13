import { cn } from "@/lib/utils";

interface SentenceFavProps {
  className?: string;
  children?: React.ReactNode;
}

export default function SentenceFav({ className, children }: SentenceFavProps) {
  return <div className={cn(className)}>{children}</div>;
}
