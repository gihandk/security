import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/admin/bookings').then(res => setBookings(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/bookings/${id}`, { status });
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const filtered = filter ? bookings.filter(b => b.status === filter) : bookings;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
        <div className="flex gap-2">
          {['', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${filter === s ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Guest</th>
              <th className="px-4 py-3 text-left">Destination</th>
              <th className="px-4 py-3 text-left">Dates</th>
              <th className="px-4 py-3 text-left">Guests</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{b.user.name}</p>
                  <p className="text-gray-400 text-xs">{b.user.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{b.destination.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {format(new Date(b.checkIn), 'MMM d')} – {format(new Date(b.checkOut), 'MMM d, yy')}
                </td>
                <td className="px-4 py-3 text-gray-600">{b.guests}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">${b.totalPrice.toFixed(0)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[b.status]}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select value={b.status} onChange={e => updateStatus(b.id, e.target.value)}
                    className="text-xs border rounded px-2 py-1">
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirm</option>
                    <option value="COMPLETED">Complete</option>
                    <option value="CANCELLED">Cancel</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8">No bookings found.</p>}
      </div>
    </AdminLayout>
  );
}
