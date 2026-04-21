"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, LoaderCircle } from "lucide-react";

interface ExampleImage {
  imageUrl: string;
  alt: string;
  prompt: string;
}

interface HomeImageWorkbenchProps {
  locale: string;
  title: string;
  description: string;
  examples: ExampleImage[];
}

type DemoPhase = "typing" | "generating" | "result";

const HOME_COPY = {
  en: {
    promptPlaceholder: "A realistic product ad with cinematic lighting...",
    generating: "Generating...",
    cta: "Try for Free",
  },
  zh: {
    promptPlaceholder: "一张带有电影级光影的真实产品广告图……",
    generating: "Generating...",
    cta: "Try for Free",
  },
} as const;

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export function HomeImageWorkbench({
  locale,
  title,
  description,
  examples,
}: HomeImageWorkbenchProps) {
  const copy = locale === "zh" ? HOME_COPY.zh : HOME_COPY.en;
  const safeExamples = useMemo(() => (examples.length > 0 ? examples : []), [examples]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState("");
  const [phase, setPhase] = useState<DemoPhase>("typing");
  const [revealedIndex, setRevealedIndex] = useState(0);
  const titleParts = useMemo(() => {
    const marker = "GPT Image 2";
    const index = title.indexOf(marker);
    if (index === -1) {
      return { before: title, highlight: "", after: "" };
    }
    return {
      before: title.slice(0, index),
      highlight: marker,
      after: title.slice(index + marker.length),
    };
  }, [title]);

  useEffect(() => {
    if (safeExamples.length === 0) {
      return;
    }

    let cancelled = false;

    const runDemo = async () => {
      const example = safeExamples[activeIndex];
      setTypedPrompt("");
      setPhase("typing");
      const typingDuration = 5000;
      const stepDelay = Math.max(40, Math.floor(typingDuration / Math.max(example.prompt.length, 1)));

      for (let i = 1; i <= example.prompt.length; i += 1) {
        if (cancelled) return;
        setTypedPrompt(example.prompt.slice(0, i));
        await wait(stepDelay);
      }

      if (cancelled) return;
      setPhase("generating");
      await wait(3000);

      if (cancelled) return;
      setRevealedIndex(activeIndex);
      setPhase("result");
      await wait(5000);

      if (cancelled) return;
      setActiveIndex((current) => (current + 1) % safeExamples.length);
    };

    runDemo();

    return () => {
      cancelled = true;
    };
  }, [activeIndex, safeExamples]);

  if (safeExamples.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden px-4 pb-18 pt-20 sm:px-6 lg:px-8 lg:pb-24 lg:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),radial-gradient(circle_at_85%_20%,_rgba(251,191,36,0.14),_transparent_22%),linear-gradient(180deg,_rgba(248,250,252,1),_rgba(255,255,255,1))]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:items-center lg:gap-12">
          <div className="max-w-[560px] text-left">
            <h1 className="max-w-[560px] text-4xl font-semibold tracking-[-0.05em] text-foreground leading-[1.14] sm:text-5xl sm:leading-[1.12] lg:text-[3.9rem] lg:leading-[1.1]">
              {titleParts.before ? <span className="block">{titleParts.before.trimEnd()}</span> : null}
              {titleParts.highlight ? (
                <span className="block bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 bg-clip-text font-serif italic leading-[1.02] text-transparent">
                  {titleParts.highlight}
                </span>
              ) : null}
              {titleParts.after ? <span className="block">{titleParts.after.trimStart()}</span> : null}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
              {description}
            </p>
            <div className="mt-10">
              <Link
                href={locale === "zh" ? "/zh/ai" : "/ai"}
                className="inline-flex min-w-[168px] items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                <span>{copy.cta}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="ml-auto flex w-full max-w-[540px] flex-col gap-4">
            <div className="rounded-[28px] border border-border/70 bg-card/95 p-4 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="min-h-[96px] rounded-[22px] border border-border/60 bg-background px-5 py-4 shadow-inner">
                <p className="text-lg leading-8 text-foreground">
                  {typedPrompt || copy.promptPlaceholder}
                  <span className="ml-1 inline-block h-5 w-[2px] animate-pulse bg-primary align-middle" />
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-border/70 bg-card/95 p-4 shadow-[0_24px_90px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="relative aspect-[4/3] min-h-[320px] overflow-hidden rounded-[24px] border border-border/70 bg-muted/10 sm:min-h-[360px]">
                {phase === "generating" ? (
                  <div className="flex h-full min-h-[320px] items-center justify-center bg-background/85 sm:min-h-[360px]">
                    <div className="flex items-center gap-3 rounded-full border border-border/70 bg-card px-5 py-3 text-base font-medium text-foreground shadow-sm">
                      <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
                      <span>{copy.generating}</span>
                    </div>
                  </div>
                ) : phase === "result" ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={safeExamples[revealedIndex].imageUrl}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.04, filter: "blur(16px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <img
                        src={safeExamples[revealedIndex].imageUrl}
                        alt={safeExamples[revealedIndex].alt}
                        className="h-full w-full object-contain"
                      />
                    </motion.div>
                  </AnimatePresence>
                ) : <div className="flex h-full min-h-[320px] items-center justify-center bg-background/65 sm:min-h-[360px]" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
