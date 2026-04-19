import React from 'react'
import { Layout } from '@/components/layout/layout'
import { SectionLayout } from '@/components/layout/section-layout'
import { getDictionary } from '@/lib/dictionaries'
import { Locale, locales } from '@/lib/i18n'
import { AIImageGenerator } from './ai-image-generator'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale
  }))
}

export default async function AIPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const aiConfig = dict.ai

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
        imageUrl: '/images/ai-examples/tweet-sample-01.jpg',
        alt: lang === 'zh' ? '餐厅人像示例' : 'Restaurant portrait sample',
        prompt:
          lang === 'zh'
            ? '餐厅酒架前的近景时尚人像，金色环境光，卷发，自然肤质，桌面酒杯前景，生活方式摄影'
            : 'Close-up fashion portrait in front of a wine wall, warm ambient lighting, wavy blonde hair, natural skin detail, wine glass in the foreground, lifestyle photography',
      },
      {
        imageUrl: '/images/ai-examples/tweet-sample-02.jpg',
        alt: lang === 'zh' ? '游戏皮肤示例' : 'Game skin sample',
        prompt:
          lang === 'zh'
            ? '第一人称射击游戏武器展示，AK-47 蜘蛛侠红蓝配色皮肤，城市街道背景，游戏界面叠层，高清渲染'
            : 'First-person shooter weapon showcase, AK-47 with a red-and-blue Spider-Man themed skin, urban street background, in-game UI overlay, high-detail render',
      },
      {
        imageUrl: '/images/ai-examples/tweet-sample-03.jpg',
        alt: lang === 'zh' ? '夜景街拍示例' : 'Night street fashion sample',
        prompt:
          lang === 'zh'
            ? '夜晚街头时尚摄影，霓虹酒铺招牌前，黑色羽毛外套与墨镜，牛奶飞溅和彩色麦圈定格，闪光灯抓拍'
            : 'Night street fashion photo in front of a neon liquor store sign, black feather coat and sunglasses, frozen splash of milk and colorful cereal loops, flash photography',
      },
    ],
  }

  return (
    <Layout dict={dict}>
      <div className="pt-8">
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
