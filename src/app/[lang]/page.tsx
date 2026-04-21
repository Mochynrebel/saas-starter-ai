import { Layout } from "@/components/layout/layout";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/i18n";
import { FAQ } from "@/components/sections/faq";
import { getAiExampleImages, getAiFaqContent, getAiShowcaseContent, getHomeHeroContent } from "./ai/ai-content";
import { FeatureShowcase } from "./ai/feature-showcase";
import { HomeImageWorkbench } from "./home-image-workbench";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const homeHero = getHomeHeroContent(lang);
  const examples = getAiExampleImages(lang);
  const showcase = getAiShowcaseContent(lang);
  const faq = getAiFaqContent(lang);

  return (
    <Layout dict={dict}>
      <>
        <HomeImageWorkbench
          locale={lang}
          title={homeHero.title}
          description={homeHero.description}
          examples={examples}
        />
        <FeatureShowcase
          badge={showcase.sectionBadge}
          title={showcase.sectionTitle}
          description={showcase.sectionDescription}
          items={showcase.items}
        />
        <FAQ dict={faq} />
      </>
    </Layout>
  );
}
