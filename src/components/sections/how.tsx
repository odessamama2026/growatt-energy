const STEPS = [
  {
    n: "01",
    title: "Мережа є",
    text: "Інвертор живить дім і заряджає батарею. При перепадах — фільтрує напругу, техніка в безпеці.",
  },
  {
    n: "02",
    title: "Мережа зникла",
    text: "Перемикання менше 10 мс. Світло навіть не моргає. Батарея тримає критичні лінії.",
  },
  {
    n: "03",
    title: "З’являється сонце",
    text: "Додаєте панелі — і комплект починає виробляти безкоштовну енергію. Батарея заряджається вдень.",
  },
] as const;

export function How() {
  return (
    <section className="bg-cream px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold tracking-[0.22em] text-muted uppercase">
          Як це працює
        </p>
        <h2 className="font-display mt-4 max-w-2xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
          Універсальне рішення. Три режими. Жодного генератора в дворі.
        </h2>
        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.n} className="rounded-xl border border-line bg-paper p-7">
              <span className="font-display text-sm font-medium text-primary">{step.n}</span>
              <h3 className="font-display mt-4 text-2xl font-medium tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
