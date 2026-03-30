import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function DestinationDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dest, setDest] = useState(null);
  const [booking, setBooking] = useState({ checkIn: '', checkOut: '', guests: 1 });
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    api.get(`/destinations/${slug}`).then(res => setDest(res.data));
  }, [slug]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      await api.post('/bookings', { destinationId: dest.id, ...booking });
      toast.success('Booking confirmed!');
      navigate('/bookings');
    } catch {
      toast.error('Booking failed');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      const res = await api.post('/reviews', { destinationId: dest.id, ...review });
      setDest(d => ({ ...d, reviews: [...d.reviews, res.data] }));
      toast.success('Review submitted!');
      setReview({ rating: 5, comment: '' });
    } catch {
      toast.error('Failed to submit review');
    }
  };

  if (!dest) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const avgRating = dest.reviews.length
    ? (dest.reviews.reduce((s, r) => s + r.rating, 0) / dest.reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {dest.images[0] && (
        <img src={dest.images[0]} alt={dest.name} className="w-full h-72 object-cover rounded-xl mb-6" />
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase">{dest.type}</span>
          <h1 className="text-3xl font-bold text-gray-800">{dest.name}</h1>
          <p className="text-gray-500">{dest.city}, {dest.country}</p>
          {avgRating && <p className="text-yellow-500 mt-1">★ {avgRating} ({dest.reviews.length} reviews)</p>}
        </div>
        {dest.pricePerNight && (
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-800">${dest.pricePerNight}</span>
            <span className="text-gray-400 text-sm"> / night</span>
          </div>
        )}
      </div>

      <p className="text-gray-600 mb-8">{dest.description}</p>

      {/* Booking form */}
      {dest.type !== 'ATTRACTION' && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Book this place</h2>
          <form onSubmit={handleBook} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600">Check-in</label>
              <input type="date" required value={booking.checkIn} onChange={e => setBooking({ ...booking, checkIn: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Check-out</label>
              <input type="date" required value={booking.checkOut} onChange={e => setBooking({ ...booking, checkOut: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Guests</label>
              <input type="number" min="1" value={booking.guests} onChange={e => setBooking({ ...booking, guests: parseInt(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <button type="submit" className="md:col-span-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Book Now
            </button>
          </form>
        </div>
      )}

      {/* Reviews */}
      <div>
        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        {dest.reviews.map(r => (
          <div key={r.id} className="bg-white rounded-lg shadow p-4 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-700">{r.user.name}</span>
              <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
            </div>
            <p className="text-gray-600 text-sm">{r.comment}</p>
          </div>
        ))}

        {user && (
          <form onSubmit={handleReview} className="bg-white rounded-xl shadow p-6 mt-4">
            <h3 className="font-semibold mb-3">Leave a Review</h3>
            <div className="mb-3">
              <label className="text-sm text-gray-600">Rating</label>
              <select value={review.rating} onChange={e => setReview({ ...review, rating: parseInt(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2 mt-1">
                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <textarea value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })}
              placeholder="Share your experience..." required
              className="w-full border rounded-lg px-3 py-2 mb-3 h-24 resize-none" />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
