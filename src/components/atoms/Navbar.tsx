import { useState, useRef, useCallback, useEffect } from 'react'
import hadhramoutAR from '@/assets/hadhramoutAR.svg'
import hadhramoutEN from '@/assets/hadhramoutEN.svg'
import { Globe, CircleUserRound, ChevronDown } from 'lucide-react'
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
import { useProfile } from '@/api/account/useAccount'
import { baseURL } from '@/api/axiosInstance'
import UserProfilePopover from './UserProfilePopover'
import LogoutModal from './LogoutModal'

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

const NavMenuItem = ({ title, href }: { title: string; href: string }) => {
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

const CLOSE_DELAY_MS = 300

const Navbar = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isRtl = useGetRtl()
  const logo = isRtl ? hadhramoutAR : hadhramoutEN

  const { isLoggedIn, userName, userEmail, roles, isAdmin, logout } = useAuthContext()
  const { data: profile } = useProfile({ enabled: isLoggedIn })
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      setIsProfileOpen(false)
    }, CLOSE_DELAY_MS)
  }, [clearCloseTimer])

  const openProfile = useCallback(() => {
    clearCloseTimer()
    setIsProfileOpen(true)
  }, [clearCloseTimer])

  const toggleProfile = useCallback(() => {
    setIsProfileOpen((prev) => {
      if (!prev) clearCloseTimer()
      return !prev
    })
  }, [clearCloseTimer])

  const closeProfile = useCallback(() => {
    clearCloseTimer()
    setIsProfileOpen(false)
  }, [clearCloseTimer])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isProfileOpen) {
        closeProfile()
        containerRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isProfileOpen, closeProfile])

  const handleLogoutConfirm = () => {
    logout()
    setShowLogoutModal(false)
    navigate('/')
  }

  const toggleLanguage = () => {
    void i18n.changeLanguage(isRtl ? 'en' : 'ar')
  }

  return (
    <>
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

          <NavigationMenuItem className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              onClick={toggleLanguage}
            >
              <div className="flex gap-2">
                <Label className="text-[#D2A870]">{isRtl ? 'EN' : 'AR'}</Label>
                <Globe className="text-[#D2A870]" />
              </div>
            </Button>

            {isLoggedIn ? (
              <div
                ref={containerRef}
                className="relative py-2 focus-within:z-50"
                onMouseEnter={openProfile}
                onMouseLeave={scheduleClose}
              >
                <Button
                  variant="ghost"
                  className={`cursor-pointer h-auto w-auto px-2.5 gap-1.5 flex ${isRtl ? 'flex-row-reverse' : 'flex-row'} group hover:bg-transparent`}
                  onClick={toggleProfile}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                >
                  <CircleUserRound size={36} className="text-[#D2A870] transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-md group-hover:brightness-110" />
                  <ChevronDown
                    className={`h-4 w-4 text-[#D2A870] transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </Button>

                <div
                  className={`absolute top-full ${isRtl ? 'left-0' : 'right-0'} z-50`}
                >
                  {/* Hover bridge: invisible connector that widens the mouse path */}
                  <div
                    className={`absolute top-0 h-4 ${isRtl ? 'left-0 right-0' : 'left-0 right-0'} -translate-y-full pointer-events-auto`}
                    aria-hidden="true"
                  />
                  <div
                    role="menu"
                    className={`
                      transition-all duration-200 ease-out
                      ${isProfileOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-2 pointer-events-none'
                      }
                    `}
                    onMouseEnter={openProfile}
                    onMouseLeave={scheduleClose}
                  >
                    <UserProfilePopover
                      userName={profile?.fullName || userName}
                      userEmail={userEmail}
                      avatarUrl={profile?.profileImageUrl ? `${baseURL}${profile.profileImageUrl}` : undefined}
                      isAdmin={isAdmin}
                      roles={roles}
                      onLogoutRequest={() => setShowLogoutModal(true)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="group hover:bg-transparent h-auto w-auto p-2"
                onClick={() => navigate('/auth?mode=login')}
              >
                <CircleUserRound size={36} className="text-[#D2A870] transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-md group-hover:brightness-110" />
              </Button>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  )
}

export default Navbar
