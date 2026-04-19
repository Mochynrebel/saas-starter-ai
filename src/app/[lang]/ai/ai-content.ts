import { Locale } from '@/lib/i18n'

export interface ShowcaseItem {
  eyebrow: string
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  bullets: string[]
}

export function getAiExampleImages(locale: Locale) {
  if (locale === 'zh') {
    return [
      {
        imageUrl: 'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fcreate-and-edit-images.webp&w=3840&q=75',
        alt: '写实人像与细节编辑示例',
        prompt: '生成高保真写实人像，保留肤质、光影和材质细节，并继续做局部编辑。',
      },
      {
        imageUrl: 'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fbrand-your-business.webp&w=3840&q=75',
        alt: '品牌视觉与广告素材示例',
        prompt: '为广告、落地页和产品推广快速生成统一风格的品牌图像素材。',
      },
      {
        imageUrl: 'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fbring-your-wildest-ideas-to-life.webp&w=3840&q=75',
        alt: '创意概念与幻想场景示例',
        prompt: '把抽象创意、幻想概念和复杂构图快速转成可展示的视觉方案。',
      },
      {
        imageUrl: 'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fboost-your-socials.webp&w=3840&q=75',
        alt: '社媒内容与封面图示例',
        prompt: '为社交媒体、帖子封面和短内容持续产出更抓眼的视觉素材。',
      },
    ]
  }

  return [
    {
      imageUrl: 'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fcreate-and-edit-images.webp&w=3840&q=75',
      alt: 'Realistic portrait editing example',
      prompt: 'Create realistic portraits with strong lighting, natural skin texture, and follow-up edits from the same visual starting point.',
    },
    {
      imageUrl: 'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fbrand-your-business.webp&w=3840&q=75',
      alt: 'Brand campaign visual example',
      prompt: 'Generate brand visuals, ad creatives, and hero images with a consistent commercial look for landing pages and campaigns.',
    },
    {
      imageUrl: 'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fbring-your-wildest-ideas-to-life.webp&w=3840&q=75',
      alt: 'Concept art and imaginative scene example',
      prompt: 'Turn unusual prompts, layered concepts, and high-imagination scenes into polished visual directions in seconds.',
    },
    {
      imageUrl: 'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fboost-your-socials.webp&w=3840&q=75',
      alt: 'Social content visual example',
      prompt: 'Produce sharper social graphics, cover art, and post-ready visuals for fast-moving content workflows.',
    },
  ]
}

export function getAiShowcaseContent(locale: Locale) {
  if (locale === 'zh') {
    return {
      badge: 'GPT Image 2 Generator',
      title: '用 GPT Image 2 生成、编辑并迭代更真实的 AI 图像',
      description:
        '把提示词、参考图和后续编辑放进同一个工作流。Use GPT Image 2 适合做品牌视觉、社媒素材、概念草图和写实风格图像。',
      stats: [
        '写实风格输出',
        '提示词生成与编辑',
        '参考图驱动修改',
      ],
      sectionBadge: '功能展示',
      sectionTitle: '你可以用 GPT Image 2 完成哪些图像工作',
      sectionDescription:
        '从品牌视觉到内容营销，再到创意概念图，下面这几个场景更接近真实落地使用方式，而不是单纯演示一个模型输入框。',
      items: [
        {
          eyebrow: 'Create And Edit',
          title: '先生成，再继续改，保留一致的视觉方向',
          description:
            '不仅能从文本开始生成，还能基于已有图像继续调整构图、风格和局部细节，让图像工作流更接近真实生产过程。',
          imageUrl:
            'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fcreate-and-edit-images.webp&w=3840&q=75',
          imageAlt: 'GPT Image 2 图像生成与编辑展示',
          bullets: ['支持提示词生成', '支持参考图编辑', '适合反复迭代'],
        },
        {
          eyebrow: 'Brand Assets',
          title: '更快产出品牌页、广告图和产品视觉',
          description:
            '当你需要统一风格的营销图、落地页视觉或产品宣传图时，可以更快地批量探索方向，而不是从零做每一张图。',
          imageUrl:
            'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fbrand-your-business.webp&w=3840&q=75',
          imageAlt: 'GPT Image 2 品牌视觉展示',
          bullets: ['适合品牌展示图', '适合广告素材', '适合落地页 hero 图'],
        },
        {
          eyebrow: 'Creative Concepts',
          title: '把复杂创意和高概念想法直接变成图像',
          description:
            '无论是幻想场景、实验风格还是多元素组合的复杂描述，都可以更快拿到第一版视觉结果，方便继续筛选和 refine。',
          imageUrl:
            'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fbring-your-wildest-ideas-to-life.webp&w=3840&q=75',
          imageAlt: 'GPT Image 2 创意概念展示',
          bullets: ['适合概念草图', '适合幻想与艺术风格', '适合多轮创意探索'],
        },
        {
          eyebrow: 'Social Content',
          title: '为社媒、封面和内容营销准备更吸睛的视觉',
          description:
            '如果你的内容更新频率高，Use GPT Image 2 可以帮助你更快生产封面图、社媒配图和不同尺寸的视觉内容。',
          imageUrl:
            'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fboost-your-socials.webp&w=3840&q=75',
          imageAlt: 'GPT Image 2 社媒视觉展示',
          bullets: ['适合社媒配图', '适合封面与缩略图', '适合高频内容团队'],
        },
      ] satisfies ShowcaseItem[],
    }
  }

  return {
    badge: 'GPT Image 2 Generator',
    title: 'Use GPT Image 2 to create, edit, and refine realistic AI images',
    description:
      'Generate Chat GPT images from prompts, reference images, and edit flows in one workspace. Use GPT Image 2 is built for realistic outputs, brand visuals, social content, and fast iteration.',
    stats: [
      'Realistic AI image generation',
      'Prompt + image editing workflow',
      'Built for production-style iteration',
    ],
    sectionBadge: 'Feature Showcase',
    sectionTitle: 'What you can do with GPT Image 2 beyond a basic prompt box',
    sectionDescription:
      'A strong landing page needs to show outcomes, not just controls. These showcase blocks explain how GPT Image 2 fits real image workflows for design, marketing, and visual experimentation.',
    items: [
      {
        eyebrow: 'Create And Edit',
        title: 'Generate an image first, then keep editing in the same workflow',
        description:
          'Start from text, then continue with reference-guided edits, layout changes, and visual refinements. This makes the experience feel closer to a real production tool instead of a one-shot generator.',
        imageUrl:
          'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fcreate-and-edit-images.webp&w=3840&q=75',
        imageAlt: 'GPT Image 2 create and edit showcase',
        bullets: ['Text-to-image generation', 'Reference image editing', 'Fast iteration for multiple directions'],
      },
      {
        eyebrow: 'Brand Assets',
        title: 'Produce stronger brand visuals for landing pages, ads, and campaigns',
        description:
          'Use GPT Image 2 works well for polished marketing assets, product visuals, and commercial-style imagery when you need a faster way to explore brand-ready art direction.',
        imageUrl:
          'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fbrand-your-business.webp&w=3840&q=75',
        imageAlt: 'GPT Image 2 branding showcase',
        bullets: ['Landing page hero graphics', 'Ad creative exploration', 'Consistent commercial image style'],
      },
      {
        eyebrow: 'Creative Concepts',
        title: 'Turn unusual ideas and layered prompts into visual concepts quickly',
        description:
          'From surreal compositions to imaginative worlds, GPT Image 2 helps you move from abstract prompt language to a visual direction you can actually evaluate and iterate on.',
        imageUrl:
          'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fbring-your-wildest-ideas-to-life.webp&w=3840&q=75',
        imageAlt: 'GPT Image 2 creative concept showcase',
        bullets: ['Concept art exploration', 'Fantasy and experimental scenes', 'Useful for early visual ideation'],
      },
      {
        eyebrow: 'Social Content',
        title: 'Create sharper visuals for social posts, covers, and content pipelines',
        description:
          'If you publish often, you need output that looks intentional and reusable. Use GPT Image 2 helps teams generate visuals for thumbnails, cover art, and social content much faster.',
        imageUrl:
          'https://gptimage2ai.com/_next/image?url=%2Ffeature_showcase%2Fboost-your-socials.webp&w=3840&q=75',
        imageAlt: 'GPT Image 2 social content showcase',
        bullets: ['Social-ready graphics', 'Cover and thumbnail visuals', 'Useful for repeat content workflows'],
      },
    ] satisfies ShowcaseItem[],
  }
}
