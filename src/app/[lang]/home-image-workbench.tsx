"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  Download,
  ImageIcon,
  Layers3,
  Loader2,
  SlidersHorizontal,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDefaultSize, getSupportedSizes, modelOptions } from "@/lib/ai-models";

interface GeneratorConfig {
  promptPlaceholder: string;
  emptyStateDescription?: string;
  checkingCredits?: string;
  credits?: string;
  cost?: string;
  creditsUnavailable?: string;
  notEnoughCredits?: string;
  pleaseSignIn?: string;
  unableToFetchCredits?: string;
  unableToFetchCost?: string;
  failedToFetchCost?: string;
  imageGenerationTimeout?: string;
  modelNotConfigured?: string;
}

export interface HomeImageWorkbenchCopy {
  badge: string;
  title: string;
  description: string;
  controlTitle: string;
  controlDescription: string;
  resultEyebrow: string;
  resultTitle: string;
  resultDescription: string;
  promptLabel: string;
  promptPlaceholder: string;
  generate: string;
  generating: string;
  surprise: string;
  modelLabel: string;
  sizeLabel: string;
  sizeDescription: string;
  outputLabel: string;
  tips: string[];
  metrics: Array<{ label: string; value: string }>;
  historyTitle: string;
  previewBadge: string;
  promptSnapshotLabel: string;
  openFullView: string;
  readyToUpscale: string;
  focusTitle: string;
  focusDescription: string;
  systemTitle: string;
  systemDescription: string;
  nextTitle: string;
  nextDescription: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
  noteCheckingCredits: string;
  noteCredits: string;
  noteCost: string;
  noteCreditsUnavailable: string;
  modelNotConfigured: string;
  signInHint: string;
}

interface HomeImageWorkbenchProps {
  lang: string;
  copy: HomeImageWorkbenchCopy;
  generatorConfig: GeneratorConfig;
}

interface ModelStatus {
  value: string;
  label: string;
  configured: boolean;
}

interface HistoryItem {
  imageUrl: string;
  prompt: string;
  modelValue: string;
  modelLabel: string;
  size: string;
}

const GENERATION_TIMEOUT_MS = 30_000;
const SURPRISE_PROMPTS = [
  "Cinematic portrait of a designer in a brutalist studio, soft shadows, editorial color grading, premium fashion campaign",
  "Luxury skincare product floating above sculpted stone, macro lighting, warm neutral palette, glossy packaging photography",
  "Futuristic boutique hotel lobby, layered textures, sunlit haze, minimalist interior photography, architectural digest style",
  "Streetwear campaign shot at dusk, reflective pavement, controlled flash, muted palette, magazine-quality composition",
];

function buildApiUrl(path: string) {
  const apiPath = path.startsWith("/") ? path : `/${path}`;
  const apiBase = process.env.NEXT_PUBLIC_API_URL_DEV;

  if (apiBase && apiBase.trim() !== "") {
    return `${apiBase}${apiPath}`;
  }

  return `/api${apiPath}`;
}

export function HomeImageWorkbench({
  lang,
  copy,
  generatorConfig,
}: HomeImageWorkbenchProps) {
  const defaultModel = modelOptions[0]?.value ?? "fal-ai/flux/schnell";
  const [prompt, setPrompt] = useState(copy.promptPlaceholder);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [availableSizes, setAvailableSizes] = useState<string[]>(
    getSupportedSizes(defaultModel)
  );
  const [selectedSize, setSelectedSize] = useState(getDefaultSize(defaultModel));
  const [modelStatuses, setModelStatuses] = useState<ModelStatus[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isCheckingCredits, setIsCheckingCredits] = useState(false);
  const [creditsBalance, setCreditsBalance] = useState<number | null>(null);
  const [hasEnoughCredits, setHasEnoughCredits] = useState<boolean | null>(null);
  const [creditCost, setCreditCost] = useState<number>(1);
  const [isFetchingCost, setIsFetchingCost] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [lastDurationMs, setLastDurationMs] = useState<number | null>(null);

  useEffect(() => {
    const sizes = getSupportedSizes(selectedModel);
    setAvailableSizes(sizes);

    if (!sizes.includes(selectedSize)) {
      setSelectedSize(getDefaultSize(selectedModel));
    }
  }, [selectedModel, selectedSize]);

  useEffect(() => {
    fetchModelStatuses();
    fetchCreditCost();
    fetchCreditsBalance();
  }, []);

  useEffect(() => {
    updateCreditAvailability(creditsBalance, creditCost);
  }, [creditsBalance, creditCost]);

  const configuredModels = useMemo(() => {
    if (modelStatuses.length === 0) {
      return modelOptions.map((option) => ({
        value: option.value,
        label: option.label,
        configured: true,
      }));
    }

    return modelStatuses;
  }, [modelStatuses]);

  const selectedModelMeta =
    configuredModels.find((model) => model.value === selectedModel) ??
    configuredModels[0] ??
    {
      value: defaultModel,
      label: modelOptions[0]?.label ?? defaultModel,
      configured: true,
    };

  const rightSideMetrics = [
    {
      label: copy.metrics[0]?.label ?? "Queue time",
      value: isGenerating
        ? copy.generating
        : lastDurationMs
        ? `${(lastDurationMs / 1000).toFixed(1)}s`
        : copy.metrics[0]?.value ?? "~12 sec",
    },
    {
      label: copy.metrics[1]?.label ?? "Resolution",
      value: selectedSize.replace("x", " x "),
    },
    {
      label: copy.metrics[2]?.label ?? "Style bias",
      value: selectedModelMeta.label.split("/").pop() ?? copy.metrics[2]?.value ?? "Default",
    },
  ];

  const canGenerate =
    prompt.trim().length > 0 &&
    !isGenerating &&
    !isCheckingCredits &&
    !isFetchingCost &&
    hasEnoughCredits !== false;

  async function fetchModelStatuses() {
    try {
      const response = await fetch(buildApiUrl("/ai/models"));
      const data = await response.json();

      if (Array.isArray(data?.models)) {
        setModelStatuses(data.models);
        const firstConfigured = data.models.find((model: ModelStatus) => model.configured);

        if (firstConfigured) {
          setSelectedModel((currentModel) => {
            const existing = data.models.find(
              (model: ModelStatus) => model.value === currentModel && model.configured
            );
            return existing ? currentModel : firstConfigured.value;
          });
        }
      }
    } catch (fetchError) {
      console.error("[HomeImageWorkbench] fetch model statuses error", fetchError);
    }
  }

  function updateCreditAvailability(balance: number | null, cost: number) {
    if (balance === null) {
      setHasEnoughCredits(null);
      return;
    }

    const enough = balance >= cost;
    setHasEnoughCredits(enough);

    if (!enough) {
      const message =
        generatorConfig.notEnoughCredits ||
        "Not enough credits to generate images. Please top up.";
      setBalanceError(message);
      setError((currentError) => currentError ?? message);
    } else {
      setBalanceError(null);
    }
  }

  async function fetchCreditCost() {
    setIsFetchingCost(true);

    try {
      const response = await fetch(buildApiUrl("/ai/image-cost"));
      if (!response.ok) {
        throw new Error(
          generatorConfig.failedToFetchCost || "Failed to fetch image cost."
        );
      }

      const data = await response.json();
      const cost = typeof data.cost === "number" && data.cost > 0 ? data.cost : 1;
      setCreditCost(cost);
    } catch (fetchError) {
      console.error("[HomeImageWorkbench] fetch cost error", fetchError);
      setBalanceError(
        generatorConfig.unableToFetchCost ||
          "Unable to load credit cost. Assuming default value."
      );
    } finally {
      setIsFetchingCost(false);
    }
  }

  async function fetchCreditsBalance() {
    setIsCheckingCredits(true);

    try {
      const response = await fetch(buildApiUrl("/credits/balance"), {
        credentials: "include",
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        const message =
          response.status === 401
            ? generatorConfig.pleaseSignIn || copy.signInHint
            : errorJson?.error ||
              generatorConfig.unableToFetchCredits ||
              "Unable to fetch credits. Please try again.";

        setBalanceError(message);
        setHasEnoughCredits(false);
        return;
      }

      const data = await response.json();
      const balance = typeof data.balance === "number" ? data.balance : 0;
      setCreditsBalance(balance);
    } catch (fetchError) {
      console.error("[HomeImageWorkbench] fetch credits error", fetchError);
      setBalanceError(
        generatorConfig.unableToFetchCredits ||
          "Unable to fetch credits. Please try again later."
      );
      setHasEnoughCredits(false);
    } finally {
      setIsCheckingCredits(false);
    }
  }

  async function handleGenerate(event?: React.FormEvent) {
    event?.preventDefault();

    if (!prompt.trim()) {
      setError(
        generatorConfig.emptyStateDescription || "Please enter a prompt."
      );
      return;
    }

    const selectedStatus = configuredModels.find(
      (model) => model.value === selectedModel
    );

    if (selectedStatus && !selectedStatus.configured) {
      setError(
        generatorConfig.modelNotConfigured || copy.modelNotConfigured
      );
      return;
    }

    setIsGenerating(true);
    setError(null);

    const controller =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller
      ? window.setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS)
      : null;
    const startedAt = Date.now();

    try {
      const response = await fetch(buildApiUrl("/ai/generate"), {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        signal: controller?.signal,
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          size: selectedSize,
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        const errorMessage =
          errorJson?.message ||
          errorJson?.error ||
          `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const nextImageUrl =
        typeof data?.imageUrl === "string" ? data.imageUrl : null;

      if (!nextImageUrl) {
        throw new Error("No image URL returned from generator.");
      }

      setImageUrl(nextImageUrl);
      setLastDurationMs(Date.now() - startedAt);

      if (typeof data?.credits?.balance === "number") {
        setCreditsBalance(data.credits.balance);
      } else {
        fetchCreditsBalance();
      }

      setHistory((currentHistory) => [
        {
          imageUrl: nextImageUrl,
          prompt,
          modelValue: selectedModel,
          modelLabel: selectedModelMeta.label,
          size: selectedSize,
        },
        ...currentHistory,
      ]);
    } catch (requestError) {
      console.error("[HomeImageWorkbench] generation error", requestError);

      if ((requestError as DOMException)?.name === "AbortError") {
        setError(
          generatorConfig.imageGenerationTimeout ||
            "Image generation timed out. Please try again."
        );
      } else {
        setError(
          (requestError as Error)?.message || "Failed to generate image."
        );
      }
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      setIsGenerating(false);
    }
  }

  function handleDownload() {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "ai-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleOpenFullView() {
    if (!imageUrl) return;
    window.open(imageUrl, "_blank", "noopener,noreferrer");
  }

  function handleSurprisePrompt() {
    const randomPrompt =
      SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
    setPrompt(randomPrompt);
    setError(null);
  }

  const creditNote = (() => {
    if (isCheckingCredits || isFetchingCost) {
      return copy.noteCheckingCredits;
    }

    if (balanceError) {
      return balanceError;
    }

    if (creditsBalance !== null) {
      return `${copy.noteCredits}: ${creditsBalance} · ${copy.noteCost}: ${creditCost}`;
    }

    return copy.noteCreditsUnavailable;
  })();

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.10),_transparent_38%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <Badge
            variant="outline"
            className="mb-4 border-black/10 bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-black/70"
          >
            {copy.badge}
          </Badge>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-[#111111] sm:text-5xl lg:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-black/62 sm:text-lg">
            {copy.description}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <Card className="border-black/10 bg-white/88 shadow-[0_24px_80px_rgba(17,17,17,0.08)] backdrop-blur">
            <CardHeader className="border-b border-black/6 pb-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl text-[#111111]">
                    {copy.controlTitle}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm leading-6 text-black/55">
                    {copy.controlDescription}
                  </CardDescription>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#111111] text-white">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <form className="space-y-6" onSubmit={handleGenerate}>
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-[#111111]">
                      {copy.modelLabel}
                    </p>
                    <span className="text-xs text-black/45">
                      {configuredModels.filter((model) => model.configured).length} online
                    </span>
                  </div>
                  <div className="grid max-h-56 gap-2 overflow-y-auto pr-1">
                    {configuredModels.map((model) => {
                      const isSelected = model.value === selectedModel;
                      const isDisabled = !model.configured;

                      return (
                        <button
                          key={model.value}
                          type="button"
                          onClick={() => {
                            if (!isDisabled) {
                              setSelectedModel(model.value);
                              setError(null);
                            }
                          }}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                            isSelected
                              ? "border-[#111111] bg-[#111111] text-white"
                              : "border-black/10 bg-[#faf8f3] text-[#111111] hover:border-black/20"
                          } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          <span className="pr-3 text-sm font-medium">
                            {model.label}
                          </span>
                          {isSelected ? (
                            <Check className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <span className="text-xs text-black/40">
                              {isDisabled
                                ? generatorConfig.modelNotConfigured ||
                                  copy.modelNotConfigured
                                : "Ready"}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="prompt"
                    className="mb-3 block text-sm font-medium text-[#111111]"
                  >
                    {copy.promptLabel}
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    className="min-h-[170px] w-full resize-none rounded-[24px] border border-black/10 bg-[#faf8f3] px-4 py-4 text-sm leading-6 text-[#111111] outline-none transition placeholder:text-black/30 focus:border-black/25"
                    placeholder={copy.promptPlaceholder}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-black/10 bg-[#faf8f3] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium text-[#111111]">
                        {copy.sizeLabel}
                      </p>
                      <Layers3 className="h-4 w-4 text-black/35" />
                    </div>
                    <p className="mb-3 text-xs leading-5 text-black/45">
                      {copy.sizeDescription}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`rounded-full px-3 py-1.5 text-xs transition ${
                            size === selectedSize
                              ? "bg-[#111111] text-white"
                              : "bg-white text-black/65"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-black/10 bg-[#faf8f3] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium text-[#111111]">
                        {copy.outputLabel}
                      </p>
                      <Sparkles className="h-4 w-4 text-black/35" />
                    </div>
                    <div className="grid gap-2 text-sm text-black/62">
                      {copy.tips.map((tip) => (
                        <div
                          key={tip}
                          className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2"
                        >
                          <Check className="h-4 w-4 text-[#111111]" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[#faf8f3] px-4 py-3">
                  <p
                    className={`text-sm ${
                      balanceError || error ? "text-[#b42318]" : "text-black/62"
                    }`}
                  >
                    {creditNote}
                  </p>
                </div>

                {error && (
                  <div className="rounded-2xl border border-[#b42318]/20 bg-[#b42318]/8 px-4 py-3 text-sm text-[#b42318]">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="h-12 rounded-2xl bg-[#111111] text-white hover:bg-black/90"
                    icon={Wand2}
                    loading={isGenerating}
                    disabled={!canGenerate}
                  >
                    {isGenerating ? copy.generating : copy.generate}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-2xl border-black/10 bg-white hover:bg-black/5"
                    icon={Sparkles}
                    onClick={handleSurprisePrompt}
                    disabled={isGenerating}
                  >
                    {copy.surprise}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="overflow-hidden border-black/10 bg-[#111111] text-white shadow-[0_28px_90px_rgba(17,17,17,0.14)]">
              <CardContent className="grid gap-0 p-0 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                        {copy.resultEyebrow}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                        {copy.resultTitle}
                      </h2>
                      <p className="mt-3 max-w-xl text-sm leading-6 text-white/64">
                        {copy.resultDescription}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        {history.length || 0} variations
                      </div>
                      {imageUrl && (
                        <button
                          type="button"
                          onClick={handleDownload}
                          className="rounded-full border border-white/10 bg-white px-3 py-1 text-xs font-medium text-[#111111] transition hover:bg-white/90"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Download className="h-3.5 w-3.5" />
                            PNG
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_35%),linear-gradient(135deg,_#d6c7a8_0%,_#786a58_32%,_#202020_100%)]">
                    {isGenerating ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/30 backdrop-blur-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                        <p className="text-sm text-white/80">{copy.generating}</p>
                      </div>
                    ) : imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={prompt}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_45%)]" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10">
                          <ImageIcon className="h-7 w-7 text-white/80" />
                        </div>
                        <p className="max-w-md text-sm leading-6 text-white/70">
                          {copy.resultDescription}
                        </p>
                      </div>
                    )}

                    <div className="absolute left-6 top-6 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs backdrop-blur">
                      {copy.previewBadge}
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                      <div className="max-w-sm">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                          {copy.promptSnapshotLabel}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/82">
                          {prompt.trim() || copy.promptPlaceholder}
                        </p>
                      </div>
                      {imageUrl && (
                        <button
                          type="button"
                          onClick={handleOpenFullView}
                          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#111111] transition hover:bg-white/90"
                        >
                          {copy.openFullView}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <div className="grid gap-3">
                    {rightSideMetrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                          {metric.label}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-white/55" />
                      <p className="text-sm font-medium text-white">
                        {copy.historyTitle}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {history.length > 0 ? (
                        history.slice(0, 4).map((item, index) => (
                          <button
                            key={`${item.imageUrl}-${index}`}
                            type="button"
                            onClick={() => {
                              setImageUrl(item.imageUrl);
                              setPrompt(item.prompt);
                              setSelectedModel(item.modelValue);
                              setSelectedSize(item.size);
                              setError(null);
                            }}
                            className="flex w-full items-center gap-3 rounded-2xl bg-black/20 px-3 py-3 text-left transition hover:bg-black/30"
                          >
                            <div className="flex h-12 w-12 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,_#e7dcc5,_#6d6256,_#242424)]">
                              <img
                                src={item.imageUrl}
                                alt={item.prompt}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-white">
                                {item.modelLabel}
                              </p>
                              <p className="text-xs text-white/48">
                                V0{index + 1} · {item.size} · {copy.readyToUpscale}
                              </p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="rounded-2xl bg-black/20 px-3 py-4 text-sm text-white/55">
                          {copy.resultDescription}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-black/10 bg-white/80">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                    {copy.focusTitle}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-black/66">
                    {copy.focusDescription}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-black/10 bg-white/80">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                    {copy.systemTitle}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-black/66">
                    {copy.systemDescription}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-black/10 bg-white/80">
                <CardContent className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                    {copy.nextTitle}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-black/66">
                    {copy.nextDescription}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-3 rounded-[28px] border border-black/10 bg-white/72 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-[#111111]">
                  {copy.ctaTitle}
                </p>
                <p className="mt-1 text-sm text-black/55">{copy.ctaDescription}</p>
              </div>
              <Link
                href={`/${lang}/ai`}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-[#111111] px-6 text-sm font-medium text-white transition hover:bg-black/90"
              >
                <span className="inline-flex items-center gap-2">
                  {copy.ctaButton}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
