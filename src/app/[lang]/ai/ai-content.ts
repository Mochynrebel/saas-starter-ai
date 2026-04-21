import { Locale } from '@/lib/i18n'

export interface ShowcaseItem {
  eyebrow: string
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  bullets: string[]
}

interface AiFaqItem {
  question: string
  answer: string
}

const showcaseImages = {
  productAds: '/images/showcase/spark-product-ads.webp',
  animeGirl: '/images/showcase/anime-girl-realize.webp',
  churchEdit: '/images/showcase/church-construction-details-illustration.webp',
  warriorFusion: '/images/showcase/warrior-office-comparison.webp',
}

export function getHomeHeroContent(locale: Locale) {
  if (locale === 'zh') {
    return {
      title: '用 GPT Image 2 把想法更快变成好看的图片',
      description:
        '输入一句人话就能开始生成。先在首页看效果，再进入 AI 工作台继续创建、编辑和下载你的结果。',
    }
  }

  return {
    title: 'Turn ideas into polished images faster with GPT Image 2',
    description:
      'Start with a simple prompt, watch the workflow in action, then jump into the AI workspace to create, edit, and download your own results.',
  }
}

export function getAiExampleImages(locale: Locale) {
  if (locale === 'zh') {
    return [
      {
        imageUrl: showcaseImages.productAds,
        alt: '品牌广告视觉示例',
        prompt: '给我做一张看起来很高级的产品广告图，背景干净一点，像品牌官网首页会用的那种。',
      },
      {
        imageUrl: showcaseImages.animeGirl,
        alt: '角色一致性示例',
        prompt: '想要一个好看的女生角色，风格真实一点，换几个不同场景，但人物要像同一个人。',
      },
      {
        imageUrl: showcaseImages.churchEdit,
        alt: '自然语言编辑示例',
        prompt: '把这张图改得更明亮一点，细节更清楚，背景也顺手优化一下。',
      },
      {
        imageUrl: showcaseImages.warriorFusion,
        alt: '风格融合与参考图混合示例',
        prompt: '把办公室场景和电影感角色风格混在一起，做成一张有冲击力但又自然的图。',
      },
    ]
  }

  return [
    {
      imageUrl: showcaseImages.productAds,
      alt: 'Product advertising visual example',
      prompt: 'Make this look like a premium product ad with a clean background and nice lighting.',
    },
    {
      imageUrl: showcaseImages.animeGirl,
      alt: 'Consistent character example',
      prompt: 'Create a pretty female character and keep her looking like the same person in different scenes.',
    },
    {
      imageUrl: showcaseImages.churchEdit,
      alt: 'Natural language image editing example',
      prompt: 'Make this image brighter, cleaner, and a bit more detailed without changing the whole scene.',
    },
    {
      imageUrl: showcaseImages.warriorFusion,
      alt: 'Style fusion and image blending example',
      prompt: 'Mix an office scene with a cinematic fantasy style, but keep it looking natural and believable.',
    },
  ]
}

export function getAiShowcaseContent(locale: Locale) {
  if (locale === 'zh') {
    return {
      title: '用 GPT Image 2 更快生成和编辑 AI 图像',
      description:
        '把生图、改图和参考图工作流放进同一个界面，快速做出更可用的品牌视觉、角色图和营销素材。',
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
    title: 'Generate and edit AI images with GPT Image 2',
    description:
      'Create images, edit references, and refine outputs in one workflow built for marketing visuals, consistent characters, and faster iteration.',
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

export function getAiWorkspaceContent(locale: Locale) {
  if (locale === 'zh') {
    return {
      title: 'Workspace',
      description:
        '在这里直接输入提示词、上传参考图、生成结果并继续迭代。',
    }
  }

  return {
    title: 'Workspace',
    description:
      'Write prompts, upload references, generate results, and keep iterating.',
  }
}

export function getAiFaqContent(locale: Locale) {
  if (locale === 'zh') {
    return {
      faq: {
        title: 'Q&A',
        description: '关于 GPT Image 2 Generator 的常见问题。',
        faqs: [
          {
            question: '什么是 GPT Image 2 Generator？',
            answer:
              '它是一个基于 GPT Image 2 的在线生图与改图工具，支持文本生成、参考图编辑和多轮迭代。',
          },
          {
            question: '我可以用文字直接修改现有图片吗？',
            answer:
              '可以。上传参考图后，你可以直接描述想改的内容，比如背景、颜色、构图或局部元素。',
          },
          {
            question: '它适合做哪些类型的图片？',
            answer:
              '比较适合产品广告图、落地页视觉、角色设定图、社媒素材，以及需要连续迭代的商业图片。',
          },
          {
            question: '怎样才能获得更稳定的结果？',
            answer:
              '建议明确主体、风格、构图和光线要求；如果要保持一致性，最好同时提供参考图并分步骤迭代。',
          },
          {
            question: '生成后的图片可以下载吗？',
            answer:
              '可以，生成完成后可以直接下载结果图，继续用于设计、内容制作或后续编辑流程。',
          },
        ] satisfies AiFaqItem[],
      },
    }
  }

  return {
    faq: {
      title: 'Q&A',
      description: 'Common questions about using GPT Image 2 for image generation and editing.',
      faqs: [
        {
          question: 'What is GPT Image 2 Generator?',
          answer:
            'It is an AI image tool built for prompt-based generation, reference-guided editing, and faster visual iteration in one workflow.',
        },
        {
          question: 'Can I edit an existing image with text instructions?',
          answer:
            'Yes. You can upload a reference image and describe changes in plain language, including background swaps, object edits, lighting, and composition tweaks.',
        },
        {
          question: 'What kinds of images is it best for?',
          answer:
            'It works well for product visuals, landing page graphics, ad creatives, character variations, and other production-style image tasks.',
        },
        {
          question: 'How do I get more consistent outputs?',
          answer:
            'Be specific about subject, style, framing, and lighting. For stronger consistency, reuse reference images and refine the result in smaller steps.',
        },
        {
          question: 'Can I download the generated images?',
          answer:
            'Yes. After generation, you can download the image and keep iterating on it inside the same workflow if needed.',
        },
      ] satisfies AiFaqItem[],
    },
  }
}
