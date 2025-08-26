export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            TreeShop Professional Services
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Expert Tree Care in Florida
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-green-700 mb-3">
                Tree Removal
              </h2>
              <p className="text-gray-600">
                Safe and efficient tree removal services for any size property
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-green-700 mb-3">
                Land Clearing
              </h2>
              <p className="text-gray-600">
                Complete land clearing solutions for development and maintenance
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-green-700 mb-3">
                Emergency Services
              </h2>
              <p className="text-gray-600">
                24/7 emergency response for storm damage and hazardous trees
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <a 
              href="https://fltreeshop.com" 
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Get a Free Quote
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}