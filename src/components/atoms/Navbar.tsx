import hadhramoutAR from '@/assets/hadhramoutAR.svg'
import hadhramoutEN from '@/assets/hadhramoutEN.svg'
import { Globe, CircleUserRound } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { useGetRtl } from '@/lib/utils'

const content: { title: string; href: string }[] = [
  { title: 'home', href: '/' },
  { title: 'landmarks', href: '/landmarks' },
  { title: 'events', href: '/events' },
  { title: 'artisans', href: '/artisans' },
  { title: 'discover', href: '/discover' },
  { title: 'community', href: '/community' },
]

function isNavActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavMenuItem({ title, href }: { title: string; href: string }) {
  const { pathname } = useLocation()
  const active = isNavActive(pathname, href)

  return (
    <NavigationMenuLink
      asChild
      className={
        active
          ? 'text-primary font-medium border-b-2 border-primary'
          : 'text-muted-foreground hover:text-foreground'
      }
    >
      <NavLink
        to={href}
        end={href === '/'}
        aria-current={active ? 'page' : undefined}
      >
        {title}
      </NavLink>
    </NavigationMenuLink>
  )
}

export function NavigationMenuDemo() {
  const { t, i18n } = useTranslation()
  const isRtl = useGetRtl()
  const logo = isRtl ? hadhramoutAR : hadhramoutEN

  const toggleLanguage = () => {
    void i18n.changeLanguage(isRtl ? 'en' : 'ar')
  }

  return (
    <NavigationMenu dir={isRtl ? 'rtl' : 'ltr'}>
      <NavigationMenuList className="flex w-screen items-center justify-between gap-4 px-10 py-5">
        <NavigationMenuItem>
          <NavLink to="/">
            <img
              src={logo}
              alt="Hadhramout 360"
              className="h-8 w-[220px]"
            />
          </NavLink>
        </NavigationMenuItem>

        <NavigationMenuItem className="flex items-center gap-5">
          {content.map((item) => (
            <NavMenuItem
              key={item.href}
              title={t(item.title)}
              href={item.href}
            />
          ))}
        </NavigationMenuItem>

        <NavigationMenuItem className="flex items-center gap-1">
          <Button
            variant="ghost"
            onClick={toggleLanguage}
          >
            <div className="flex gap-2">
              <Label>{isRtl ? 'EN' : 'AR'}</Label>
              <Globe />
            </div>
          </Button>

          <Button
            variant="ghost"
            size="icon"
          >
            <CircleUserRound />
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
