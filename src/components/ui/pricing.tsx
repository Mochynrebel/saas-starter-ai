"use client"

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ProcessedPricing } from '@/types/pricing'

type BillingCycle = 'month' | 'year'

interface PricingProps {
  pricingData?: ProcessedPricing[]
  lang?: string
  dict?: {
    pricing: {
      mostPopular?: string
      monthlyBilling?: string
      annualBilling?: string
      discount?: string
      plans: {
        name: string
        description: string
        period: string
        prices?: {
          month: string
          year: string
        }
        periods?: {
          month: string
          year: string
        }
        notes?: {
          month?: string
          year?: string
        }
        popular: boolean
        features: string[]
        buttonText: string
        limitations?: string[]
      }[]
      comparison?: {
        planPricing?: {
          starter?: string
          professional?: string
          enterprise?: string
        }
      }
    }
    common?: {
      pricing?: {
        perMonth?: string
        perYear?: string
      }
      buttons?: {
        contactSales?: string
        getStarted?: string
      }
    }
  }
}

interface DisplayPlan {
  id: string
  name: string
  description: string
  features: string[]
  limitations: string[]
  buttonText: string
  popular: boolean
  priceText: string
  subtitle: string
  noteText?: string
  badgeText?: string
  href: string
  isExternalCheckout: boolean
}

const comparisonPriceOrder = ['starter', 'professional', 'enterprise'] as const

const currencyPrefixes: Record<string, string> = {
  usd: '$',
  cny: 'CNY ',
  eur: 'EUR ',
  gbp: 'GBP ',
}

const formatPrice = (price: number, currency: string) => {
  const prefix = currencyPrefixes[currency.toLowerCase()] || '$'
  return `${prefix}${Number.isInteger(price) ? price : price.toFixed(2)}`
}

export function Pricing({ pricingData, dict, lang = 'en' }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('month')
  const comparisonPricing = dict?.pricing.comparison?.planPricing
  const isZh = lang === 'zh'

  const displayPlans: DisplayPlan[] = pricingData && pricingData.length > 0
    ? pricingData.map((plan) => {
        const selectedPrice = plan.prices[billingCycle] || plan.prices.month || plan.prices.year
        const monthlyPrice = plan.prices.month
        const yearlyPrice = plan.prices.year
        const savePercent =
          monthlyPrice && yearlyPrice && monthlyPrice.price > 0
            ? Math.max(0, Math.round((1 - yearlyPrice.price / (monthlyPrice.price * 12)) * 100))
            : 0

        return {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          features: plan.features,
          limitations: [],
          buttonText: plan.buttonText,
          popular: Boolean(plan.popular || plan.highlight),
          priceText: selectedPrice ? formatPrice(selectedPrice.price, plan.currency) : 'Custom',
          subtitle:
            selectedPrice?.interval === 'year'
              ? dict?.common?.pricing?.perYear || 'per year'
              : dict?.common?.pricing?.perMonth || 'per month',
          noteText:
            selectedPrice?.interval === 'year' && yearlyPrice
              ? `${formatPrice(yearlyPrice.price, plan.currency)} ${dict?.common?.pricing?.perYear || 'per year'}`
              : undefined,
          badgeText: billingCycle === 'year' && savePercent > 0 ? `Save ${savePercent}%` : undefined,
          href: selectedPrice
            ? `/api/checkout?plan=${encodeURIComponent(plan.name)}&price=${selectedPrice.priceId}&lang=${lang}`
            : `/${lang}/signup`,
          isExternalCheckout: Boolean(selectedPrice),
        }
      })
    : (dict?.pricing.plans || []).map((plan, index) => {
        const pricingKey = comparisonPriceOrder[index]
        const fallbackPriceLabel = pricingKey ? comparisonPricing?.[pricingKey] : undefined
        const isEnterprise = index === 2
        const selectedPrice =
          plan.prices?.[billingCycle] ||
          fallbackPriceLabel ||
          (isEnterprise ? (isZh ? '定制' : 'Custom') : (isZh ? '灵活计费' : 'Flexible'))
        const selectedPeriod = plan.periods?.[billingCycle] || plan.period
        const selectedNote = plan.notes?.[billingCycle]

        return {
          id: `${plan.name}-${index}`,
          name: plan.name,
          description: plan.description,
          features: plan.features,
          limitations: plan.limitations || [],
          buttonText:
            plan.buttonText ||
            (isEnterprise
              ? dict?.common?.buttons?.contactSales || (isZh ? '联系销售' : 'Contact Sales')
              : dict?.common?.buttons?.getStarted || (isZh ? '立即开始' : 'Get Started')),
          popular: plan.popular,
          priceText: selectedPrice,
          subtitle: selectedPeriod,
          noteText: selectedNote,
          badgeText: plan.popular ? dict?.pricing.discount : undefined,
          href: `/${lang}/signup`,
          isExternalCheckout: false,
        }
      })

  return (
    <section className="px-4 pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[32px] border border-border/60 bg-gradient-to-b from-background via-background to-muted/30 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:p-8">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary/80">
                {isZh ? '价格方案' : 'Pricing Plans'}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {isZh ? '选择适合你产出规模的套餐。' : 'Choose a plan that fits your output volume.'}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                {isZh
                  ? '支持月付和年付两种计费方式，切换后会同步更新套餐价格和说明。'
                  : 'Switch between monthly and annual billing to compare plan pricing instantly.'}
              </p>
            </div>

            <div className="inline-flex w-fit items-center rounded-full border border-border bg-muted/60 p-1">
              <button
                type="button"
                onClick={() => setBillingCycle('month')}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  billingCycle === 'month'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {dict?.pricing.monthlyBilling || 'Monthly billing'}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('year')}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  billingCycle === 'year'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {dict?.pricing.annualBilling || 'Annual billing'}
              </button>
              {(dict?.pricing.discount || pricingData?.some((plan) => plan.prices.year)) && (
                <span className="ml-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {dict?.pricing.discount || (isZh ? '年付更划算' : 'Save more yearly')}
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {displayPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden rounded-[28px] border transition-transform duration-200 ${
                  plan.popular
                    ? 'border-primary/40 bg-primary/[0.04] shadow-[0_24px_50px_rgba(217,119,6,0.12)]'
                    : 'border-border/70 bg-background/95 hover:-translate-y-1'
                }`}
              >
                <CardContent className="flex h-full flex-col p-6 md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{plan.name}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{plan.description}</p>
                    </div>
                    {plan.popular ? (
                      <Badge className="rounded-full bg-primary px-3 py-1 text-primary-foreground">
                        {dict?.pricing.mostPopular || 'Most Popular'}
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mt-8 flex items-end gap-3">
                    <div className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                      {plan.priceText}
                    </div>
                    <div className="pb-1 text-sm text-muted-foreground">{plan.subtitle}</div>
                  </div>

                  {plan.noteText ? (
                    <p className="mt-2 text-sm text-muted-foreground">{plan.noteText}</p>
                  ) : null}

                  {plan.badgeText ? (
                    <div className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                      {plan.badgeText}
                    </div>
                  ) : null}

                  <div className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 text-sm leading-6 text-foreground">
                        <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-border/70 bg-muted/30 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {isZh ? '暂不包含' : 'Not included'}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {plan.limitations.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-8">
                    <Link
                      href={plan.href}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        plan.popular
                          ? 'btn-gradient bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'border border-input bg-background text-primary hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {plan.buttonText}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    {plan.isExternalCheckout
                      ? (isZh
                        ? '使用安全的 Stripe 结账流程，未登录时会自动跳转登录。'
                        : 'Secure Stripe checkout. Sign-in redirect handled automatically.')
                      : (isZh
                        ? '当前还没有配置在线价格，可继续前往注册页。'
                        : 'No live price is configured yet. Continue through signup.')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-4 rounded-[24px] border border-border/60 bg-background/70 p-5 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{isZh ? '开通方式' : 'Activation'}</p>
              <p className="mt-2 text-sm text-foreground">
                {isZh ? '只要 Stripe 价格可用，点击套餐就会直接进入结账流程。' : 'Checkout opens immediately when Stripe prices are available.'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{isZh ? '兜底逻辑' : 'Fallback'}</p>
              <p className="mt-2 text-sm text-foreground">
                {isZh ? '即使价格数据缺失，页面也依然会把用户引导到注册页。' : 'If pricing data is missing, the page still routes users to signup.'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{isZh ? '计费维度' : 'Billing'}</p>
              <p className="mt-2 text-sm text-foreground">
                {isZh ? '同一个产品现在可以同时展示月付和年付价格。' : 'Monthly and yearly pricing can now be surfaced from the same product.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
