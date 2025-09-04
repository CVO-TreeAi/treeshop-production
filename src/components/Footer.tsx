
import Link from 'next/link';
import { TREESHOP_BUSINESS_DATA } from '@/lib/treeshop-business-data';

export default function Footer(){
  return (
    <footer className="border-t" style={{ borderColor: 'var(--medium-gray)', backgroundColor: 'var(--card)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand & Contact */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Link href="/" className="font-bold text-xl" style={{ color: 'var(--accent-green)' }}>
              TreeShop
            </Link>
            <div className="text-center md:text-left">
              <div className="text-white text-sm font-medium">
                {TREESHOP_BUSINESS_DATA.company.location} • Central Florida
              </div>
              <div className="text-sm" style={{ color: 'var(--font-secondary)' }}>
                {TREESHOP_BUSINESS_DATA.company.phone} • Licensed & Insured
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <Link 
            href="/estimate" 
            className="btn-modern btn-primary"
          >
            Get Free Proposal
          </Link>
        </div>
        
        {/* Copyright & TreeAI */}
        <div className="border-t mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center" 
             style={{ borderColor: 'var(--medium-gray)' }}>
          <div className="text-xs" style={{ color: 'var(--font-secondary)' }}>
            © {new Date().getFullYear()} {TREESHOP_BUSINESS_DATA.company.fullName}. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: 'var(--font-secondary)' }}>Powered by</span>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full" 
                 style={{ 
                   backgroundColor: 'var(--accent-green)', 
                   color: 'var(--font-on-accent)' 
                 }}>
              <span className="font-bold text-xs">TreeAI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
