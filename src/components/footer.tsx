import { Logo } from "@/components/logo";
import { NAV, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink pb-24 text-cream md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_1fr] md:px-8">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-light">
            Підбір обладнання Growatt. Інвертори, акумулятори та сонячні
            системи під ключ — Одеса і вся Україна.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-light uppercase">
            Розділи
          </p>
          <ul className="mt-4 grid gap-2 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-primary">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-light uppercase">
            Контакти
          </p>
          <ul className="mt-4 grid gap-2 text-sm">
            <li>
              <a href={SITE.phone ? `tel:${SITE.phone}` : "#order"} className="hover:text-primary">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={SITE.whatsapp} className="hover:text-primary">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={SITE.telegram} className="hover:text-primary">
                Telegram
              </a>
            </li>
            <li className="text-muted-light">{SITE.hours}</li>
            <li className="text-muted-light">{SITE.city}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-muted-light md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} Growatt Energy. Резервне живлення для дому.</p>
          <a href="/privacy" className="underline">Конфіденційність</a>
          <p>Ілюстрації не є підтвердженням виконаних монтажів.</p>
          <a href="https://grok.com" rel="noopener noreferrer" className="underline">
            Created with Grok
          </a>
        </div>
      </div>
    </footer>
  );
}
