import { createServerClient, hasSupabaseAdminConfig } from './supabase'
import { SupabaseProduct, ProcessedPricing } from '@/types/pricing'
import { getDictionary } from './dictionaries'
import { Locale } from './i18n'

type BillingInterval = 'month' | 'year'

const isBillingInterval = (interval: string | null | undefined): interval is BillingInterval =>
  interval === 'month' || interval === 'year'

const getOriginalPrice = (metadata: Record<string, any> | undefined, interval: BillingInterval) => {
  const intervalKey = interval === 'year' ? 'originalPriceYearly' : 'originalPriceMonthly'
  const rawValue = metadata?.[intervalKey] ?? metadata?.originalPrice
  const parsedValue = Number(rawValue)
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined
}

export async function getPricingData(locale: Locale = 'en'): Promise<ProcessedPricing[]> {
  try {
    if (!hasSupabaseAdminConfig()) {
      console.warn('Skipping pricing fetch because Supabase admin configuration is missing.')
      return []
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('products')
      .select('*, prices(*)')
      .eq('active', true)
      .eq('prices.active', true)

    if (error) {
      console.error('Failed to fetch pricing data:', error)
      return []
    }

    const dict = await getDictionary(locale)
    const pricingDict = dict.pricing

    const groupedProducts = (data ?? [])
      .map((item: SupabaseProduct) => {
        const prices = (item.prices ?? []).reduce<ProcessedPricing['prices']>((acc, price) => {
          if (!price.active || !isBillingInterval(price.interval)) {
            return acc
          }

          acc[price.interval] = {
            price: price.unit_amount ? price.unit_amount / 100 : 0,
            priceId: price.id,
            interval: price.interval,
            originalPrice: getOriginalPrice(item.metadata, price.interval),
          }

          return acc
        }, {})

        const monthlyBasePrice = prices.month?.price ?? (prices.year ? prices.year.price / 12 : Number.POSITIVE_INFINITY)

        return { item, prices, monthlyBasePrice }
      })
      .filter(({ prices }) => Boolean(prices.month || prices.year))
      .sort((a, b) => a.monthlyBasePrice - b.monthlyBasePrice)

    return groupedProducts.map(({ item, prices }, index) => {
      const planData = pricingDict.plans[index] || pricingDict.plans[0]
      const firstPrice = prices.month || prices.year

      return {
        id: item.id,
        name: planData?.name || item.name,
        description: planData?.description || item.description,
        image: item.image,
        features: planData?.features || item.marketing_features?.map((feature) => feature.name) || [],
        buttonText: planData?.buttonText || pricingDict.plans[0]?.buttonText || 'Get Started',
        highlight: item.metadata?.highlight || planData?.popular || false,
        currency: firstPrice?.priceId ? item.prices.find((price) => price.id === firstPrice.priceId)?.currency || 'usd' : 'usd',
        popular: planData?.popular || false,
        prices,
      }
    })
  } catch (error) {
    console.error('Failed to process pricing data:', error)
    return []
  }
}
