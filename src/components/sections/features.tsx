"use client"

import { usePathname } from "next/navigation"
import { SectionLayout } from "@/components/layout/section-layout"
import { FeaturesGrid } from "@/components/ui/features-grid"

interface FeaturesProps {
  dict?: {
    features: {
      title?: string
      description?: string
      main: {
        icon: string
        title: string
        description: string
      }[]
    }
  }
}

export function Features({ dict }: FeaturesProps) {
  const features = dict?.features.main || []
  const pathname = usePathname()
  const currentLang = pathname.split("/")[1] || "en"

  return (
    <SectionLayout
      id="features"
      title={dict?.features?.title}
      description={dict?.features?.description}
      locale={currentLang}
      background="muted"
    >
      <FeaturesGrid features={features} />
    </SectionLayout>
  )
}
