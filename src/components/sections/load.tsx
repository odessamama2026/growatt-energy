import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { APPLIANCES } from "@/lib/site";
import { useLead } from "@/lib/lead-store";
import { cn } from "@/lib/utils";

import { calculateLoad } from "@/lib/calculator";

export function Load() {
  const openLead = useLead((s) => s.openLead);
  const [on, setOn] = useState<string[]>(["light", "fridge", "net"]);

  const totals = useMemo(() => calculateLoad(on), [on]);

  function toggle(id: string) {
    setOn((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <section id="load" className="bg-paper px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-muted uppercase">
            Калькулятор резерву
          </p>
          <h2 className="font-display mt-4 max-w-xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            Що залишиться з вами без світла
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
            Оберіть прилади. Покажемо, чи витягне інвертор 5 кВт одночасне
            навантаження і на скільки годин вистачить батареї 5 кВт·год.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {APPLIANCES.map((item) => {
              const active = on.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex min-h-16 items-center justify-between rounded-lg border px-4 text-left transition-[background-color,border-color] duration-150",
                    active
                      ? "border-primary bg-sand"
                      : "border-line bg-cream hover:border-line-strong",
                  )}
                >
                  <span>
                    <span className="block text-sm font-semibold">{item.name}</span>
                    <span className="text-xs text-muted">{item.watts} Вт</span>
                  </span>
                  <span
                    className={cn(
                      "size-4 rounded-full border",
                      active ? "border-primary bg-primary" : "border-line-strong",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
        <aside className="rounded-xl border border-line bg-cream p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
            Результат
          </p>
          <p className="font-display mt-4 text-5xl font-semibold tracking-tight">
            {totals.hours > 0 && totals.okPower ? totals.hours.toFixed(1) : "—"}
            <span className="ml-2 text-lg font-medium text-muted">год</span>
          </p>
          <p className="mt-2 text-sm text-muted">орієнтовний запас батареї на обраному навантаженні</p>
          <dl className="mt-8 grid gap-4 border-t border-line pt-6">
            <Row
              label="Одночасна потужність"
              value={`${totals.watts.toLocaleString("uk-UA")} Вт`}
              hint={totals.okPower ? "в межах 5 кВт" : "перевищує 5 кВт — зніміть бойлер або плиту"}
              warn={!totals.okPower}
            />
            <Row
              label="Ємність батареї"
              value="5,12 кВт·год"
              hint="LiFePO4, можна наростити модулями"
            />
          </dl>
          <Button className="mt-8 w-full" size="lg" onClick={() => openLead("calculator", { appliances: on })}>
            Надіслати цей розрахунок
          </Button>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Модель: постійна обрана потужність, 90% доступної ємності та 90% ККД. Це припущення розрахунку, а не характеристики виробника. Пускові струми й цикли роботи приладів не враховано.
          </p>
        </aside>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  hint,
  warn = false,
}: {
  label: string;
  value: string;
  hint: string;
  warn?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <dt className="text-sm text-muted">{label}</dt>
        <dd className={cn("font-display text-lg font-medium", warn && "text-danger")}>{value}</dd>
      </div>
      <p className={cn("mt-1 text-xs", warn ? "text-danger" : "text-muted")}>{hint}</p>
    </div>
  );
}
