'use client';

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useMemo } from 'react';

type Node = {
  id: string;
  q: string;
  a: string;
  links?: Array<{ label: string; href: string }>;
};

const nodes: Record<string, Node> = {
  root: {
    id: 'root',
    q: 'Forestry Mulching',
    a: 'Selective land clearing that turns vegetation into on‑site mulch.',
    links: [
      { label: 'Estimate Tool', href: '/estimate' },
      { label: 'Service Areas', href: '/locations' },
    ],
  },
  speed: {
    id: 'speed',
    q: 'How much can you clear per day?',
    a: 'Typically 1–5 acres/day depending on vegetation density and DBH package.',
  },
  size: {
    id: 'size',
    q: 'What size trees can you mulch?',
    a: 'Largest package is 10" DBH & Under. Larger trees are preserved unless addressed.',
  },
  erosion: {
    id: 'erosion',
    q: 'Does mulch help with erosion?',
    a: 'Yes. The mulch layer reduces runoff and stabilizes soil, especially during Florida downpours.',
  },
  invasives: {
    id: 'invasives',
    q: 'Do you handle invasive species?',
    a: 'We target palmettos, Brazilian pepper, melaleuca, and other invasive underbrush safely.',
  },
  noise: {
    id: 'noise',
    q: 'Is it noisy?',
    a: 'Lower noise than traditional clearing; suitable for residential areas.',
  },
  debris: {
    id: 'debris',
    q: 'Do you haul debris?',
    a: 'No hauling needed. Everything is mulched and left on site as natural ground cover.',
  },
  wetlands: {
    id: 'wetlands',
    q: 'What about wetlands?',
    a: 'We preserve sensitive areas and work within local requirements; site validation is included.',
  },
  pricing: {
    id: 'pricing',
    q: 'Where is pricing shown?',
    a: 'In the proposal/estimate tool only. Education pages don’t show pricing.',
    links: [{ label: 'Open Estimate', href: '/estimate' }],
  },
  dbh: {
    id: 'dbh',
    q: 'What is DBH?',
    a: 'Diameter at Breast Height — how we define clear/keep thresholds for packages.',
  },
  access: {
    id: 'access',
    q: 'Do you need great access?',
    a: 'Track machines with low ground pressure handle soft ground and moderate access limits.',
  },
};

export default function MindMapPage(){
  const list = useMemo(() => Object.values(nodes), []);
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Forestry Mulching Mind Map</h1>
          <p className="text-gray-300">Short answers to common questions. Updated as our services grow.</p>
        </header>

        {/* Grid mind map (mobile-friendly) */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((n) => (
            <div key={n.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h3 className="text-lg font-semibold text-green-400 mb-2">{n.q}</h3>
              <p className="text-gray-300 text-sm">{n.a}</p>
              {n.links && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {n.links.map((l) => (
                    <Link key={l.href} href={l.href} className="text-xs px-2 py-1 rounded border border-gray-700 hover:border-green-600">
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}


