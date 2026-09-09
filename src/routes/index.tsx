import { publicConfig } from "@/lib/public-config";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileCta } from "@/components/mobile-cta";
import { LeadDialog } from "@/components/lead-dialog";
import { Hero } from "@/components/sections/hero";
import { Trust } from "@/components/sections/trust";
import { Benefits } from "@/components/sections/benefits";
import { Product } from "@/components/sections/product";
import { Load } from "@/components/sections/load";
import { How } from "@/components/sections/how";
import { Solar } from "@/components/sections/solar";
import { Region } from "@/components/sections/region";
import { Process } from "@/components/sections/process";
import { Warranty } from "@/components/sections/warranty";
import { Faq } from "@/components/sections/faq";
import { Lead } from "@/components/sections/lead";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: publicConfig.businessName,
      url: publicConfig.url,
      inLanguage: "uk",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Встановлення інвертора в Одесі та Одеській області",
      serviceType: "Встановлення інверторів і систем резервного живлення",
      areaServed: [
        { "@type": "City", name: "Одеса" },
        { "@type": "AdministrativeArea", name: "Одеська область" },
      ],
      provider: {
        "@type": "Organization",
        name: publicConfig.businessName,
        url: publicConfig.url,
      },
      url: publicConfig.url,
    },
  ];

  return (
    <div className="min-h-svh bg-cream text-foreground">
      {publicConfig.url ? <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData).replace(/</g,"\\u003c")}}/> : null}
      <Header />
      <main id="main" className="pb-20 md:pb-0">
        <Hero />
        <Trust />
        <Benefits />
        <Product />
        <Load />
        <How />
        <Solar />
        <Region />
        <Process />
        <Warranty />
        <Faq />
        <Lead />
      </main>
      <Footer />
      <MobileCta />
      <LeadDialog />
    </div>
  );
}
