"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-950/95 group-[.toaster]:text-zinc-100 group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl group-[.toaster]:backdrop-blur-md",
          description: "group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-900",
          cancelButton:
            "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-400",
          error: "group-[.toast]:border-red-900/60 group-[.toast]:text-red-200",
          success: "group-[.toast]:border-emerald-900/60 group-[.toast]:text-emerald-200",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
