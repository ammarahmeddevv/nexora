import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { Quickstart } from "@/components/quickstart";
import { HowARunWorks } from "@/components/how-a-run-works";
import { Features } from "@/components/features";
import { CodeShowcase } from "@/components/code-showcase";
import { Observability } from "@/components/observability";
import { Scale } from "@/components/scale";
import { Pricing } from "@/components/pricing";
import { Cta } from "@/components/cta";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Nexora",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Cloud",
  description:
    "Durable workflow engine for developers — background jobs, cron and multi-step pipelines that survive restarts and retry themselves.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteNav />
      <main>
        <Hero />
        <Quickstart />
        <HowARunWorks />
        <Features />
        <CodeShowcase />
        <Observability />
        <Scale />
        <Pricing />
        <Cta />
      </main>
      <SiteFooter />
    </>
  );
}
