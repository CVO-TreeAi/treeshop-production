import { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import TreeShopTribune from '@/components/TreeShopTribune'

export const metadata: Metadata = {
  title: 'TreeShop Tribune - Florida Tree Industry Newspaper | TreeShop',
  description: 'Real stories from the field. Industry insights you won\'t find anywhere else. Written by the people who actually do the work. Florida\'s premier tree industry newspaper.',
  openGraph: {
    title: 'TreeShop Tribune | Florida Tree Industry News',
    description: 'Real stories from the field. Industry insights from Florida\'s forestry mulching experts.',
    type: 'website',
  },
}

export default function TribunePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <TreeShopTribune />
      <Footer />
    </div>
  );
}