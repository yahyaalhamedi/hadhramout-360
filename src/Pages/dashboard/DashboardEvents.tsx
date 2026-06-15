import { Calendar } from 'lucide-react'
import {
  useEvents,
  useUpdateEvent,
  useDeleteEvent,
  useAddEventMedia,
  useDeleteEventMedia,
  useReplaceEventMedia,
  useEvent,
} from '@/api/events/useEvents'
import type { EventResponseDto, EventDetailsDto } from '@/api/events/useEvents.types'
import DashboardCrudPage from '@/components/atoms/DashboardCrudPage'
import type { FormRenderProps } from '@/components/atoms/DashboardCrudPage'
import { emptyEventForm } from '@/components/atoms/formDefaults'
import EventFormFields from '@/components/atoms/EventFormFields'
import type { EventFormData } from '@/components/atoms/EventFormModal'


function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function detailToEventForm(detail: EventDetailsDto): EventFormData {
  return {
    titleAr: detail.titleAr ?? '',
    titleEn: detail.titleEn ?? '',
    descriptionAr: detail.descriptionAr ?? '',
    descriptionEn: detail.descriptionEn ?? '',
    addressAr: detail.addressAr ?? '',
    addressEn: detail.addressEn ?? '',
    mapUrl: detail.mapUrl ?? '',
    formUrl: detail.formUrl ?? '',
    startDate: detail.startDate ? new Date(detail.startDate).toISOString().slice(0, 10) : '',
    endDate: detail.endDate ? new Date(detail.endDate).toISOString().slice(0, 10) : '',
  }
}

function validateEventForm(form: EventFormData): boolean {
  return !!(form.titleAr && form.titleEn && form.descriptionAr && form.descriptionEn && form.addressAr && form.addressEn && form.startDate && form.endDate)
}

export default function DashboardEvents() {
  return (
    <DashboardCrudPage<EventResponseDto, EventDetailsDto, EventFormData>
      titleKey="dashboard.events.title"
      searchPlaceholderKey="dashboard.events.search"
      noResultsKey="dashboard.events.no_results"
      untitledKey="dashboard.events.untitled"
      deleteConfirmKey="dashboard.events.delete_confirm"
      formTitleKey="dashboard.event_form.create_event"
      formEditTitleKey="dashboard.event_form.edit_event"
      modalIcon={<Calendar className="h-5 w-5 text-[#0a5c66]" />}
      modalWidth="max-w-3xl"
      noImageKey="dashboard.events.no_img"
      useList={useEvents}
      useDetail={useEvent}
      useCreate={useUpdateEvent as any}
      useUpdate={useUpdateEvent}
      useDelete={useDeleteEvent}
      useAddMedia={useAddEventMedia}
      useDeleteMedia={useDeleteEventMedia}
      useReplaceMedia={useReplaceEventMedia}
      getListItemId={(ev) => ev.eventId}
      getListItemTitle={(ev) => ev.titleEn || ev.titleAr || ''}
      getListItemImage={(ev) => ev.coverImageUrl}
      getListItemBadge={(ev) => ev.organizationNameEn || ev.organizationNameAr || null}
      renderListItemContent={(ev) => (
        <p className="text-[12px] text-slate-400 mt-0.5">
          {formatDate(ev.startDate)} - {formatDate(ev.endDate)}
        </p>
      )}
      emptyForm={emptyEventForm}
      validateForm={validateEventForm}
      detailToForm={detailToEventForm}
      buildCreatePayload={(form, coverFile, mediaFiles) => ({
        ...form,
        coverImage: coverFile,
        files: mediaFiles,
      })}
      buildUpdatePayload={(id, form) => ({ id, ...form })}
      getExistingMedia={(detail) => detail.media}
      renderForm={(props: FormRenderProps<EventFormData>) => (
        <EventFormFields {...props} />
      )}
      showCreateButton={false}
    />
  )
}
