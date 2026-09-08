import { OptimizedImage } from "@/components/optimized-image";
import { Phone } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export function Lead() {
  return (
    <section id="order" className="bg-paper px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl border border-line bg-cream lg:grid-cols-2">
        <div className="relative min-h-80">
          <OptimizedImage
            src="/images/night.jpg"
            alt="Будинок із резервним живленням Growatt"
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-ink/55" />
          <div className="relative flex h-full flex-col justify-end p-8 text-cream md:p-12">
            <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
              Заявка
            </p>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Залиште номер — або наберіть самі
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-light">
              {SITE.response}. Порахуємо комплект під ваш щит і скажемо чесно,
              чи вистачить 5 кВт·год, чи краще одразу 10.
            </p>
            <Button asChild variant="primary" size="lg"><a href={SITE.phone ? `tel:${SITE.phone}` : "#order"} className="mt-8 inline-flex">
                <Phone className="size-4" />
                {SITE.phoneDisplay}
              </a></Button>
          </div>
        </div>
        <div className="p-6 md:p-10">
          <LeadForm source="footer-section" />
        </div>
      </div>
    </section>
  );
}
