import hadhramoutAR from '@/assets/hadhramoutAR.svg'
import hadhramoutEN from '@/assets/hadhramoutEN.svg'
import { Camera, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useGetRtl } from '@/lib/utils'

export default function Footer() {
  const { t } = useTranslation()
  const isRtl = useGetRtl()
  const logo = isRtl ? hadhramoutAR : hadhramoutEN

  return (
    <footer className="bg-tertiary">
      {/* Top Section */}
      <div className="grid gap-12 px-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-6">
          <img
            src={logo}
            alt="Hadhramout 360"
            className="max-w-[200px] object-contain"
          />
          <p className="max-w-sm text-lg leading-9 text-muted-foreground">{t('footer.tagline')}</p>

          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              className="h-14 w-14 rounded-2xl bg-white"
            >
              <Share2 className="h-5 w-5 text-primary" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-14 w-14 rounded-2xl bg-white"
            >
              <Camera className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">{t('footer.quick_links')}</h3>

          <div className="flex flex-col gap-5 text-lg text-muted-foreground">
            <a
              href="#"
              className="transition-colors hover:text-primary"
            >
              {t('footer.about')}
            </a>

            <a
              href="#"
              className="transition-colors hover:text-primary"
            >
              {t('footer.signup_org')}
            </a>

            <a
              href="#"
              className="transition-colors hover:text-primary"
            >
              {t('footer.contact')}
            </a>
          </div>
        </div>

        {/* Legal */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">{t('footer.legal')}</h3>

          <div className="flex flex-col gap-5 text-lg text-muted-foreground">
            <a
              href="#"
              className="transition-colors hover:text-primary"
            >
              {t('footer.privacy')}
            </a>

            <a
              href="#"
              className="transition-colors hover:text-primary"
            >
              {t('footer.terms')}
            </a>
          </div>
        </div>

        {/* Subscribe */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">{t('footer.subscribe')}</h3>

          <p className="max-w-sm text-lg leading-8 text-muted-foreground">
            {t('footer.subscribe_desc')}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center justify-between gap-6 border-t px-10 py-8 text-muted-foreground md:flex-row">
        <p className="text-lg">{t('footer.copyright')}</p>

        <div className="flex items-center gap-8 text-lg font-medium text-primary">
          <a href="#">{t('footer.link.discover')}</a>
          <a href="#">{t('footer.link.engage')}</a>
          <a href="#">{t('footer.link.preserve')}</a>
        </div>
      </div>
    </footer>
  )
}
