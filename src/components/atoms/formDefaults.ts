import type { EventFormData } from './EventFormModal'
import type { LandmarkFormData } from './LandmarkFormFields'
import type { DiscoverFormData } from './DiscoverFormFields'
import type { ArtisanFormData } from './ArtisanFormFields'

export const emptyEventForm: EventFormData = {
  titleAr: '',
  titleEn: '',
  descriptionAr: '',
  descriptionEn: '',
  addressAr: '',
  addressEn: '',
  mapUrl: '',
  formUrl: '',
  startDate: '',
  endDate: '',
}

export const emptyLandmarkForm: LandmarkFormData = {
  titleAr: '',
  titleEn: '',
  descriptionAr: '',
  descriptionEn: '',
  locationTextAr: '',
  locationTextEn: '',
  mapUrl: '',
  categoryIds: [],
}

export const emptyDiscoverForm: DiscoverFormData = {
  titleAr: '',
  titleEn: '',
  bodyAr: '',
  bodyEn: '',
}

export const emptyArtisanForm: ArtisanFormData = {
  nameAr: '',
  nameEn: '',
  phone: '',
  descriptionAr: '',
  descriptionEn: '',
  locationTextAr: '',
  locationTextEn: '',
  mapUrl: '',
}
