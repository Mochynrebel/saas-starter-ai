import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/layout";
import { Pricing } from "@/components/ui/pricing";
import { PricingComparison } from "@/components/sections/pricing-comparison";
import { FAQ } from "@/components/sections/faq";
import { MinimalCTA } from "@/components/sections/cta-section";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/i18n";
import { getPricingData } from "@/lib/pricing-server";

export const dynamic = 'force-static';

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const isZh = lang === 'zh';
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
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_420px] lg:items-end">
            <div className="max-w-4xl">
              <Badge className="mb-5 rounded-full px-4 py-1.5">{dict.pricing.badge}</Badge>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                {dict.pricing.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
                {dict.pricing.pageSubtitle}
              </p>
            </div>

            <div className="rounded-[28px] border border-border/60 bg-background/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{isZh ? '本次调整' : 'What changed'}</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{isZh ? '可用的结账路径' : 'Usable checkout flow'}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {isZh
                      ? '即使没有拿到 Stripe 在线价格，套餐卡片现在也仍然可点击和可跳转。'
                      : 'Pricing cards now keep working even when live Stripe pricing is missing.'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{isZh ? '月付 / 年付结构' : 'Monthly / yearly structure'}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {isZh
                      ? '同一个产品现在可以同时挂载并展示多个 billing interval。'
                      : 'The page can now surface multiple billing intervals from the same product.'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{isZh ? '更清晰的决策布局' : 'Cleaner decision layout'}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {isZh
                      ? '套餐卡片、积分卖点和 FAQ 现在按更接近转化页的顺序组织。'
                      : 'Package cards, credit highlights, and FAQ are grouped in a more conversion-oriented order.'}
                  </p>
                </div>
              </div>
            </div>
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
