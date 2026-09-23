'use client';

import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Facebook } from 'lucide-react'
import KolofiLogo from '@/components/brand/logo'

export function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-border pt-20 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <KolofiLogo size="sm" />
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              Empowering African communities with transparent, blockchain-powered savings circles.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Github, Linkedin, Facebook].map((Icon, i) => (
                <Link key={i} href="#" className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg">Product</h3>
            <ul className="space-y-4">
              {['Features', 'How It Works', 'Security', 'Roadmap'].map((item) => (
                <li key={item}>
                  <Link href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg">Company</h3>
            <ul className="space-y-4">
              {['About Us', 'Contact', 'Blog', 'Careers'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg">Stay Updated</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get the latest updates on new features and community savings tips.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 bg-muted/50 border border-border rounded-xl px-4 text-sm outline-none focus:border-primary transition-colors"
                aria-label="Email address"
              />
              <button 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground font-medium">
            © {currentYear} {APP_NAME}. All rights reserved. Built for Africa.
          </p>
          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
