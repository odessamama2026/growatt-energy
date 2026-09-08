import { OptimizedImage } from "@/components/optimized-image";
import { Button } from "@/components/ui/button";
import { useLead } from "@/lib/lead-store";

const CARDS = [
  {
    img: "/images/night.jpg",
    alt: "Будинок світиться під час відключення світла",
    kicker: "Резерв",
    title: "Коли вулиця темна — у вас звичайний вечір",
    text: "Система перехоплює навантаження за частки секунди. Холодильник не розморожується, роутер не падає, діти не сидять у темряві.",
  },
  {
    img: "/images/kitchen.jpg",
    alt: "Освітлена кухня-вітальня під час блекауту",
    kicker: "Комфорт",
    title: "Не генератор. Не шум. Не бензин.",
    text: "Місце встановлення LiFePO4 батареї визначається вимогами виробника. Без вихлопу, без черг на заправці, без нічних запусків «на слух».",
  },
  {
    img: "/images/inverter.jpg",
    alt: "Гібридний інвертор Growatt великим планом",
    kicker: "Захист",
    title: "Підбір захисту для вашої мережі",
    text: "Режими роботи й захисне обладнання підбираються під мережу та характеристики конкретного інвертора.",
  },
] as const;

export function Benefits() {
  const openLead = useLead((s) => s.openLead);

  return (
    <section id="backup" className="bg-cream px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold tracking-[0.22em] text-muted uppercase">
          Навіщо це дому
        </p>
        <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h2 className="font-display max-w-2xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            Три причини поставити комплект до наступного графіка
          </h2>
          <Button variant="ink" onClick={() => openLead("benefits")}>
            Розрахувати для мого будинку
          </Button>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="overflow-hidden rounded-xl border border-line bg-paper shadow-soft"
            >
              <div className="aspect-video overflow-hidden">
                <OptimizedImage
                  src={card.img}
                  alt={card.alt}
                  className="size-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                  {card.kicker}
                </p>
                <h3 className="font-display mt-3 text-xl leading-snug font-medium">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
