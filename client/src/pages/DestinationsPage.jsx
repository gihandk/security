import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api.js';

export default function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const type = searchParams.get('type') || '';

  useEffect(() => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (search) params.set('search', search);

    api.get(`/destinations?${params}`)
      .then(res => setDestinations(res.data))
      .finally(() => setLoading(false));
  }, [type, search]);

  const avgRating = (reviews) => {
    if (!reviews.length) return null;
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Explore Destinations</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Search destinations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {['', 'HOTEL', 'CAMPSITE', 'ATTRACTION'].map(t => (
          <button
            key={t}
            onClick={() => setSearchParams(t ? { type: t } : {})}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${type === t ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600 hover:border-blue-400'}`}
          >
            {t || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : destinations.length === 0 ? (
        <p className="text-gray-500">No destinations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map(dest => (
            <Link key={dest.id} to={`/destinations/${dest.slug}`} className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
              {dest.images[0] && (
                <img src={dest.images[0]} alt={dest.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <span className="text-xs font-semibold text-blue-600 uppercase">{dest.type}</span>
                <h2 className="text-lg font-bold text-gray-800 mt-1">{dest.name}</h2>
                <p className="text-gray-500 text-sm">{dest.city}, {dest.country}</p>
                <div className="flex items-center justify-between mt-3">
                  {dest.pricePerNight && (
                    <span className="font-semibold text-gray-800">${dest.pricePerNight}<span className="text-sm text-gray-400">/night</span></span>
                  )}
                  {avgRating(dest.reviews) && (
                    <span className="text-sm text-yellow-500">★ {avgRating(dest.reviews)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
