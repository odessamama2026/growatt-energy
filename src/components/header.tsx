import { useEffect, useState } from "react";
import { Menu, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { NAV, SITE } from "@/lib/site";
import { useLead } from "@/lib/lead-store";
import { cn } from "@/lib/utils";

export function Header() {
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const openLead = useLead((s) => s.openLead);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,box-shadow] duration-200",
        solid
          ? "border-b border-line bg-cream/95 shadow-[0_8px_30px_-18px_rgb(12_18_16_/_0.35)]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:h-[4.5rem] md:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors duration-150 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={SITE.phone ? `tel:${SITE.phone}` : "#order"}
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <Phone className="size-4 text-primary" />
            {SITE.phoneDisplay}
          </a>
          <Button size="sm" onClick={() => openLead("header")}>
            Замовити
          </Button>
        </div>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md border border-line bg-paper lg:hidden"
          onClick={() => setMenu(true)}
          aria-label="Меню"
        >
          <Menu className="size-5" />
        </button>
      </div>
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent>
          <Logo />
          <nav className="mt-8 grid gap-1">
            {NAV.map((item) => (
              <SheetClose asChild key={item.href}>
                <a
                  href={item.href}
                  className="flex min-h-12 items-center rounded-md px-2 text-base font-medium"
                >
                  {item.label}
                </a>
              </SheetClose>
            ))}
          </nav>
          <div className="mt-auto grid gap-3 pt-8">
            <Button asChild variant="outline" className="w-full" size="lg"><a href={SITE.phone ? `tel:${SITE.phone}` : "#order"}>
                <Phone className="size-4" />
                {SITE.phoneDisplay}
              </a></Button>
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                setMenu(false);
                openLead("mobile-menu");
              }}
            >
              Залишити заявку
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
