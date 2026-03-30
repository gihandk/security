import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function BookingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/bookings').then(res => setBookings(res.data));
  }, [user]);

  const cancel = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
      toast.success('Booking cancelled');
    } catch {
      toast.error('Failed to cancel');
    }
  };

  const statusColor = { PENDING: 'yellow', CONFIRMED: 'green', CANCELLED: 'red', COMPLETED: 'gray' };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet. <a href="/destinations" className="text-blue-600 hover:underline">Browse destinations</a></p>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.id} className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-800">{b.destination.name}</h2>
                <p className="text-sm text-gray-500">
                  {format(new Date(b.checkIn), 'MMM d')} – {format(new Date(b.checkOut), 'MMM d, yyyy')} · {b.guests} guest(s)
                </p>
                <p className="text-sm font-semibold text-gray-700 mt-1">${b.totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-${statusColor[b.status]}-100 text-${statusColor[b.status]}-700`}>
                  {b.status}
                </span>
                {b.status === 'PENDING' && (
                  <button onClick={() => cancel(b.id)} className="text-red-500 text-sm hover:underline">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
