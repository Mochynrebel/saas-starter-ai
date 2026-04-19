import React from 'react'
import { Layout } from '@/components/layout/layout'
import { SectionLayout } from '@/components/layout/section-layout'
import { getDictionary } from '@/lib/dictionaries'
import { Locale, locales } from '@/lib/i18n'
import { Sparkles } from 'lucide-react'
import { AIImageGenerator } from './ai-image-generator'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale
  }));
}

export default async function AIPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const aiConfig = dict.ai;

  // Merge generator config with additional fields from dict
  const generatorConfig = {
    ...aiConfig.generator,
    checkingCredits: aiConfig.generator.checkingCredits,
    credits: aiConfig.generator.credits,
    cost: aiConfig.generator.cost,
    creditsUnavailable: aiConfig.generator.creditsUnavailable,
    notEnoughCredits: aiConfig.generator.notEnoughCredits,
    pleaseSignIn: aiConfig.generator.pleaseSignIn,
    unableToFetchCredits: aiConfig.generator.unableToFetchCredits,
    unableToFetchCost: aiConfig.generator.unableToFetchCost,
    failedToFetchCost: aiConfig.generator.failedToFetchCost,
    imageGenerationTimeout: aiConfig.generator.imageGenerationTimeout,
    modelNotConfigured: aiConfig.generator.modelNotConfigured,
    exampleImages: [
      {
        imageUrl: '/images/ai-examples/seedance-style-01.svg',
        alt: lang === 'zh' ? '电影感人像风格' : 'Cinematic portrait style',
        prompt:
          lang === 'zh'
            ? '近景时尚人像，霓虹紫与暖橙边缘光，电影级布光，干净高端杂志封面质感，皮肤细节自然，浅景深'
            : 'Close-up fashion portrait, neon violet and warm orange rim light, cinematic lighting, premium magazine cover aesthetic, natural skin detail, shallow depth of field',
      },
      {
        imageUrl: '/images/ai-examples/seedance-style-02.svg',
        alt: lang === 'zh' ? '高级产品主视觉' : 'Premium product hero',
        prompt:
          lang === 'zh'
            ? '高端护肤精华瓶悬浮在蓝绿色未来感装置中央，玻璃反射，柔和体积光，商业广告摄影，极简背景，超清细节'
            : 'Luxury skincare serum bottle floating in a teal futuristic set, glossy reflections, soft volumetric light, commercial advertising photography, minimal background, ultra detailed',
      },
      {
        imageUrl: '/images/ai-examples/seedance-style-03.svg',
        alt: lang === 'zh' ? '室内氛围板风格' : 'Interior moodboard style',
        prompt:
          lang === 'zh'
            ? '现代奶油风客厅 moodboard，暖米色和焦糖木色，拱形结构，柔和自然晨光，编辑感室内摄影，安静高级'
            : 'Modern cream-toned living room moodboard, warm beige and caramel wood palette, arched architecture, soft morning daylight, editorial interior photography, calm luxury mood',
      },
    ],
  };

  return (
    <Layout dict={dict}>
      <div className="pt-8">
        {/* Hero Section */}
        <SectionLayout
          className="px-4"
          padding="small"
          title={aiConfig.generator.title}
          description={aiConfig.generator.description}
          titleClassName="text-3xl md:text-4xl"
          descriptionClassName="max-w-3xl"
          headerClassName="mb-16"
          locale={lang}
        >
          <AIImageGenerator config={generatorConfig} />
        </SectionLayout>
      </div>
    </Layout>
  )
}

