import { MapPin } from 'lucide-react'
import {
  useLandmarks,
  useLandmark,
  useCreateLandmarkWithMedia,
  useUpdateLandmark,
  useDeleteLandmark,
  useAddLandmarkMedia,
  useDeleteLandmarkMedia,
  useReplaceLandmarkMedia,
} from '@/api/landmarks/useLandmarks'
import type { LandmarkResponseDto, LandmarkDetailsDto } from '@/api/landmarks/useLandmarks.types'
import DashboardCrudPage from '@/components/atoms/DashboardCrudPage'
import type { FormRenderProps } from '@/components/atoms/DashboardCrudPage'
import LandmarkFormFields from '@/components/atoms/LandmarkFormFields'
import type { LandmarkFormData } from '@/components/atoms/LandmarkFormFields'
import { emptyLandmarkForm } from '@/components/atoms/formDefaults'

function detailToLandmarkForm(detail: LandmarkDetailsDto): LandmarkFormData {
  return {
    titleAr: detail.titleAr ?? '',
    titleEn: detail.titleEn ?? '',
    descriptionAr: detail.descriptionAr ?? '',
    descriptionEn: detail.descriptionEn ?? '',
    locationTextAr: detail.locationTextAr ?? '',
    locationTextEn: detail.locationTextEn ?? '',
    mapUrl: detail.mapUrl ?? '',
    categoryIds: detail.categories?.map((c) => c.categoryId) ?? [],
  }
}

function validateLandmarkForm(form: LandmarkFormData): boolean {
  return !!(form.titleAr && form.titleEn && form.descriptionAr && form.descriptionEn && form.mapUrl)
}

export default function DashboardLandmarks() {
  return (
    <DashboardCrudPage<LandmarkResponseDto, LandmarkDetailsDto, LandmarkFormData>
      titleKey="dashboard.landmarks.title"
      searchPlaceholderKey="dashboard.landmarks.search"
      noResultsKey="dashboard.landmarks.no_results"
      untitledKey="dashboard.landmarks.untitled"
      deleteConfirmKey="dashboard.landmarks.delete_confirm"
      newButtonKey="dashboard.landmarks.new"
      formTitleKey="dashboard.landmarks.create"
      formEditTitleKey="dashboard.landmarks.edit"
      modalIcon={<MapPin className="h-5 w-5 text-[#0a5c66]" />}
      noImageKey="dashboard.landmarks.no_img"
      useList={useLandmarks}
      useDetail={useLandmark}
      useCreate={useCreateLandmarkWithMedia}
      useUpdate={useUpdateLandmark}
      useDelete={useDeleteLandmark}
      useAddMedia={useAddLandmarkMedia}
      useDeleteMedia={useDeleteLandmarkMedia}
      useReplaceMedia={useReplaceLandmarkMedia}
      getListItemId={(lm) => lm.landmarkId}
      getListItemTitle={(lm) => lm.titleEn || lm.titleAr || ''}
      getListItemImage={(lm) => lm.coverMediaUrl}
      renderListItemContent={(lm) => (
        <div className="flex gap-1.5 mt-1 flex-wrap">
          {lm.categories?.map((c) => (
            <span key={c.categoryId} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
              {c.categoryNameEn || c.categoryNameAr}
            </span>
          ))}
        </div>
      )}
      emptyForm={emptyLandmarkForm}
      validateForm={validateLandmarkForm}
      detailToForm={detailToLandmarkForm}
      buildCreatePayload={(form, coverFile, mediaFiles) => ({
        ...form,
        files: coverFile ? [coverFile, ...mediaFiles] : mediaFiles,
      })}
      buildUpdatePayload={(id, form) => ({ id, ...form })}
      getExistingMedia={(detail) => detail.media}
      renderForm={(props: FormRenderProps<LandmarkFormData>) => (
        <LandmarkFormFields {...props} />
      )}
    />
  )
}
