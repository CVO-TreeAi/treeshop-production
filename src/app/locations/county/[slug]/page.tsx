import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Florida counties with forestry mulching demand
const FLORIDA_COUNTIES = {
  'marion': {
    name: 'Marion County',
    city: 'Ocala',
    population: '375,000',
    description: 'Central Florida horse country with extensive forestry and rural properties requiring professional land clearing services.',
    projects: '47',
    avgAcreage: '3.2',
    vegetation: 'Oak, Pine, Palmetto',
    regulations: 'Environmental Resource Permit required for wetlands',
    permits: 'Marion County Building Department'
  },
  'orange': {
    name: 'Orange County',
    city: 'Orlando',
    population: '1.4 million',
    description: 'Central Florida metro area with high development activity and commercial land clearing needs.',
    projects: '89',
    avgAcreage: '2.8',
    vegetation: 'Live Oak, Laurel Oak, Cabbage Palm',
    regulations: 'Tree protection ordinance, wetland buffers',
    permits: 'Orange County Environmental Protection Division'
  },
  'volusia': {
    name: 'Volusia County',
    city: 'Daytona Beach',
    population: '545,000',
    description: 'East Central Florida with diverse ecosystems from coastal to inland forest properties.',
    projects: '34',
    avgAcreage: '4.1',
    vegetation: 'Southern Live Oak, Slash Pine, Saw Palmetto',
    regulations: 'Coastal construction setbacks, environmental protection zones',
    permits: 'Volusia County Growth & Resource Management'
  },
  'brevard': {
    name: 'Brevard County',
    city: 'Melbourne',
    population: '606,000',
    description: 'Space Coast region with unique environmental considerations and growing development pressure.',
    projects: '28',
    avgAcreage: '2.9',
    vegetation: 'Cabbage Palm, Live Oak, Wax Myrtle',
    regulations: 'Sea turtle nesting season restrictions, scrub jay habitat protection',
    permits: 'Brevard County Natural Resources Management'
  },
  'seminole': {
    name: 'Seminole County',
    city: 'Sanford',
    population: '471,000',
    description: 'North Orlando metro with suburban expansion and commercial development needs.',
    projects: '52',
    avgAcreage: '1.8',
    vegetation: 'Live Oak, Longleaf Pine, Southern Magnolia',
    regulations: 'Tree preservation ordinance, wetland protection',
    permits: 'Seminole County Development Services'
  },
  'lake': {
    name: 'Lake County',
    city: 'Tavares',
    population: '383,000',
    description: 'Central Florida lake region with rolling hills and diverse forest ecosystems.',
    projects: '31',
    avgAcreage: '3.7',
    vegetation: 'Longleaf Pine, Turkey Oak, Wiregrass',
    regulations: 'Lake Harris Chain environmental protection',
    permits: 'Lake County Community Development'
  }
};

type CountyParams = Promise<{
  slug: keyof typeof FLORIDA_COUNTIES;
}>;

export async function generateStaticParams() {
  return Object.keys(FLORIDA_COUNTIES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata(
  { params }: { params: CountyParams }
): Promise<Metadata> {
  const { slug } = await params;
  const countyData = FLORIDA_COUNTIES[slug];
  
  if (!countyData) {
    return {
      title: 'County Not Found'
    };
  }

  return {
    title: `Forestry Mulching ${countyData.name}, FL - TreeAI Professional Services`,
    description: `Professional forestry mulching in ${countyData.name}, Florida. ${countyData.projects} projects completed in ${countyData.city} area. Expert DBH selective clearing, eco-friendly mulch finish. Get your free AI-powered estimate today.`,
    alternates: {
      canonical: `https://treeai.us/treeshop/locations/county/${slug}`
    },
    openGraph: {
      title: `Forestry Mulching ${countyData.name} - TreeAI Services`,
      description: `Professional land clearing and forestry mulching services in ${countyData.name}, Florida. ${countyData.projects} completed projects.`,
      url: `https://treeai.us/treeshop/locations/county/${slug}`,
      type: 'website'
    }
  };
}

export default async function CountyPage({ params }: { params: CountyParams }) {
  const { slug } = await params;
  const countyData = FLORIDA_COUNTIES[slug];
  
  if (!countyData) {
    notFound();
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How much does forestry mulching cost in ${countyData.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Forestry mulching in ${countyData.name} typically ranges from $300-800 per acre depending on vegetation density and DBH package selected. Our AI-powered estimator provides accurate pricing based on your specific property conditions.`
        }
      },
      {
        "@type": "Question",
        "name": `Do I need permits for land clearing in ${countyData.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Permits in ${countyData.name} are handled through ${countyData.permits}. ${countyData.regulations}. We help navigate the permitting process and ensure compliance with local regulations.`
        }
      },
      {
        "@type": "Question",
        "name": `What vegetation types can you mulch in ${countyData.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `We specialize in ${countyData.vegetation} common to ${countyData.name}. Our selective DBH packages (4\", 6\", 8\", 10\") allow precise control over what gets cleared while preserving valuable trees.`
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-green-900 to-green-700 text-white py-20">
          <div className="absolute inset-0">
            <Image
              src="/treeshop/images/Land-Clearing-Excavator-Dramatic.jpg"
              alt={`Forestry mulching equipment in ${countyData.name}`}
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Forestry Mulching in <span className="text-green-300">{countyData.name}</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
                Professional land clearing and forestry mulching services in {countyData.city} and throughout {countyData.name}, Florida
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/estimate"
                  className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors"
                >
                  Get Free {countyData.name} Estimate
                </Link>
                <Link
                  href="#projects"
                  className="border border-green-300 hover:bg-green-800 text-green-300 hover:text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors"
                >
                  View Local Projects
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* County Stats */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">{countyData.projects}</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div className="p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">{countyData.avgAcreage}</div>
                <div className="text-gray-600">Average Acres</div>
              </div>
              <div className="p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">{countyData.population}</div>
                <div className="text-gray-600">Population Served</div>
              </div>
              <div className="p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">7 Days</div>
                <div className="text-gray-600">Average Start Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Serving All of {countyData.name}
            </h2>
            <div className="prose max-w-4xl mx-auto text-lg text-gray-700 mb-8">
              <p>{countyData.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-green-700 mb-4">Local Vegetation</h3>
                <p className="text-gray-600 mb-4">
                  Our equipment is optimized for {countyData.name}'s native species:
                </p>
                <ul className="text-gray-700 space-y-2">
                  {countyData.vegetation.split(', ').map((plant, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">🌿</span>
                      {plant}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-green-700 mb-4">Permits & Regulations</h3>
                <p className="text-gray-600 mb-4">
                  We handle compliance with {countyData.name} requirements:
                </p>
                <div className="text-gray-700 space-y-3">
                  <div>
                    <strong>Permit Office:</strong> {countyData.permits}
                  </div>
                  <div>
                    <strong>Key Regulations:</strong> {countyData.regulations}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {countyData.name} Forestry Services
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🌲</div>
                <h3 className="text-xl font-semibold mb-3">Selective DBH Clearing</h3>
                <p className="text-gray-600">Choose exactly what gets cleared with our 4\", 6\", 8\", or 10\" DBH packages</p>
              </div>
              
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="text-xl font-semibold mb-3">Site Preparation</h3>
                <p className="text-gray-600">Build-ready land clearing for residential and commercial development</p>
              </div>
              
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🌿</div>
                <h3 className="text-xl font-semibold mb-3">Eco-Friendly Mulching</h3>
                <p className="text-gray-600">Organic mulch finish improves soil health and prevents erosion</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Clear Your {countyData.name} Property?
            </h2>
            <p className="text-xl mb-8">
              Get an AI-powered estimate in minutes. Local expertise, transparent pricing, fast scheduling.
            </p>
            <Link
              href="/estimate"
              className="bg-white text-green-700 hover:bg-gray-100 font-bold px-8 py-4 rounded-lg text-lg transition-colors inline-block"
            >
              Get Your Free {countyData.name} Estimate
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}