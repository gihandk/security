import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Explore the World</h1>
        <p className="text-xl text-blue-100 mb-8 max-w-xl mx-auto">
          Discover hotels, campsites, and attractions. Plan your perfect trip.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/destinations" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50">
            Browse Destinations
          </Link>
          <Link to="/trips" className="border border-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Plan a Trip
          </Link>
        </div>
      </section>

      {/* Category cards */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What are you looking for?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Hotels', type: 'HOTEL', emoji: '🏨', desc: 'Comfortable stays around the world' },
            { label: 'Campsites', type: 'CAMPSITE', emoji: '⛺', desc: 'Connect with nature' },
            { label: 'Attractions', type: 'ATTRACTION', emoji: '🗺️', desc: 'Explore must-see places' },
          ].map(({ label, type, emoji, desc }) => (
            <Link
              key={type}
              to={`/destinations?type=${type}`}
              className="bg-white rounded-xl shadow p-8 text-center hover:shadow-md transition"
            >
              <div className="text-5xl mb-3">{emoji}</div>
              <h3 className="text-xl font-semibold text-gray-800">{label}</h3>
              <p className="text-gray-500 mt-1 text-sm">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Blog teaser */}
      <section className="bg-gray-100 py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Travel Stories</h2>
        <p className="text-gray-500 mb-6">Get inspired by our latest travel blog posts.</p>
        <Link to="/blog" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Read the Blog
        </Link>
      </section>
    </div>
  );
}
