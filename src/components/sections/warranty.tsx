import { BadgeCheck, CalendarRange, Headset } from "lucide-react";

const ITEMS = [
  {
    icon: BadgeCheck,
    title: "Офіційна гарантія виробника",
    text: "Строк та покриття — за документами на обрану модель. Уточнюємо до замовлення.",
  },
  {
    icon: CalendarRange,
    title: "Умови монтажу",
    text: "Обсяг робіт, строки та гарантійні зобов’язання погоджуються в пропозиції.",
  },
  {
    icon: Headset,
    title: "Підтримка українською",
    text: "Інженер на зв’язку в робочі години. Допоможемо з застосунком, графіками і розширенням системи.",
  },
] as const;

export function Warranty() {
  return (
    <section className="bg-ink px-5 py-20 text-cream md:px-8 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <article key={item.title}>
            <span className="flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <item.icon className="size-5" />
            </span>
            <h2 className="font-display mt-5 text-xl font-medium tracking-tight">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-light">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
