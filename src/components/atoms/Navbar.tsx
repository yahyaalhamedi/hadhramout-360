import { useState } from 'react'
import hadhramoutAR from '@/assets/hadhramoutAR.svg'
import hadhramoutEN from '@/assets/hadhramoutEN.svg'
import { Globe, CircleUserRound, Menu, X } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
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
import { useAuthContext } from '@/lib/AuthContext'
import UserProfilePopover from './UserProfilePopover'

const content: { title: string; href: string }[] = [
  { title: 'home', href: '/' },
  { title: 'landmarks', href: '/landmarks' },
  { title: 'events', href: '/events' },
  { title: 'artisans', href: '/artisans' },
  { title: 'discover', href: '/discover' },
  { title: 'community', href: '/community' },
]

const isNavActive = (pathname: string, href: string) => {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

const NavMenuItem = ({ title, href, onClick }: { title: string; href: string; onClick?: () => void }) => {
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
        onClick={onClick}
      >
        {title}
      </NavLink>
    </NavigationMenuLink>
  )
}

const Navbar = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isRtl = useGetRtl()
  const logo = isRtl ? hadhramoutAR : hadhramoutEN
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { isLoggedIn, userName, userEmail, roles, isAdmin } = useAuthContext()

  const toggleLanguage = () => {
    void i18n.changeLanguage(isRtl ? 'en' : 'ar')
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <NavigationMenu dir={isRtl ? 'rtl' : 'ltr'}>
        <NavigationMenuList className="flex w-screen items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-10 md:py-5">
          {/* Logo */}
          <NavigationMenuItem>
            <NavLink to="/">
              <img
                src={logo}
                alt="Hadhramout 360"
                className="h-7 w-[180px] sm:h-8 sm:w-[220px]"
              />
            </NavLink>
          </NavigationMenuItem>

          {/* Desktop nav links */}
          <NavigationMenuItem className="hidden items-center gap-5 lg:flex">
            {content.map((item) => (
              <NavMenuItem
                key={item.href}
                title={t(item.title)}
                href={item.href}
              />
            ))}
          </NavigationMenuItem>

          {/* Desktop right actions */}
          <NavigationMenuItem className="hidden items-center gap-1 lg:flex">
            <Button
              variant="ghost"
              onClick={toggleLanguage}
            >
              <div className="flex gap-2">
                <Label>{isRtl ? 'EN' : 'AR'}</Label>
                <Globe />
              </div>
            </Button>

            {isLoggedIn ? (
              <div className="relative group py-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                >
                  <CircleUserRound className="text-[#0a5c66] h-6 w-6" />
                </Button>
                {/* Fade-in transform Popover container */}
                <div className="absolute right-0 top-full mt-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <UserProfilePopover
                    userName={userName}
                    userEmail={userEmail}
                    isAdmin={isAdmin}
                    roles={roles}
                    onLogoutSuccess={() => {
                      navigate('/')
                    }}
                  />
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/auth?mode=login')}
              >
                <CircleUserRound />
              </Button>
            )}
          </NavigationMenuItem>

          {/* Mobile: Language + Hamburger */}
          <NavigationMenuItem className="flex items-center gap-1 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="h-9 w-9"
            >
              <Globe className="h-5 w-5" />
            </Button>

            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/posts')}
                className="h-9 w-9"
              >
                <CircleUserRound className="text-[#0a5c66] h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/auth?mode=login')}
                className="h-9 w-9"
              >
                <CircleUserRound className="h-5 w-5" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile slide-down menu */}
      <div
        className={`
          fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-xl shadow-2xl
          transition-all duration-500 ease-out overflow-hidden
          lg:hidden
          ${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
        `}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Close header */}
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <NavLink to="/" onClick={closeMobileMenu}>
            <img
              src={logo}
              alt="Hadhramout 360"
              className="h-7 w-[180px] sm:h-8 sm:w-[220px]"
            />
          </NavLink>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobileMenu}
            className="h-9 w-9"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-4 pb-6 sm:px-6">
          {content.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-lg font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted'
                }`
              }
            >
              {t(item.title)}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Overlay backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </>
  )
}

export default Navbar
