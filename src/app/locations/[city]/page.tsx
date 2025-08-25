import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { getCityBySlug } from '../cities';
import type { Metadata } from 'next';

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) return { title: 'Florida Forestry Mulching | The Tree Shop' };
  const title = `Forestry Mulching in ${city.name}, Florida | The Tree Shop`;
  const description = `Forestry mulching and land clearing in ${city.name}, FL. Selective DBH packages, eco‑friendly mulch finish, fast scheduling along the ${city.corridor}.`;
  return {
    title,
    description,
    alternates: { canonical: `https://www.fltreeshop.com/locations/${city.slug}` },
    openGraph: { title, description },
  };
}

export default async function CityPage({ params }: Props) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <main className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-4">Service Area</h1>
          <p className="text-gray-300">We couldn’t find that city. Explore our service areas below.</p>
          <div className="mt-6">
            <Link href="/services/forestry-mulching" className="text-green-400 underline">Forestry Mulching</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = `Forestry Mulching in ${city.name}, Florida`;
  const description = `Professional forestry mulching and land clearing in ${city.name}, FL. Selective clearing by DBH, eco‑friendly mulch finish, and fast scheduling along the ${city.corridor} corridor.`;

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3">{title}</h1>
          <p className="text-gray-300">{description}</p>
        </header>

        <section className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">What We Do in {city.name}</h2>
            <p className="text-gray-300 mb-4">
              We use Fecon drum mulchers to selectively clear underbrush, palmettos, and saplings while preserving mature trees. Our largest package is 10" DBH & Under, ensuring a clean, usable landscape without debris hauling or burning.
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>• 1–5 acres per day depending on density and DBH package</li>
              <li>• Natural mulch finish controls erosion and boosts soil health</li>
              <li>• Ideal for trails, homesteads, food plots, and view corridors</li>
            </ul>
          </div>
          <aside className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-400 mb-3">Ready for a Proposal?</h3>
            <p className="text-gray-300 mb-4">Get your personalized forestry mulching proposal for {city.name}, FL.</p>
            <Link href="/estimate" className="inline-block bg-green-600 hover:bg-green-500 text-black font-semibold px-6 py-3 rounded-lg">Request a Proposal</Link>
            <p className="text-xs text-gray-500 mt-3">No pricing shown here. Proposals are generated in the estimate tool.</p>
          </aside>
        </section>

        <section className="mb-12 bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Why Forestry Mulching Works in {city.name}</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <ul className="space-y-2">
              <li>• Controls underbrush and invasive species common in Florida</li>
              <li>• Reduces wildfire risk by removing ladder fuels</li>
              <li>• Maintains soil structure and prevents erosion</li>
            </ul>
            <ul className="space-y-2">
              <li>• No debris hauling or burn permits needed</li>
              <li>• Quiet enough for residential neighborhoods</li>
              <li>• Clean, defined finish points by DBH (Diameter at Breast Height)</li>
            </ul>
          </div>
        </section>

        {/* Local Project Gallery */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Projects in {city.name}, Florida</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Equipment in Central Florida */}
            <div className="bg-gray-900 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src="/project-images/cat-265-fecon-blackhawk-fueling.jpg"
                  alt={`CAT 299D3 forestry mulching equipment working in Central Florida near ${city.name}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-sm">Professional Equipment</h3>
                  <p className="text-xs opacity-90">CAT 299D3 Mulcher</p>
                </div>
              </div>
            </div>

            {/* Before/After Florida Project */}
            <div className="bg-gray-900 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-2">
                  <div className="relative">
                    <img 
                      src="/project-images/avon-park-land-clearing-before-dense-vegetation.jpg"
                      alt={`Dense overgrown vegetation before forestry mulching near ${city.name} Florida`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">BEFORE</div>
                  </div>
                  <div className="relative">
                    <img 
                      src="/project-images/avon-park-land-clearing-after-forestry-mulching.jpg"
                      alt={`Cleared land with natural mulch after forestry mulching near ${city.name} Florida`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 text-xs rounded">AFTER</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Results */}
            <div className="bg-gray-900 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src="/project-images/lehigh-acres-land-clearing-after-professional-mulching.jpg"
                  alt={`Completed forestry mulching project results near ${city.name} Florida`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-sm">Completed Projects</h3>
                  <p className="text-xs opacity-90">Central Florida Results</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas Showcase */}
        <section className="mb-12 bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Work Across Central Florida</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Different Location Photos */}
            <div className="relative aspect-square rounded-lg overflow-hidden group">
              <img 
                src="/project-images/okeechobee-land-clearing-before-dense-forest-undergrowth.jpg"
                alt="Forestry mulching project New Smyrna Beach Florida"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-2 left-2 text-white">
                <p className="text-xs font-medium">New Smyrna Beach</p>
              </div>
            </div>

            <div className="relative aspect-square rounded-lg overflow-hidden group">
              <img 
                src="/project-images/okeechobee-land-clearing-after-forestry-mulching-complete.jpg"
                alt="Forestry mulching project Lake Mary Florida"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-2 left-2 text-white">
                <p className="text-xs font-medium">Lake Mary</p>
              </div>
            </div>

            <div className="relative aspect-square rounded-lg overflow-hidden group">
              <img 
                src="/project-images/lehigh-acres-land-clearing-before-thick-undergrowth.jpg"
                alt="Forestry mulching project Oak Hill Florida"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-2 left-2 text-white">
                <p className="text-xs font-medium">Oak Hill</p>
              </div>
            </div>

            <div className="relative aspect-square rounded-lg overflow-hidden group">
              <img 
                src="/project-images/avon-park-land-clearing-after-forestry-mulching.jpg"
                alt="Forestry mulching project Volusia County Florida"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-2 left-2 text-white">
                <p className="text-xs font-medium">Volusia County</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 text-center">
          <Link href="/services/forestry-mulching" className="text-green-400 underline">Learn more about our process</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}


