import { OptimizedImage } from "@/components/optimized-image";
import { ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { useLead } from "@/lib/lead-store";

export function Hero() {
  const openLead = useLead((s) => s.openLead);

  return (
    <section id="top" className="relative overflow-hidden bg-cream pt-16 md:pt-[4.5rem]">
      <div className="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-7xl items-stretch lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="flex flex-col justify-center px-5 py-10 md:px-8 md:py-16 lg:py-20">
          <p className="rise text-xs font-semibold tracking-[0.22em] text-muted uppercase">
            Надійна енергія у будь-яких умовах
          </p>
          <h1 className="hero-title rise-2 font-display mt-4 max-w-xl text-[2.15rem] leading-[1.05] font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
            Встановлення інвертора{" "}
            <span className="text-primary">в Одесі та Одеській області</span>
          </h1>
          <p className="rise-3 mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            Підбір, встановлення та налаштування інвертора Growatt 5 кВт із
            літієвою батареєю 5 кВт·год для резервного живлення будинку.
          </p>
          <div className="rise-4 mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" onClick={() => openLead("hero")}>
              Замовити встановлення
              <ArrowRight className="size-4" />
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto"><a href={SITE.phone ? `tel:${SITE.phone}` : "#order"} className="sm:inline-flex">
                <Phone className="size-4" />
                <span className="sm:hidden">Зателефонувати</span>
                <span className="hidden sm:inline">{SITE.phoneDisplay}</span>
              </a></Button>
          </div>
          <p className="mt-4 text-sm text-muted">
            {SITE.response} · {SITE.hours}
          </p>
          <div className="mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-7">
            <Stat value="5 кВт" label="інвертор" />
            <Stat value="5 кВт·год" label="батарея" />
            <Stat value="Підбір" label="під ваші прилади" />
          </div>
        </div>
        <div className="relative min-h-72 lg:min-h-full">
          <OptimizedImage
            src="/images/hero.jpg"
            alt="Будинок із сонячними панелями та комплектом Growatt на стіні"
            className="absolute inset-0 size-full object-cover"
            fetchPriority="high"
            loading="eager"
            width={1280}
            height={720}
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink/30 via-transparent to-transparent" />
          <div className="absolute right-8 bottom-8 left-auto max-w-sm">
            <div className="flex items-start gap-3 rounded-xl border border-cream/20 bg-ink/80 p-4 text-cream shadow-soft">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold">
                  Працює, навіть коли немає світла
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-light">
                  Автономний резерв для дому. Панелі можна додати пізніше.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
      <p className="mt-1 text-xs tracking-wide text-muted uppercase">{label}</p>
    </div>
  );
}
