
import Link from 'next/link';
const items = [
  { href: '/services/forestry-mulching', title: 'Forestry Mulching', desc: 'Selective clearing, acreage prep, trails' },
  { href: '/services/stump-grinding', title: 'Stump Grinding', desc: 'Clean finishes for build‑ready sites' },
];
export default function ServiceTiles(){
  return (
    <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((i)=> (
          <Link 
            key={i.href} 
            href={i.href} 
            className="group glass-morphism rounded-xl p-6 hover:scale-105 hover:shadow-glow transition-all duration-300 touch-manipulation"
          >
            <div className="text-xl font-bold text-gradient-primary mb-3 group-hover:text-white transition-all duration-300">
              {i.title}
            </div>
            <div className="text-gray-300 text-base leading-relaxed group-hover:text-gray-100 transition-colors duration-300">
              {i.desc}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
