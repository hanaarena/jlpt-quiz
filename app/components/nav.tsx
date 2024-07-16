"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAtom } from "jotai";
import { collapsedAtom, questionTypeAtom } from "./atoms";

interface NavProps {
  links: {
    id?: number;
    key?: string;
    name: string;
    label?: string;
    icon?: LucideIcon;
    cx?: string;
    active?: string;
    variant?: "default" | "ghost";
    children?: {
      id: number;
      name: string;
      key: string;
      variant?: "default" | "ghost";
    }[];
  }[];
  collapsed: boolean;
}

export function Nav({ links, collapsed }: NavProps) {
  const [questionType, setQuestionType] = useAtom(questionTypeAtom);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [_, setCollapsed] = useAtom(collapsedAtom);

  return (
    <div
      className={cn(
        "group flex flex-col gap-4 py-2 hidden",
        !collapsed && "flex"
      )}
    >
      <nav className="grid gap-1">
        {links.map((link, index) => (
          <div key={`nav-${index}`}>
            <div
              className={cn(
                buttonVariants({
                  variant:
                    link.variant || link.id === questionType
                      ? "default"
                      : "ghost",
                  size: "sm",
                }),
                link.variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start w-full",
                link.id === questionType &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                !link.id ? "cursor-default" : "cursor-pointer",
                link.children && "flex"
              )}
              onClick={() => {
                if (link.id) {
                  setQuestionType(link.id);
                  setCollapsed(true);
                  const currentParams = new URLSearchParams(
                    searchParams.toString()
                  );
                  currentParams.set("id", link.id.toString());
                  router.replace(`?${currentParams.toString()}`, {
                    scroll: false,
                  });
                }
              }}
            >
              {link.icon && <link.icon className="mr-2 h-4 w-4" />}
              {link.name}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white"
                  )}
                >
                  {link.label}
                </span>
              )}
            </div>
            {link.children &&
              link.children.map((c) => (
                <Link
                  key={c.key}
                  href={{
                    pathname: "/",
                    query: { id: c.id },
                  }}
                  className={cn(
                    buttonVariants({
                      variant:
                        c.variant || c.id === questionType
                          ? "default"
                          : "ghost",
                      size: "sm",
                    }),
                    "pl-5 select-none",
                    link.id === questionType &&
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  onClick={() => {
                    if (c.id) {
                      setQuestionType(c.id);
                      setCollapsed(true);
                    }
                  }}
                >
                  {c.name}
                </Link>
              ))}
            <Separator />
          </div>
        ))}
      </nav>
    </div>
  );
}
