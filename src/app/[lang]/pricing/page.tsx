import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/layout";
import { Pricing } from "@/components/ui/pricing";
import { PricingComparison } from "@/components/sections/pricing-comparison";
import { FAQ } from "@/components/sections/faq";
import { MinimalCTA } from "@/components/sections/cta-section";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/i18n";
import { getPricingData } from "@/lib/pricing-server";
import { withCanonical } from "@/lib/seo";

export const dynamic = 'force-static';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return withCanonical(
    {
      title: dict.pricing.title,
      description: dict.pricing.pageSubtitle,
    },
    lang,
    '/pricing'
  )
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const comparison = dict.pricing.comparison;
  const pricingData = await getPricingData(lang);

  const faqDict = {
    ...dict,
    faq: {
      title: dict.faq.title,
      description: dict.faq.description,
      faqs: [...dict.pricing.faqs, ...dict.shared.commonFaqs],
      stillHaveQuestions: dict.faq.stillHaveQuestions,
      contactSupport: dict.faq.contactSupport
    }
  };

  return (
    <Layout dict={dict}>
      <section className="relative overflow-hidden px-4 pb-10 pt-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.16),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.12),transparent_22%)]" />
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <Badge className="mb-5 rounded-full px-4 py-1.5">{dict.pricing.badge}</Badge>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              {dict.pricing.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
              {dict.pricing.pageSubtitle}
            </p>
          </div>
        </div>
      </section>

      <Pricing pricingData={pricingData} dict={dict} lang={lang} />

      <PricingComparison
        comparison={comparison}
        mostPopularText={dict.pricing.mostPopular}
        className="pt-8"
      />

      <FAQ dict={faqDict} />

      <MinimalCTA
        title={dict.pricing.ctaTitle}
        description={dict.pricing.ctaDescription}
        buttonText={dict.common.buttons.getStartedNow}
        href={`/${lang}/signup`}
      />
    </Layout>
  );
}
