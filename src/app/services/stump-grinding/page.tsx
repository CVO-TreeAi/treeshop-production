import { Metadata } from 'next';
import StumpGrindingContent from './StumpGrindingContent';

export const metadata: Metadata = {
  title: 'Transparent Stump Grinding Pricing with TreeAI Technology | TreeShop Central Florida',
  description: 'Professional stump grinding with mathematical pricing precision. No guesswork, no surprises - just fair, transparent quotes based on TreeAI measurements. $75 estimate fee credited when hired.',
  keywords: 'stump grinding, tree stump removal, Central Florida, transparent pricing, TreeAI technology, Rayco stump grinder, professional tree service, no hidden fees, mathematical pricing, stump grinder near me',
  openGraph: {
    title: 'Transparent Stump Grinding Pricing | TreeAI Technology',
    description: 'No more guesswork pricing! Get transparent, mathematical stump grinding quotes with TreeAI precision measurement. Professional Rayco equipment, same-day service, no hidden fees.',
    images: [{
      url: '/treeshop/images/equipment/land-management-rayco-stump-central-florida.jpg',
      width: 1200,
      height: 630,
      alt: 'Professional Rayco stump grinder with TreeAI measurement technology',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transparent Stump Grinding | TreeAI Precision Pricing',
    description: 'Mathematical precision meets stump grinding. Get fair, transparent quotes based on exact measurements, not guesswork.',
    images: ['/treeshop/images/equipment/land-management-rayco-stump-central-florida.jpg'],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/treeshop/services/stump-grinding` : '/treeshop/services/stump-grinding',
  },
};

export default function StumpGrindingPage() {
  return <StumpGrindingContent />;
}