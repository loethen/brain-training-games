import Link from "next/link"
import { Brain } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-8 py-8 md:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          {/* Brand and Description */}
          <div className="flex flex-col gap-3 md:max-w-xs">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span className="text-xl font-bold">FocusGames</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Free brain training games to improve your focus, memory, and cognitive abilities.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Games</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li><Link href="/games/memory-blocks">Memory Blocks</Link></li>
                <li><Link href="/games/pattern-match">Pattern Match</Link></li>
                <li><Link href="/games/speed-focus">Speed Focus</Link></li>
                <li><Link href="/games">View All</Link></li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-t pt-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FocusGames. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground">
              Twitter
            </Link>
            <Link href="https://github.com" className="text-muted-foreground hover:text-foreground">
              GitHub
            </Link>
            <Link href="https://discord.com" className="text-muted-foreground hover:text-foreground">
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 