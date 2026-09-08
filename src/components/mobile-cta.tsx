import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { useLead } from "@/lib/lead-store";

export function MobileCta() {
  const openLead = useLead((s) => s.openLead);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 p-3 pr-24 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <Button asChild variant="ink" className="w-full" size="lg"><a href={SITE.phone ? `tel:${SITE.phone}` : "#order"}>
            <Phone className="size-4" />
            Дзвінок
          </a></Button>
        <Button className="w-full" size="lg" onClick={() => openLead("mobile-cta")}>
          Замовити
        </Button>
      </div>
    </div>
  );
}
