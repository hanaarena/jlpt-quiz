import { cn } from "@heroui/react";

interface GrammarFavListProps {
  className?: string;
  children?: React.ReactNode;
}

export default function GrammarFavList({
  className,
  children,
}: GrammarFavListProps) {
  return (
    <div className={cn(className)}>
      {/* todo: add list page/dialog */}
      {children}
    </div>
  );
}
