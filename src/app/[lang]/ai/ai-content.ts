import { Locale } from '@/lib/i18n'

export interface ShowcaseItem {
  eyebrow: string
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  bullets: string[]
}

const showcaseImages = {
  productAds: '/images/showcase/spark-product-ads.webp',
  animeGirl: '/images/showcase/anime-girl-realize.webp',
  churchEdit: '/images/showcase/church-construction-details-illustration.webp',
  warriorFusion: '/images/showcase/warrior-office-comparison.webp',
}

export function getAiExampleImages(locale: Locale) {
  if (locale === 'zh') {
    return [
      {
        imageUrl: showcaseImages.productAds,
        alt: '品牌广告视觉示例',
        prompt: '快速生成适合产品广告、品牌展示页和营销视觉的高质量商业图像。',
      },
      {
        imageUrl: showcaseImages.animeGirl,
        alt: '角色一致性示例',
        prompt: '基于参考图保持角色身份一致，继续扩展不同姿态、服装和场景。',
      },
      {
        imageUrl: showcaseImages.churchEdit,
        alt: '自然语言编辑示例',
        prompt: '上传现有图片后直接用自然语言修改颜色、结构、背景和局部细节。',
      },
      {
        imageUrl: showcaseImages.warriorFusion,
        alt: '风格融合与参考图混合示例',
        prompt: '混合多张参考图和视觉风格，生成更完整、更一致的最终画面。',
      },
    ]
  }

  return [
    {
      imageUrl: showcaseImages.productAds,
      alt: 'Product advertising visual example',
      prompt: 'Generate polished campaign-ready visuals for product ads, landing pages, and commercial brand assets in a few seconds.',
    },
    {
      imageUrl: showcaseImages.animeGirl,
      alt: 'Consistent character example',
      prompt: 'Lock a character or subject from a reference image, then reuse that identity across outfits, scenes, and poses.',
    },
    {
      imageUrl: showcaseImages.churchEdit,
      alt: 'Natural language image editing example',
      prompt: 'Upload an existing image and describe the edit in plain language to change objects, lighting, color, or composition.',
    },
    {
      imageUrl: showcaseImages.warriorFusion,
      alt: 'Style fusion and image blending example',
      prompt: 'Blend multiple references or transfer a visual mood while keeping the final composition believable and structured.',
    },
  ]
}

export function getAiShowcaseContent(locale: Locale) {
  if (locale === 'zh') {
    return {
      badge: 'GPT Image 2 Generator',
      title: '用 GPT Image 2 更快生成、编辑并迭代高质量 AI 图像',
      description:
        '把提示词生成、参考图编辑和风格融合放进同一个工作流。Use GPT Image 2 适合做品牌视觉、角色图、图片修改和更真实的商业出图。',
      stats: [
        '适合品牌与广告图',
        '支持参考图与编辑流程',
        '更适合真实生产型工作流',
      ],
      sectionBadge: '功能展示',
      sectionTitle: '几秒内做出更可用的图像结果',
      sectionDescription:
        '参考页最强的地方不是图片多，而是把能力拆成了真实可理解的使用场景。这里我也按同样思路，把 GPT Image 2 的核心能力重新组织成更清晰的落地页结构。',
      items: [
        {
          eyebrow: 'Create Faster',
          title: '更快生成可直接使用的品牌和广告视觉',
          description:
            '不只是随机出图，而是更快得到清晰、完整、适合营销和展示用途的商业视觉。对落地页 hero、产品广告图和品牌素材尤其有价值。',
          imageUrl: showcaseImages.productAds,
          imageAlt: 'GPT Image 2 品牌与广告视觉展示',
          bullets: ['几秒内出高质量结果', '适合品牌页和广告图', '适合商业风格视觉'],
        },
        {
          eyebrow: 'Consistent Characters',
          title: '基于参考图保持角色和主体的一致性',
          description:
            '当你要反复使用同一个角色、人像或商品主体时，GPT Image 2 更适合做连续变化，而不是每次都重新抽一个完全不同的结果。',
          imageUrl: showcaseImages.animeGirl,
          imageAlt: 'GPT Image 2 角色一致性展示',
          bullets: ['适合角色系列图', '适合品牌 mascot', '适合连续场景扩展'],
        },
        {
          eyebrow: 'Edit With Language',
          title: '直接用自然语言改图，而不是重新开始',
          description:
            '上传现有图片后，你可以直接描述想改什么，比如换背景、移除元素、调整光线或替换局部内容。这比反复生成新图更适合真实编辑流程。',
          imageUrl: showcaseImages.churchEdit,
          imageAlt: 'GPT Image 2 自然语言编辑展示',
          bullets: ['支持 plain-language edits', '适合局部修改与延展', '更接近真实改图场景'],
        },
        {
          eyebrow: 'Blend And Transfer',
          title: '融合多张参考图和视觉风格，同时保留结构',
          description:
            '当你需要把人物、场景和某种视觉气质合成一张图时，GPT Image 2 更适合做风格融合和参考图迁移，同时尽量保留原本的主体结构。',
          imageUrl: showcaseImages.warriorFusion,
          imageAlt: 'GPT Image 2 风格融合展示',
          bullets: ['支持多参考融合', '适合风格迁移', '输出更连贯、更完整'],
        },
      ] satisfies ShowcaseItem[],
    }
  }

  return {
    badge: 'GPT Image 2 Generator',
    title: 'Use GPT Image 2 to generate, edit, and refine Chat GPT images faster',
    description:
      'Use GPT Image 2 combines prompt-based generation, image editing, and style blending in one workflow. It is built for realistic visuals, marketing assets, consistent characters, and faster production-style iteration.',
    stats: [
      'Brand-ready visuals in seconds',
      'Reference-guided image editing',
      'Consistent outputs across iterations',
    ],
    sectionBadge: 'Feature Showcase',
    sectionTitle: 'Design-ready visuals in seconds',
    sectionDescription:
      'A stronger GPT Image 2 landing page should explain outcomes, not just show an input box. These sections mirror the real strengths users care about: speed, consistency, editing control, and image blending.',
    items: [
      {
        eyebrow: 'Create Perfect Images',
        title: 'Create stronger commercial visuals faster',
        description:
          'Stop treating the generator like a lottery. Use GPT Image 2 is better when you need polished results for product ads, landing pages, and branded visuals that already feel close to usable.',
        imageUrl: showcaseImages.productAds,
        imageAlt: 'GPT Image 2 product advertising showcase',
        bullets: ['Fast high-quality output', 'Better for campaign and brand visuals', 'Useful for landing page and product art'],
      },
      {
        eyebrow: 'Consistent Characters',
        title: 'Build consistent, lifelike characters and subjects',
        description:
          'Reference-based workflows matter when you want the same face, product, or character across multiple outputs. This is where GPT Image 2 feels more practical than a basic text-only generator.',
        imageUrl: showcaseImages.animeGirl,
        imageAlt: 'GPT Image 2 consistent character showcase',
        bullets: ['Reference-based identity lock', 'Useful for character series and campaigns', 'Keeps subjects recognizable across scenes'],
      },
      {
        eyebrow: 'Natural Language Editing',
        title: 'Edit images with plain language instead of restarting',
        description:
          'Upload an image and describe the change directly. GPT Image 2 is much more compelling when it helps with color changes, object removal, background replacement, and iterative editing without forcing a full reset.',
        imageUrl: showcaseImages.churchEdit,
        imageAlt: 'GPT Image 2 natural language editing showcase',
        bullets: ['Edit with natural instructions', 'Better for image-to-image workflows', 'Keeps refinement in one loop'],
      },
      {
        eyebrow: 'Blend References',
        title: 'Fuse images and styles while keeping the composition believable',
        description:
          'Blending multiple references or carrying over a visual mood is where many image tools fall apart. GPT Image 2 works better when the final output still needs believable lighting, structure, and continuity.',
        imageUrl: showcaseImages.warriorFusion,
        imageAlt: 'GPT Image 2 style fusion showcase',
        bullets: ['Blend multiple references', 'Transfer style with more structure preserved', 'More cohesive final outputs'],
      },
    ] satisfies ShowcaseItem[],
  }
}
