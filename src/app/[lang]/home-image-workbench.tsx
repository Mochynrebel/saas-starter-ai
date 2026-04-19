"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ImageIcon, Sparkles, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface HomeImageWorkbenchCopy {
  badge: string;
  title: string;
  description: string;
  promptLabel: string;
  promptPlaceholder: string;
  promptHint: string;
  promptChips: string[];
  stepsTitle: string;
  steps: Array<{ title: string; description: string }>;
  examplesEyebrow: string;
  examplesTitle: string;
  examplesDescription: string;
  examplePromptLabel: string;
  examplePrompt: string;
  examples: Array<{ title: string; tag: string; image: string }>;
  primaryCta: string;
  secondaryCta: string;
  footerTitle: string;
  footerDescription: string;
}

interface HomeImageWorkbenchProps {
  lang: string;
  copy: HomeImageWorkbenchCopy;
}

export function HomeImageWorkbench({
  lang,
  copy,
}: HomeImageWorkbenchProps) {
  return (
    <section className="relative overflow-hidden bg-[#f5f3ee] px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-24 lg:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(217,119,6,0.18),_transparent_26%),radial-gradient(circle_at_90%_15%,_rgba(15,23,42,0.08),_transparent_22%),linear-gradient(180deg,_rgba(255,255,255,0.6),_rgba(245,243,238,1))]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <Badge
            variant="outline"
            className="mb-4 border-black/10 bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-black/70"
          >
            {copy.badge}
          </Badge>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-[#111111] sm:text-5xl lg:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-black/62 sm:text-lg">
            {copy.description}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
          <Card className="border-black/10 bg-white/86 shadow-[0_28px_90px_rgba(17,17,17,0.08)] backdrop-blur">
            <CardContent className="p-6 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-white">
                  <Wand2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111111]">
                    {copy.promptLabel}
                  </p>
                  <p className="text-sm text-black/55">{copy.promptHint}</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-black/10 bg-[#faf8f3] p-5 shadow-inner">
                <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-black/45">
                  <Sparkles className="h-3.5 w-3.5" />
                  Prompt
                </div>
                <p className="min-h-[180px] text-base leading-8 text-[#111111] sm:text-lg">
                  {copy.promptPlaceholder}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {copy.promptChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-black/10 bg-[#faf8f3] px-3 py-1.5 text-xs text-black/60"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link href={`/${lang}/ai`} className="block">
                  <Button
                    size="lg"
                    className="h-12 w-full rounded-2xl bg-[#111111] text-white hover:bg-black/90"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    {copy.primaryCta}
                  </Button>
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 bg-[#faf8f3] px-6 text-sm font-medium text-[#111111] transition hover:bg-black/5"
                >
                  {copy.secondaryCta}
                </a>
              </div>

              <div id="how-it-works" className="mt-8 rounded-[28px] border border-black/10 bg-[#faf8f3] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#111111]" />
                  <p className="text-sm font-semibold text-[#111111]">
                    {copy.stepsTitle}
                  </p>
                </div>
                <div className="grid gap-3">
                  {copy.steps.map((step, index) => (
                    <div
                      key={step.title}
                      className="rounded-2xl border border-black/8 bg-white px-4 py-4"
                    >
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#111111] text-xs font-semibold text-white">
                          {index + 1}
                        </div>
                        <p className="text-sm font-semibold text-[#111111]">
                          {step.title}
                        </p>
                      </div>
                      <p className="text-sm leading-6 text-black/60">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="overflow-hidden border-black/10 bg-[#111111] text-white shadow-[0_28px_90px_rgba(17,17,17,0.14)]">
              <CardContent className="p-6 sm:p-7">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                      {copy.examplesEyebrow}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                      {copy.examplesTitle}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68">
                      {copy.examplesDescription}
                    </p>
                  </div>
                  <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 sm:flex">
                    <ImageIcon className="h-5 w-5 text-white/80" />
                  </div>
                </div>

                <div className="mb-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    {copy.examplePromptLabel}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/85">
                    {copy.examplePrompt}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {copy.examples.map((example, index) => (
                    <div
                      key={example.title}
                      className={`overflow-hidden rounded-[28px] border border-white/10 bg-white/5 ${
                        index === 0 ? "md:col-span-2" : ""
                      }`}
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={example.image}
                          alt={example.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.64),transparent_55%)]" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <span className="inline-flex rounded-full border border-white/12 bg-black/30 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/70">
                            {example.tag}
                          </span>
                          <p className="mt-2 text-sm font-medium text-white">
                            {example.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-3">
              {copy.steps.map((step, index) => (
                <Card key={`${step.title}-summary`} className="border-black/10 bg-white/78">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-black/40">
                      Step {index + 1}
                    </p>
                    <p className="mt-2 text-base font-semibold text-[#111111]">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-black/62">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="rounded-[28px] border border-black/10 bg-white/74 p-5">
              <p className="text-sm font-semibold text-[#111111]">
                {copy.footerTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-black/60">
                {copy.footerDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
