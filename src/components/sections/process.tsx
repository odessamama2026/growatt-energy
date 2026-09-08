import { Button } from "@/components/ui/button";
import { useLead } from "@/lib/lead-store";

const STEPS = [
  { n: "01", title: "Заявка або дзвінок", text: "15 хвилин на бриф: площа, щит, що має триматися без мережі." },
  { n: "02", title: "Кошторис того ж дня", text: "Фіксуємо комплект, кабель, щит. Без прихованих позицій." },
  { n: "03", title: "Монтаж за 1 день", text: "Кріпимо інвертор і батарею, підключаємо критичні лінії, запускаємо." },
  { n: "04", title: "Навчання і гарантія", text: "Показуємо застосунок Growatt. Далі — сервіс і 10 років виробника." },
] as const;

export function Process() {
  const openLead = useLead((s) => s.openLead);

  return (
    <section className="bg-paper px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-muted uppercase">
              Встановлення під ключ
            </p>
            <h2 className="font-display mt-4 max-w-xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              До 10 робочих днів з моменту оплати
            </h2>
          </div>
          <Button variant="ink" onClick={() => openLead("process")}>
            Забронювати виїзд
          </Button>
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li key={step.n} className="border-t border-primary pt-5">
              <span className="font-display text-sm text-primary">{step.n}</span>
              <h3 className="font-display mt-3 text-xl font-medium tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
