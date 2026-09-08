import { CalendarCheck, Factory, Leaf, Zap } from "lucide-react";

const ITEMS = [
  { icon: Zap, title: "Енергія при відключеннях", text: "Світло і комфорт у вашому домі" },
  { icon: Factory, title: "Захист техніки", text: "Стабільна робота при перепадах" },
  { icon: Leaf, title: "Економія на кіловатах", text: "Менше витрат — більше свободи" },
  { icon: CalendarCheck, title: "Узгоджений монтаж", text: "Строки — у вашій пропозиції" },
] as const;

export function Trust() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto grid max-w-7xl gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <article key={item.title} className="flex gap-4 bg-paper px-6 py-8">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <item.icon className="size-5" />
            </span>
            <div>
              <h2 className="font-sans text-sm font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-muted">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
