import { Layout } from "@/components/layout/layout";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/i18n";
import { HomeImageWorkbench, HomeImageWorkbenchCopy } from "./home-image-workbench";

export const dynamic = "force-static";

const enCopy: HomeImageWorkbenchCopy = {
  badge: "AI image generator",
  title: "Describe the image you want. Generate polished results in one click.",
  description:
    "The homepage now explains the workflow immediately: write a clear prompt, choose a style, and open the full studio to generate production-ready images.",
  promptLabel: "Prompt",
  promptPlaceholder:
    "A premium skincare bottle floating above beige stone, soft sunlight from the left, clean luxury ad style, realistic shadow, high-end product photography, 4k detail",
  promptHint: "Be specific about subject, style, lighting, and composition.",
  promptChips: [
    "Subject",
    "Style",
    "Lighting",
    "Camera angle",
    "Color palette",
  ],
  stepsTitle: "How it works",
  steps: [
    {
      title: "Write the prompt first",
      description:
        "Tell the model what to generate, then add style, lighting, composition, and mood so the output is easier to control.",
    },
    {
      title: "Open the studio to generate",
      description:
        "Use the dedicated AI page for model selection, size settings, image history, and the actual generation flow.",
    },
    {
      title: "Compare examples and refine",
      description:
        "Use the example gallery as a reference, then tighten the wording in your prompt until the result matches your intent.",
    },
  ],
  examplesEyebrow: "Examples",
  examplesTitle: "See the kind of visual output you can generate",
  examplesDescription:
    "The right side now acts as a quick quality benchmark, so users understand the tool before they enter the full generator.",
  examplePromptLabel: "Example prompt",
  examplePrompt:
    "Minimalist cafe interior, warm oak wood, morning light through large windows, soft shadows, editorial interior photography, calm beige and olive tones",
  examples: [
    {
      title: "Product ad concept",
      tag: "Luxury",
      image: "/images/cases/case1.png",
    },
    {
      title: "Editorial portrait",
      tag: "Portrait",
      image: "/images/cases/case2.png",
    },
    {
      title: "Interior moodboard",
      tag: "Space",
      image: "/images/cases/case3.png",
    },
  ],
  primaryCta: "Open AI Studio",
  secondaryCta: "See workflow",
  footerTitle: "Homepage is now the explanation layer, not a second generator.",
  footerDescription:
    "Users understand the product from the first screen, then move into the AI page for the full prompt-to-image workflow.",
};

const zhCopy: HomeImageWorkbenchCopy = {
  badge: "AI 图片生成器",
  title: "先写 Prompt，再生成图片，用户进入首页就知道该怎么用。",
  description:
    "首页不再和 AI 页面重复。这里直接告诉用户使用方式：先输入想要的画面描述，再进入生成页完成模型选择和出图。",
  promptLabel: "Prompt 输入区",
  promptPlaceholder:
    "一瓶高端护肤品悬浮在米色石材上方，左侧柔光，极简高级广告风格，真实阴影，产品摄影质感，画面干净，4K 细节",
  promptHint: "建议写清主体、风格、光线、构图和色调。",
  promptChips: [
    "主体",
    "风格",
    "光线",
    "镜头角度",
    "颜色氛围",
  ],
  stepsTitle: "三步上手",
  steps: [
    {
      title: "先输入你想生成的画面",
      description:
        "把主体、场景、风格、光线和细节写进 Prompt，用户一眼就能理解这个工具的核心输入是什么。",
    },
    {
      title: "进入 AI 页面完成生成",
      description:
        "模型选择、尺寸设置、积分检查、历史记录这些完整功能保留在 AI 页面，不再和首页重复。",
    },
    {
      title: "参考右侧示例继续优化",
      description:
        "用户可以先看右侧效果图，再回头补充 Prompt，让自己的描述更接近目标结果。",
    },
  ],
  examplesEyebrow: "效果示例",
  examplesTitle: "右侧直接展示可生成的图片效果",
  examplesDescription:
    "这样用户进入首页时，不需要先研究功能区，就能先理解这个工具最终能产出什么样的视觉结果。",
  examplePromptLabel: "示例 Prompt",
  examplePrompt:
    "极简咖啡馆室内，橡木材质，清晨阳光从大窗户照入，柔和阴影，杂志感室内摄影，米色和橄榄绿色调，安静高级",
  examples: [
    {
      title: "产品广告图",
      tag: "商业质感",
      image: "/images/cases/case1.png",
    },
    {
      title: "人物风格图",
      tag: "人像",
      image: "/images/cases/case2.png",
    },
    {
      title: "空间氛围图",
      tag: "室内",
      image: "/images/cases/case3.png",
    },
  ],
  primaryCta: "进入 AI 生成页",
  secondaryCta: "查看使用流程",
  footerTitle: "首页负责讲清楚产品，AI 页面负责完成生成。",
  footerDescription:
    "这样首页承担产品说明和示例展示，AI 页面继续保留完整的图片生成能力，两个页面的角色就分开了。",
};

const copy: Record<Locale, HomeImageWorkbenchCopy> = {
  en: enCopy,
  zh: zhCopy,
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <Layout dict={dict} className="bg-[#f5f3ee]">
      <HomeImageWorkbench lang={lang} copy={copy[lang] ?? copy.en} />
    </Layout>
  );
}
