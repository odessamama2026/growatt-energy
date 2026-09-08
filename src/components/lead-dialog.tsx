import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { LeadForm } from "@/components/lead-form";
import { useLead } from "@/lib/lead-store";
import { SITE } from "@/lib/site";

export function LeadDialog() {
  const { open, source, closeLead } = useLead();

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? closeLead() : null)}>
      <DialogContent>
        <DialogTitle>Замовити зворотний дзвінок</DialogTitle>
        <DialogDescription>
          {SITE.response}. Або одразу {SITE.phoneDisplay}.
        </DialogDescription>
        <div className="mt-5">
          {open ? <LeadForm key={source} source={source} compact /> : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
