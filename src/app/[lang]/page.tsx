import { Layout } from "@/components/layout/layout";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/i18n";
import { HomeImageWorkbench, HomeImageWorkbenchCopy } from "./home-image-workbench";

export const dynamic = "force-static";

const enCopy: HomeImageWorkbenchCopy = {
  badge: "AI image studio",
  title: "Design prompts on the left. Review polished generations on the right.",
  description:
    "A homepage rebuilt as a focused image workspace: cleaner controls, quieter chrome, and a result-first canvas inspired by modern AI creation tools.",
  controlTitle: "Generation controls",
  controlDescription:
    "Choose a model, shape the prompt, and tune the output before you spend credits.",
  resultEyebrow: "Preview",
  resultTitle: "Result canvas",
  resultDescription:
    "Large output area for generations, variations, and history. Built to keep attention on the image, not the interface.",
  promptLabel: "Prompt",
  promptPlaceholder:
    "Editorial fashion portrait, soft rim light, wet asphalt reflections, premium campaign aesthetic, precise skin texture, muted beige palette",
  generate: "Generate image",
  generating: "Generating...",
  surprise: "Surprise me",
  modelLabel: "Model",
  sizeLabel: "Size",
  sizeDescription: "Available sizes update with the selected model.",
  outputLabel: "Output settings",
  tips: [
    "High fidelity detail pass enabled",
    "Negative prompt guardrails active",
    "Fast preview disabled for maximum quality",
  ],
  metrics: [
    { label: "Queue time", value: "~12 sec" },
    { label: "Resolution", value: "2048 x 2048" },
    { label: "Style bias", value: "Editorial" },
  ],
  historyTitle: "Recent generations",
  previewBadge: "Premium editorial render",
  promptSnapshotLabel: "Prompt snapshot",
  openFullView: "Open full view",
  readyToUpscale: "Ready to upscale",
  focusTitle: "Focus",
  focusDescription:
    "Left-side controls stay compact so the result canvas can dominate the viewport on desktop.",
  systemTitle: "System",
  systemDescription:
    "Uses the existing image generation API and credit checks instead of a disconnected landing-page mockup.",
  nextTitle: "Next",
  nextDescription:
    "This homepage now runs the real generation flow. Keep iterating here instead of splitting users between two entry points.",
  ctaTitle: "Launch the generator flow from the homepage",
  ctaDescription:
    "Keep the homepage as the product surface, not a separate marketing page.",
  ctaButton: "Open dedicated studio",
  noteCheckingCredits: "Checking credits...",
  noteCredits: "Credits",
  noteCost: "Cost",
  noteCreditsUnavailable: "Credits unavailable",
  modelNotConfigured: "Not configured",
  signInHint: "Please sign in to generate images.",
};

const zhCopy: HomeImageWorkbenchCopy = {
  badge: "AI Image Studio",
  title: "Control prompts on the left. Review generated images on the right.",
  description:
    "The homepage now behaves like an image generation workspace instead of a separate marketing shell.",
  controlTitle: "Generation controls",
  controlDescription:
    "Choose a model, edit the prompt, and adjust output settings before generating.",
  resultEyebrow: "Preview",
  resultTitle: "Result canvas",
  resultDescription:
    "A larger result area for generated images, variations, and recent history.",
  promptLabel: "Prompt",
  promptPlaceholder:
    "Cinematic fashion portrait, soft rim light, reflective wet street, premium campaign look, precise skin texture, muted neutral palette",
  generate: "Generate image",
  generating: "Generating...",
  surprise: "Surprise me",
  modelLabel: "Model",
  sizeLabel: "Size",
  sizeDescription: "Available sizes update automatically with the selected model.",
  outputLabel: "Output settings",
  tips: [
    "High fidelity detail pass enabled",
    "Negative prompt guardrails active",
    "Fast preview disabled for maximum quality",
  ],
  metrics: [
    { label: "Queue time", value: "~12 sec" },
    { label: "Resolution", value: "2048 x 2048" },
    { label: "Style bias", value: "Editorial" },
  ],
  historyTitle: "Recent generations",
  previewBadge: "Premium editorial render",
  promptSnapshotLabel: "Prompt snapshot",
  openFullView: "Open full view",
  readyToUpscale: "Ready to upscale",
  focusTitle: "Focus",
  focusDescription:
    "The left control panel stays compact so the result canvas remains dominant on desktop.",
  systemTitle: "System",
  systemDescription:
    "This homepage is connected to the existing generation API and credit checks.",
  nextTitle: "Next",
  nextDescription:
    "You can keep iterating on the homepage workflow directly instead of sending users to a separate entry point.",
  ctaTitle: "Launch the generator from the homepage",
  ctaDescription: "Keep the homepage as the product surface.",
  ctaButton: "Open dedicated studio",
  noteCheckingCredits: "Checking credits...",
  noteCredits: "Credits",
  noteCost: "Cost",
  noteCreditsUnavailable: "Credits unavailable",
  modelNotConfigured: "Not configured",
  signInHint: "Please sign in to generate images.",
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
  const aiConfig = dict.ai;

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
  };

  return (
    <Layout dict={dict} className="bg-[#f5f3ee]">
      <HomeImageWorkbench
        lang={lang}
        copy={copy[lang] ?? copy.en}
        generatorConfig={generatorConfig}
      />
    </Layout>
  );
}
