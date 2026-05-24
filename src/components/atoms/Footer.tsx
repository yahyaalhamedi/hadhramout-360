import { Camera, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Footer() {
  return (
    <footer className=" bg-tertiary">
      {/* Top Section */}
      <div className="grid gap-12 px-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">Hadhramout 360</h2>

          <p className="max-w-sm text-lg leading-9 text-muted-foreground">
            Preserving and promoting the breathtaking cultural heritage of Hadhramout for a global
            audience.
          </p>

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
          <h3 className="text-2xl font-semibold">Quick Links</h3>

          <div className="flex flex-col gap-5 text-lg text-muted-foreground">
            <a
              href="#"
              className="transition-colors hover:text-primary"
            >
              About Us
            </a>

            <a
              href="#"
              className="transition-colors hover:text-primary"
            >
              Sign up as Org.
            </a>

            <a
              href="#"
              className="transition-colors hover:text-primary"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Legal */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Legal</h3>

          <div className="flex flex-col gap-5 text-lg text-muted-foreground">
            <a
              href="#"
              className="transition-colors hover:text-primary"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="transition-colors hover:text-primary"
            >
              Terms of Service
            </a>
          </div>
        </div>

        {/* Subscribe */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Subscribe</h3>

          <p className="max-w-sm text-lg leading-8 text-muted-foreground">
            Stay updated with the latest events and cultural discoveries.
          </p>

          {/* <div className="flex items-center gap-3">
            <Input
              type="email"
              placeholder="Email address"
              className="h-14 rounded-2xl border-0 bg-background text-base"
            />

            <Button
              size="icon"
              className="h-14 w-14 rounded-2xl"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div> */}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center justify-between gap-6 border-t px-10 py-8 text-muted-foreground md:flex-row">
        <p className="text-lg">© 2024 Hadhramout 360. All rights reserved.</p>

        <div className="flex items-center gap-8 text-lg font-medium text-primary">
          <a href="#">Discover</a>
          <a href="#">Engage</a>
          <a href="#">Preserve</a>
        </div>
      </div>
    </footer>
  )
}
