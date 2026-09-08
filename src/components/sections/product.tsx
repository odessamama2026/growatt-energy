import { OptimizedImage } from "@/components/optimized-image";
import { Button } from "@/components/ui/button";
import { useLead } from "@/lib/lead-store";

const SPECS = [
  { k: "Потужність інвертора", v: "5 000 Вт" },
  { k: "Ємність батареї", v: "5,12 кВт·год" },
  { k: "Хімія", v: "LiFePO4" },
  { k: "Перемикання", v: "За моделлю" },
  { k: "Режими", v: "За моделлю" },
  { k: "Моніторинг", v: "Wi-Fi · застосунок" },
  { k: "Масштабування", v: "панелі + модулі" },
  { k: "Гарантія", v: "За документами" },
] as const;

export function Product() {
  const openLead = useLead((s) => s.openLead);

  return (
    <section id="kit" className="bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-xl bg-ink-soft">
            <OptimizedImage
              src="/images/product.jpg"
              alt="Комплект Growatt: гібридний інвертор 5 кВт і літієва батарея 5 кВт·год"
              className="mx-auto max-h-[640px] w-full object-contain"
              loading="lazy"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <OptimizedImage
              src="/images/wall.jpg"
              alt="Комплект Growatt на фасаді будинку"
              className="h-32 w-full rounded-lg object-cover sm:h-40"
              loading="lazy"
            />
            <OptimizedImage
              src="/images/inverter.jpg"
              alt="Дисплей інвертора Growatt"
              className="h-32 w-full rounded-lg object-cover sm:h-40"
              loading="lazy"
            />
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
            Комплект
          </p>
          <h2 className="font-display mt-4 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            Інвертор + акумулятор Growatt 5 кВт
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-light">
            Гібридна система для приватного будинку: заряд від мережі сьогодні,
            сонце — коли будете готові. Настінний формфактор, тиха робота,
            офіційна гарантія виробника.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-cream/10">
            {SPECS.map((row) => (
              <div key={row.k} className="bg-ink-soft px-4 py-4">
                <dt className="text-xs tracking-wide text-muted-light uppercase">{row.k}</dt>
                <dd className="font-display mt-1 text-lg font-medium">{row.v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => openLead("product")}>
              Замовити комплект
            </Button>
            <Button
              size="lg"
              variant="cream"
              onClick={() => {
                document.getElementById("load")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Перевірити навантаження
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
