
const items = [
  { title: 'DBH Package System', desc: 'Industry-first Small, Medium, Large packages - we invented precise diameter clearing', slug: 'dbh-package-system-explained', icon: '🎯' },
  { title: 'Land Freedom Philosophy', desc: 'Your land, your vision. No need for massive equipment to open up possibilities', slug: 'land-freedom-forestry-mulching-benefits', icon: '🌄' },
  { title: 'Fecon Drum Technology', desc: 'Purpose-built mulchers specifically designed for Florida vegetation and terrain', slug: 'fecon-drum-mulchers-in-florida', icon: '⚙️' },
  { title: 'Eco-Friendly Process', desc: 'Low-impact clearing that enriches soil and prevents erosion naturally', slug: 'eco-friendly-forestry-mulching', icon: '🌱' },
  { title: 'Industry Leadership', desc: 'Pioneers of TreeAI and advanced tools that revolutionize customer experience', slug: 'treeai-precision-clearing', icon: '🚀' },
  { title: 'High-Value Solutions', desc: 'Maximum land utility with minimal environmental disruption and defined finish points', slug: 'high-value-forestry-mulching-outcomes', icon: '💎' },
];
export default function ValueProps(){
  return (
    <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">Land Freedom Through Innovation</h2>
        <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">Leaders in precision land clearing with purpose-built technology for the Southeast</p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
        {items.map((i)=> (
          <a href={`/articles/${i.slug}`} key={i.title} className="group relative block overflow-hidden rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 touch-manipulation min-h-[140px] flex flex-col justify-center" 
             style={{ 
               background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.85), rgba(29, 78, 216, 0.85))', 
               backdropFilter: 'blur(16px)',
               border: '1px solid rgba(59, 130, 246, 0.2)',
               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
             }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent"></div>
            <div className="relative z-10 text-center">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{i.icon}</div>
              <div className="font-black text-base mb-2 group-hover:text-green-300 transition-colors duration-300 text-white tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{i.title}</div>
              <div className="text-sm leading-snug text-white/90 font-medium">{i.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
