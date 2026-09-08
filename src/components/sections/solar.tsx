import { OptimizedImage } from "@/components/optimized-image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLead } from "@/lib/lead-store";

export function Solar() {
  const openLead = useLead((s) => s.openLead);

  return (
    <section id="solar" className="relative overflow-hidden">
      <OptimizedImage
        src="/images/solar.jpg"
        alt="Сонячні панелі на даху в південному світлі"
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-ink/70" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-2">
        <div className="text-cream">
          <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
            Наступний крок
          </p>
          <h2 className="font-display mt-4 text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">
            З часом — сонячні панелі
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-light">
            Для сумісного гібридного комплекту можна передбачити панелі й отримувати
            енергію від сонця. Сумісність і обсяг генерації розраховуються окремо —
            після вибору конкретної моделі.
          </p>
          <Button
            size="lg"
            className="mt-8"
            onClick={() => openLead("solar")}
          >
            Закласти панелі в кошторис
            <ArrowRight className="size-4" />
          </Button>
        </div>
        <ul className="grid gap-4">
          {[
            "Гібридний інвертор уже вміє працювати з PV",
            "Батарея запасає денну генерацію на ніч і графіки",
            "Монтаж панелей — окремим етапом, коли будете готові",
          ].map((line) => (
            <li
              key={line}
              className="rounded-lg border border-cream/15 bg-ink/50 px-5 py-4 text-sm leading-relaxed text-cream"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
