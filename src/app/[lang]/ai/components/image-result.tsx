"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Download, Image as ImageIcon } from 'lucide-react'
import { ImageLoading } from './image-loading'

interface ExampleImage {
  imageUrl: string
  alt: string
  prompt: string
}

interface ImageResultProps {
  imageUrl: string | null
  prompt: string
  resultTitle: string
  emptyStateDescription: string
  downloadText: string
  onDownload: () => void
  isGenerating?: boolean
  hasError?: boolean
  exampleImages?: ExampleImage[]
}

export function ImageResult({
  imageUrl,
  prompt,
  resultTitle,
  emptyStateDescription,
  downloadText,
  onDownload,
  isGenerating = false,
  hasError = false,
  exampleImages = [],
}: ImageResultProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const hasExamples = exampleImages.length > 0

  useEffect(() => {
    if (imageUrl || exampleImages.length <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) =>
        current === exampleImages.length - 1 ? 0 : current + 1
      )
    }, 3600)

    return () => window.clearInterval(timer)
  }, [exampleImages.length, imageUrl])

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? exampleImages.length - 1 : current - 1
    )
  }

  const showNext = () => {
    setActiveIndex((current) =>
      current === exampleImages.length - 1 ? 0 : current + 1
    )
  }

  return (
    <div className="flex h-full min-h-[420px] flex-col p-6 lg:min-h-0">
      <div className="mb-4 flex items-center justify-between h-6 flex-shrink-0">
        <p className="text-sm font-medium text-foreground leading-6">
          {resultTitle}
        </p>
        {imageUrl && (
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={onDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            {downloadText}
          </Button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-[24px] border border-border/70">
        {isGenerating ? (
          <ImageLoading />
        ) : imageUrl ? (
          <div className="w-full h-full overflow-hidden">
            <img
              src={imageUrl}
              alt={prompt}
              className="w-full h-full object-cover"
            />
          </div>
        ) : hasExamples ? (
          <div className="relative h-full w-full bg-muted/10">
            <img
              src={exampleImages[activeIndex].imageUrl}
              alt={exampleImages[activeIndex].alt}
              className="h-full w-full object-cover transition-opacity duration-500"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 text-white">
              <p className="text-sm font-medium">{exampleImages[activeIndex].alt}</p>
              <div className="mt-3 rounded-xl border border-white/15 bg-black/30 p-3 backdrop-blur-sm">
                <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-white/60">Prompt</p>
                <p className="text-sm leading-6 text-white/92">{exampleImages[activeIndex].prompt}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {exampleImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        index === activeIndex ? 'bg-white' : 'bg-white/45'
                      }`}
                      aria-label={`Go to example ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white/90 text-black hover:bg-white"
                    onClick={showPrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white/90 text-black hover:bg-white"
                    onClick={showNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-center p-4 ${hasError ? 'text-destructive' : 'text-muted-foreground'}`}>
            <div>
              <ImageIcon className="mx-auto mb-4 h-12 w-12" />
              {!hasError && <p className="text-sm">{emptyStateDescription}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

