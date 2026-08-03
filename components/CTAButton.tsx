import type { ReactNode } from "react";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  target?: string;
  rel?: string;
};

const baseStyles =
  "inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold transition-colors duration-150";

const variantStyles: Record<NonNullable<CTAButtonProps["variant"]>, string> = {
  primary: "bg-coral text-crema hover:bg-coral/90",
  secondary:
    "border-2 border-morado-oscuro text-morado-oscuro bg-transparent hover:bg-morado-oscuro hover:text-crema",
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
  target,
  rel,
}: CTAButtonProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
