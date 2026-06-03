import hadhramoutAR from '@/assets/hadhramoutAR.svg'
import hadhramoutEN from '@/assets/hadhramoutEN.svg'
import { Camera, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useGetRtl } from '@/lib/utils'
import { Link } from 'react-router-dom'

export default function Footer() {
  const { t } = useTranslation()
  const isRtl = useGetRtl()
  const logo = isRtl ? hadhramoutAR : hadhramoutEN

  return (
    <footer className="bg-tertiary">
      {/* Top Section */}
      <div className="grid gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-12 md:grid-cols-2 md:gap-12 md:px-10 md:py-16 lg:grid-cols-4 lg:px-16 xl:px-20">
        {/* Brand */}
        <div className="space-y-4 sm:space-y-6">
          <img
            src={logo}
            alt="Hadhramout 360"
            className="max-w-[160px] object-contain sm:max-w-[200px]"
          />
          <p className="max-w-sm text-base leading-7 text-muted-foreground sm:text-lg sm:leading-9">{t('footer.tagline')}</p>

          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              size="icon"
              variant="ghost"
              className="h-11 w-11 rounded-xl bg-white sm:h-14 sm:w-14 sm:rounded-2xl"
            >
              <Share2 className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-11 w-11 rounded-xl bg-white sm:h-14 sm:w-14 sm:rounded-2xl"
            >
              <Camera className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-xl font-semibold sm:text-2xl">{t('footer.quick_links')}</h3>

          <div className="flex flex-col gap-3 text-base text-muted-foreground sm:gap-5 sm:text-lg">
            <a
              href="#"
              className="transition-colors hover:text-primary"
            >
              {t('footer.about')}
            </a>

            <Link
              to="/auth?mode=register-org"
              className="transition-colors hover:text-primary"
            >
              {t('footer.signup_org')}
            </Link>

            <a
              href="#"
              className="transition-colors hover:text-primary"
            >
              {t('footer.contact')}
            </a>
          </div>
        </div>

        {/* Legal */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-xl font-semibold sm:text-2xl">{t('footer.legal')}</h3>

          <div className="flex flex-col gap-3 text-base text-muted-foreground sm:gap-5 sm:text-lg">
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
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-xl font-semibold sm:text-2xl">{t('footer.subscribe')}</h3>

          <p className="max-w-sm text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {t('footer.subscribe_desc')}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center justify-between gap-4 border-t px-4 py-6 text-muted-foreground sm:gap-6 sm:px-6 sm:py-8 md:flex-row md:px-10 lg:px-16 xl:px-20">
        <p className="text-sm text-center sm:text-lg">{t('footer.copyright')}</p>

        <div className="flex items-center gap-4 text-sm font-medium text-primary sm:gap-8 sm:text-lg">
          <a href="#">{t('footer.link.discover')}</a>
          <a href="#">{t('footer.link.engage')}</a>
          <a href="#">{t('footer.link.preserve')}</a>
        </div>
      </div>
    </footer>
  )
}
