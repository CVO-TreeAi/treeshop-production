import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Customer Reviews & Testimonials | Tree Shop Central Florida',
  description: 'Read real reviews from 500+ satisfied customers across Central Florida. TreeShop provides professional land clearing, forestry mulching, and stump grinding services.',
  keywords: 'tree shop reviews, land clearing testimonials, forestry mulching reviews, Central Florida tree service, customer testimonials',
}

const allTestimonials = [
  {
    id: 1,
    quote: "In my 25 years in business, I have never experienced such a great service when dealing with a service provider",
    author: "Cajina",
    location: "Central Florida",
    service: "Land Clearing",
    rating: 5,
    category: "Exceptional Service"
  },
  {
    id: 2,
    quote: "The Tree Shop is one of the best businesses I have ever dealt with",
    author: "Snowden",
    location: "Central Florida",
    service: "Forestry Mulching",
    rating: 5,
    category: "Exceptional Service"
  },
  {
    id: 3,
    quote: "I've run across a truly exceptional company!",
    author: "SeaQ",
    location: "Central Florida",
    service: "Multiple Services",
    rating: 5,
    category: "Exceptional Service"
  },
  {
    id: 4,
    quote: "Every piece of my work from the first phone call to post the work done was extraordinary!",
    author: "Dolcimascolo",
    location: "Central Florida",
    service: "Land Clearing",
    rating: 5,
    category: "Outstanding Professional Team"
  },
  {
    id: 5,
    quote: "The tree shop was exceptional!!! They explained the whole process clearly",
    author: "Heiman",
    location: "Central Florida",
    service: "Forestry Mulching",
    rating: 5,
    category: "Outstanding Professional Team"
  },
  {
    id: 6,
    quote: "You couldn't go wrong with this company? very reliable on time communicated with us the whole time",
    author: "Mendez",
    location: "Central Florida",
    service: "Stump Grinding",
    rating: 5,
    category: "Outstanding Professional Team"
  },
  {
    id: 7,
    quote: "Lacey was very helpful with providing details regarding mulching my land and the process",
    author: "Blue",
    location: "Central Florida",
    service: "Forestry Mulching",
    rating: 5,
    category: "Outstanding Professional Team"
  },
  {
    id: 8,
    quote: "I saw their work on YouTube and thought why not... I'm so glad I did",
    author: "Thomas",
    location: "Central Florida",
    service: "Land Clearing",
    rating: 5,
    category: "Quality & Reliability"
  },
  {
    id: 9,
    quote: "We look for local family owned businesses to work with and Lacey and Jeremiah are great to work with",
    author: "Scott-Poulin",
    location: "Central Florida",
    service: "Multiple Services",
    rating: 5,
    category: "Quality & Reliability"
  },
  {
    id: 10,
    quote: "The service was by far the most professional and helpful. Very cost efficient and fair. Forever customer!",
    author: "Brown",
    location: "Central Florida",
    service: "Land Clearing",
    rating: 5,
    category: "Quality & Reliability"
  },
  {
    id: 11,
    quote: "Lacey and Jeremiah are wonderful to work with... They deserve 10 Stars",
    author: "Nelson",
    location: "Central Florida",
    service: "Forestry Mulching",
    rating: 5,
    category: "Highly Recommended"
  },
  {
    id: 12,
    quote: "The people at Tree Shop were a pleasure to work with",
    author: "Lippincott",
    location: "Central Florida",
    service: "Stump Grinding",
    rating: 5,
    category: "Highly Recommended"
  },
  {
    id: 13,
    quote: "I hired tree shop and they were amazing",
    author: "Lancaster",
    location: "Central Florida",
    service: "Land Clearing",
    rating: 5,
    category: "Highly Recommended"
  },
  {
    id: 14,
    quote: "They were on time and did exactly what we discussed",
    author: "Rhodes",
    location: "Central Florida",
    service: "Forestry Mulching",
    rating: 5,
    category: "Highly Recommended"
  },
  {
    id: 15,
    quote: "The Tree Shop did an amazing job! They were fair priced and showed up on time",
    author: "Singley",
    location: "Central Florida",
    service: "Land Clearing",
    rating: 5,
    category: "Exceptional Results"
  },
  {
    id: 16,
    quote: "The Tree Shop company is old school friendly like family",
    author: "Leao",
    location: "Central Florida",
    service: "Multiple Services",
    rating: 5,
    category: "Exceptional Results"
  },
  {
    id: 17,
    quote: "Great company! They performed a great job clearing my property and they did it quick",
    author: "Aixala",
    location: "Central Florida",
    service: "Land Clearing",
    rating: 5,
    category: "Exceptional Results"
  },
  {
    id: 18,
    quote: "Jeremiah and Lacey, very helpful. Responding to all my questions and needs great team",
    author: "Cortes",
    location: "Central Florida",
    service: "Forestry Mulching",
    rating: 5,
    category: "Exceptional Results"
  },
  {
    id: 19,
    quote: "I would give 10 stars if I could, but I can only give 5. Excellent company, excellent staff",
    author: "Millos",
    location: "Central Florida",
    service: "Stump Grinding",
    rating: 5,
    category: "Exceptional Results"
  },
  {
    id: 20,
    quote: "This company is amazing and the people they employ are the nicest and most honest humans",
    author: "Symphorien-Saavedra",
    location: "Central Florida",
    service: "Multiple Services",
    rating: 5,
    category: "Exceptional Results"
  }
]

const categories = [
  "Exceptional Service",
  "Outstanding Professional Team",
  "Quality & Reliability",
  "Highly Recommended",
  "Exceptional Results"
]

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Customer Reviews & <span className="text-green-500">Testimonials</span>
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Read what our satisfied customers have to say about TreeShop's professional land clearing,
            forestry mulching, and stump grinding services across Central Florida.
          </p>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-500 mb-2">$2M</div>
              <div className="text-white">Insurance Coverage</div>
            </div>
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-500 mb-2">24/7</div>
              <div className="text-white">Emergency Service</div>
            </div>
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-500 mb-2">CAT</div>
              <div className="text-white">Professional Equipment</div>
            </div>
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-500 mb-2">FL</div>
              <div className="text-white">Licensed & Bonded</div>
            </div>
          </div>
        </div>
      </section>

      {/* About TreeShop Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                About <span className="text-green-500">TreeShop</span>
              </h2>
              <div className="space-y-4 text-white">
                <p>
                  TreeShop is Central Florida's premier land clearing and forestry services company,
                  founded with a vision to transform the tree care industry through professionalism,
                  innovation, and exceptional customer service.
                </p>
                <p>
                  Led by founders <strong className="text-green-400">Lacey and Jeremiah</strong>,
                  our family-owned business has grown from humble beginnings to become the most
                  trusted name in professional land management across Central Florida.
                </p>
                <p>
                  What sets TreeShop apart is our commitment to transparency, fair pricing, and
                  treating every customer like family. We believe in doing the job right the first time,
                  which is why 98% of our customers rate us 5 stars and many become "forever customers."
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                  <h3 className="font-bold text-green-500 mb-2">Our Mission</h3>
                  <p className="text-sm text-white">
                    To provide professional, reliable, and cost-effective land clearing services
                    while building lasting relationships with our customers.
                  </p>
                </div>
                <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
                  <h3 className="font-bold text-green-500 mb-2">Our Values</h3>
                  <p className="text-sm text-white">
                    Honesty, professionalism, fair pricing, and treating every customer
                    with the respect they deserve.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6 text-green-500">Why Customers Choose TreeShop</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Family-Owned Business:</strong> Personal attention and care you won't get from big corporations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Professional Equipment:</strong> CAT machinery and modern tools for efficient, clean work</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Transparent Pricing:</strong> No hidden fees, fair estimates, competitive rates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Licensed & Insured:</strong> Fully licensed, bonded, and insured up to $2M</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Clear Communication:</strong> Regular updates throughout your project</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Quality Guarantee:</strong> We stand behind our work and your satisfaction</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews by Category */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Real <span className="text-green-500">Customer Reviews</span>
          </h2>

          {categories.map((category, categoryIndex) => {
            const categoryReviews = allTestimonials.filter(t => t.category === category)

            return (
              <div key={category} className="mb-16">
                <h3 className="text-2xl font-bold mb-8 text-green-500 text-center">
                  {category}
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryReviews.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 hover:border-green-800/50 transition-colors"
                    >
                      {/* Star Rating */}
                      <div className="flex text-yellow-500 mb-4">
                        {Array.from({ length: testimonial.rating }, (_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>

                      {/* Quote */}
                      <blockquote className="text-white mb-4 italic">
                        "{testimonial.quote}"
                      </blockquote>

                      {/* Author Info */}
                      <div className="border-t border-gray-800 pt-4">
                        <div className="text-green-500 font-bold">- {testimonial.author}</div>
                        <div className="text-gray-400 text-sm">{testimonial.location}</div>
                        <div className="text-green-400 text-sm font-medium mt-1">
                          Service: {testimonial.service}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-900/50 to-green-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Join Our <span className="text-green-400">Happy Customers?</span>
          </h2>
          <p className="text-xl text-white mb-8">
            Experience the TreeShop difference for yourself. Get your free estimate today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/landing/target1#estimate-form"
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Free Estimate
            </Link>
            <a
              href="tel:3868435266"
              className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300"
            >
              Call: (386) 843-5266
            </a>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/articles" className="text-green-400 hover:text-green-300 text-sm font-medium">
              Read Our Articles →
            </Link>
            <Link href="/tech" className="text-green-400 hover:text-green-300 text-sm font-medium">
              Learn About TreeAI →
            </Link>
            <Link href="/videos" className="text-green-400 hover:text-green-300 text-sm font-medium">
              Watch Project Videos →
            </Link>
          </div>

          <div className="mt-6 text-green-400 text-sm">
            ✓ No obligation • ✓ Same day response • ✓ Licensed & insured
          </div>
        </div>
      </section>

      {/* Services Summary */}
      <section className="py-12 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Our <span className="text-green-500">Services</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-black/50 p-6 rounded-lg border border-gray-800 text-center">
              <h3 className="text-xl font-bold mb-3 text-green-500">Forestry Mulching</h3>
              <p className="text-white text-sm mb-4">
                Eco-friendly land clearing that grinds vegetation into beneficial mulch layer.
              </p>
              <a href="/services/forestry-mulching" className="text-green-400 hover:text-green-300 text-sm font-medium">
                Learn More →
              </a>
            </div>

            <div className="bg-black/50 p-6 rounded-lg border border-gray-800 text-center">
              <h3 className="text-xl font-bold mb-3 text-green-500">Land Clearing</h3>
              <p className="text-white text-sm mb-4">
                Complete removal of vegetation and debris for construction-ready sites.
              </p>
              <a href="/services/land-clearing" className="text-green-400 hover:text-green-300 text-sm font-medium">
                Learn More →
              </a>
            </div>

            <div className="bg-black/50 p-6 rounded-lg border border-gray-800 text-center">
              <h3 className="text-xl font-bold mb-3 text-green-500">Stump Grinding</h3>
              <p className="text-white text-sm mb-4">
                Professional stump removal with grinding, hauling, and site restoration options.
              </p>
              <a href="/services/stump-grinding" className="text-green-400 hover:text-green-300 text-sm font-medium">
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}