import { cn } from "@/lib/utils";

export function Logo({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <a
      href="#top"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="Growatt Energy"
    >
      <svg
        viewBox="0 0 40 40"
        className="size-9 shrink-0 text-primary"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M20 4.5c8.56 0 15.5 6.94 15.5 15.5 0 .83-.67 1.5-1.5 1.5H20.8v-4.1h9.55A11.4 11.4 0 1 0 20 31.4c3.05 0 5.8-1.2 7.84-3.14l2.9 2.83A15.45 15.45 0 1 1 20 4.5Z"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.05rem] font-semibold tracking-tight",
            inverted ? "text-cream" : "text-foreground",
          )}
        >
          Growatt
        </span>
        <span
          className={cn(
            "mt-1 text-[0.58rem] font-medium tracking-[0.22em] uppercase",
            inverted ? "text-muted-light" : "text-muted",
          )}
        >
          Powering Tomorrow
        </span>
      </span>
    </a>
  );
}
