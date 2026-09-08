import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { FAQ } from "@/lib/site";

export function Faq() {
  return (
    <section id="faq" className="bg-cream px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-muted uppercase">FAQ</p>
          <h2 className="font-display mt-4 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            Короткі відповіді перед дзвінком
          </h2>
        </div>
        <Accordion.Root type="single" collapsible className="divide-y divide-line border-y border-line">
          {FAQ.map((item) => (
            <Accordion.Item key={item.q} value={item.q}>
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-start justify-between gap-4 py-5 text-left">
                  <span className="font-display text-base font-medium tracking-tight sm:text-lg">
                    {item.q}
                  </span>
                  <Plus className="mt-0.5 size-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-45" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:hidden">
                <p className="pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
