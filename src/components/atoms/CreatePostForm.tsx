import { useState, useRef } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useCreatePost } from '@/api/community/useCommunityPosts'
import { baseURL } from '@/api/axiosInstance'

interface CreatePostFormProps {
  userName: string
  userAvatar: string | null
  onPostCreated?: () => void
}

export default function CreatePostForm({
  userName,
  userAvatar,
  onPostCreated,
}: CreatePostFormProps) {
  const { t } = useTranslation()
  const [contentText, setContentText] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: createPost, isPending } = useCreatePost()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newFiles = [...selectedFiles, ...files].slice(0, 5)
    setSelectedFiles(newFiles)

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
    previews.forEach((url) => URL.revokeObjectURL(url))
    setPreviews(newPreviews)

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index])
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    setPreviews(newPreviews)
  }

  const handleSubmit = () => {
    if (!contentText.trim() && selectedFiles.length === 0) return

    createPost(
      { contentText: contentText.trim(), files: selectedFiles },
      {
        onSuccess: () => {
          setContentText('')
          setSelectedFiles([])
          previews.forEach((url) => URL.revokeObjectURL(url))
          setPreviews([])
          onPostCreated?.()
        },
      },
    )
  }

  const handleCancel = () => {
    setContentText('')
    setSelectedFiles([])
    previews.forEach((url) => URL.revokeObjectURL(url))
    setPreviews([])
  }

  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm border border-tertiary-1">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <img
          src={userAvatar ? `${baseURL}${userAvatar}` : '/profile.png'}
          alt={userName}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <p className="text-xs text-muted-foreground">{t('community.hi')}</p>
          <p className="font-bold text-tertiary-8">{userName}</p>
        </div>
      </div>

      {/* Post Content Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-7">
            {t('community.post_content')}
          </h3>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-primary-7 hover:text-primary-8 transition-colors cursor-pointer"
          >
            <ImagePlus className="h-6 w-6" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {previews.map((preview, i) => (
              <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input */}
        <textarea
          value={contentText}
          onChange={(e) => setContentText(e.target.value)}
          placeholder={t('community.placeholder')}
          className="w-full min-h-[100px] rounded-[16px] border border-tertiary-2 bg-tertiary-0 px-4 py-3 text-sm text-tertiary-8 placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary-6"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleCancel}
          className="text-sm font-semibold text-muted-foreground hover:text-tertiary-8 transition-colors cursor-pointer"
        >
          {t('label.cancel')}
        </button>
        <Button
          onClick={handleSubmit}
          disabled={isPending || (!contentText.trim() && selectedFiles.length === 0)}
          className="rounded-full bg-primary-7 px-8 text-white hover:bg-primary-8 cursor-pointer"
        >
          {isPending ? t('community.posting') : t('community.publish')}
        </Button>
      </div>
    </div>
  )
}
