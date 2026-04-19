import { Check } from 'lucide-react'
import { ShowcaseItem } from './ai-content'

interface FeatureShowcaseProps {
  badge: string
  title: string
  description: string
  items: ShowcaseItem[]
}

export function FeatureShowcase({
  badge,
  title,
  description,
  items,
}: FeatureShowcaseProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
            {badge}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
        </div>

        <div className="space-y-8 lg:space-y-10">
          {items.map((item, index) => {
            const reverse = index % 2 === 1

            return (
              <article
                key={`${item.eyebrow}-${item.title}`}
                className="overflow-hidden rounded-[32px] border border-border/60 bg-card shadow-[0_24px_90px_rgba(15,23,42,0.06)]"
              >
                <div className={`grid gap-0 lg:grid-cols-2 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <div className="relative min-h-[320px] bg-muted/20">
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/75">
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="mt-6 grid gap-3">
                      {item.bullets.map((bullet) => (
                        <div
                          key={bullet}
                          className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3"
                        >
                          <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          <p className="text-sm leading-6 text-foreground/88">{bullet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
