"use client"

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ImagePlus, Trash2 } from 'lucide-react'

interface InputImagePanelProps {
  imagePreviewUrl: string | null
  onFileChange: (file: File | null) => void
  label: string
  hint: string
  uploadText: string
  replaceText: string
  removeText: string
}

export function InputImagePanel({
  imagePreviewUrl,
  onFileChange,
  label,
  hint,
  uploadText,
  replaceText,
  removeText,
}: InputImagePanelProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    onFileChange(file)
  }

  const openPicker = () => {
    inputRef.current?.click()
  }

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onFileChange(null)
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
        {imagePreviewUrl ? (
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" variant="outline" onClick={openPicker}>
              <ImagePlus className="mr-2 h-4 w-4" />
              {replaceText}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={handleRemove}>
              <Trash2 className="mr-2 h-4 w-4" />
              {removeText}
            </Button>
          </div>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />

      {imagePreviewUrl ? (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-muted/20">
          <img src={imagePreviewUrl} alt="Reference" className="h-48 w-full object-cover" />
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          className="flex h-48 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center transition-colors hover:border-primary/60 hover:bg-primary/5"
        >
          <ImagePlus className="mb-3 h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{uploadText}</span>
          <span className="mt-2 max-w-sm text-xs text-muted-foreground">{hint}</span>
        </button>
      )}
    </div>
  )
}
