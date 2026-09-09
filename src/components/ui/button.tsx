import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "solid" | "ghost";

const base =
  "inline-flex items-center justify-center rounded-md px-4 h-10 text-[14px] font-medium transition-colors select-none";

const variants: Record<Variant, string> = {
  solid: "bg-ink !text-[#08090c] hover:bg-white",
  ghost: "border border-line text-ink hover:border-ink-dim hover:bg-panel",
};

export function Button({
  variant = "solid",
  className = "",
  ...props
}: { variant?: Variant } & ComponentProps<typeof Link>) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
