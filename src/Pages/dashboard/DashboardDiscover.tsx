import { BookOpen } from 'lucide-react'
import {
  useDiscoverContent,
  useDiscoverContentById,
  useCreateDiscoverContent,
  useUpdateDiscoverContent,
  useDeleteDiscoverContent,
} from '@/api/discover/useDiscoverContent'
import type { DiscoverContentResponseDto, DiscoverContentDetailsDto } from '@/api/discover/useDiscoverContent.types'
import DashboardCrudPage from '@/components/atoms/DashboardCrudPage'
import type { FormRenderProps } from '@/components/atoms/DashboardCrudPage'
import DiscoverFormFields from '@/components/atoms/DiscoverFormFields'
import type { DiscoverFormData } from '@/components/atoms/DiscoverFormFields'
import { emptyDiscoverForm } from '@/components/atoms/formDefaults'

function detailToDiscoverForm(detail: DiscoverContentDetailsDto): DiscoverFormData {
  return {
    titleAr: detail.titleAr ?? '',
    titleEn: detail.titleEn ?? '',
    bodyAr: detail.bodyAr ?? '',
    bodyEn: detail.bodyEn ?? '',
  }
}

function validateDiscoverForm(form: DiscoverFormData): boolean {
  return !!(form.titleAr && form.titleEn && form.bodyAr && form.bodyEn)
}

export default function DashboardDiscover() {
  return (
    <DashboardCrudPage<DiscoverContentResponseDto, DiscoverContentDetailsDto, DiscoverFormData>
      titleKey="dashboard.discover.title"
      searchPlaceholderKey="dashboard.discover.search"
      noResultsKey="dashboard.discover.no_results"
      untitledKey="dashboard.discover.untitled"
      deleteConfirmKey="dashboard.discover.delete_confirm"
      newButtonKey="dashboard.discover.new"
      formTitleKey="dashboard.discover.create"
      formEditTitleKey="dashboard.discover.edit"
      modalIcon={<BookOpen className="h-5 w-5 text-[#0a5c66]" />}
      noImageKey="dashboard.discover.no_img"
      useList={useDiscoverContent}
      useDetail={useDiscoverContentById}
      useCreate={useCreateDiscoverContent}
      useUpdate={useUpdateDiscoverContent}
      useDelete={useDeleteDiscoverContent}
      getListItemId={(item) => item.contentId}
      getListItemTitle={(item) => item.titleEn || item.titleAr || ''}
      getListItemImage={(item) => item.coverImageUrl}
      emptyForm={emptyDiscoverForm}
      validateForm={validateDiscoverForm}
      detailToForm={detailToDiscoverForm}
      buildCreatePayload={(form, coverFile) => ({
        ...form,
        coverImage: coverFile ?? undefined,
      })}
      buildUpdatePayload={(id, form) => ({
        id,
        ...form,
        coverImage: undefined,
      })}
      renderForm={(props: FormRenderProps<DiscoverFormData>) => (
        <DiscoverFormFields {...props} />
      )}
    />
  )
}
