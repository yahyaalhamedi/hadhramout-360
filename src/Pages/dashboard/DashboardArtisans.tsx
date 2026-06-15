import { Hammer } from 'lucide-react'
import {
  useArtisans,
  useArtisan,
  useCreateArtisanWithMedia,
  useUpdateArtisan,
  useDeleteArtisan,
  useAddArtisanMedia,
  useDeleteArtisanMedia,
  useReplaceArtisanMedia,
} from '@/api/artisans/useArtisans'
import type { ArtisanResponseDto, ArtisanDetailsDto } from '@/api/artisans/useArtisans.types'
import DashboardCrudPage from '@/components/atoms/DashboardCrudPage'
import type { FormRenderProps } from '@/components/atoms/DashboardCrudPage'
import ArtisanFormFields from '@/components/atoms/ArtisanFormFields'
import type { ArtisanFormData } from '@/components/atoms/ArtisanFormFields'
import { emptyArtisanForm } from '@/components/atoms/formDefaults'

function detailToArtisanForm(detail: ArtisanDetailsDto): ArtisanFormData {
  return {
    nameAr: detail.nameAr ?? '',
    nameEn: detail.nameEn ?? '',
    phone: detail.phone ?? '',
    descriptionAr: detail.descriptionAr ?? '',
    descriptionEn: detail.descriptionEn ?? '',
    locationTextAr: detail.locationTextAr ?? '',
    locationTextEn: detail.locationTextEn ?? '',
    mapUrl: detail.mapUrl ?? '',
  }
}

function validateArtisanForm(form: ArtisanFormData): boolean {
  return !!(form.nameAr && form.nameEn && form.phone && form.descriptionAr && form.descriptionEn)
}

export default function DashboardArtisans() {
  return (
    <DashboardCrudPage<ArtisanResponseDto, ArtisanDetailsDto, ArtisanFormData>
      titleKey="dashboard.artisans.title"
      searchPlaceholderKey="dashboard.artisans.search"
      noResultsKey="dashboard.artisans.no_results"
      untitledKey="dashboard.artisans.untitled"
      deleteConfirmKey="dashboard.artisans.delete_confirm"
      newButtonKey="dashboard.artisans.new"
      formTitleKey="dashboard.artisans.create"
      formEditTitleKey="dashboard.artisans.edit"
      modalIcon={<Hammer className="h-5 w-5 text-[#0a5c66]" />}
      noImageKey="dashboard.artisans.no_img"
      useList={useArtisans}
      useDetail={useArtisan}
      useCreate={useCreateArtisanWithMedia}
      useUpdate={useUpdateArtisan}
      useDelete={useDeleteArtisan}
      useAddMedia={useAddArtisanMedia}
      useDeleteMedia={useDeleteArtisanMedia}
      useReplaceMedia={useReplaceArtisanMedia}
      getListItemId={(a) => a.artisanId}
      getListItemTitle={(a) => a.nameEn || a.nameAr || ''}
      getListItemImage={(a) => a.coverImageUrl}
      emptyForm={emptyArtisanForm}
      validateForm={validateArtisanForm}
      detailToForm={detailToArtisanForm}
      buildCreatePayload={(form, coverFile, mediaFiles) => ({
        ...form,
        files: coverFile ? [coverFile, ...mediaFiles] : mediaFiles,
      })}
      buildUpdatePayload={(id, form) => ({ id, ...form })}
      getExistingMedia={(detail) => detail.media}
      renderForm={(props: FormRenderProps<ArtisanFormData>) => (
        <ArtisanFormFields {...props} />
      )}
    />
  )
}
