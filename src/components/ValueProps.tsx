
const items = [
  { title: 'DBH Package System', desc: 'Choose exactly what gets cleared - 4", 6", 8", or 10" diameter limits for precise results', slug: 'dbh-package-system-explained', icon: '🎯' },
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((i)=> (
          <a href={`/blog/${i.slug}`} key={i.title} className="group block border border-blue-600 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 touch-manipulation shadow-xl hover:shadow-2xl hover:scale-105" style={{ background: 'linear-gradient(135deg, #1e40af, #1e3a8a)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl group-hover:scale-110 transition-transform duration-300">{i.icon}</div>
              <div className="font-bold text-lg group-hover:text-green-400 transition-colors duration-300" style={{ color: '#FFFFFF' }}>{i.title}</div>
            </div>
            <div className="text-base leading-relaxed" style={{ color: '#FFFFFF' }}>{i.desc}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
