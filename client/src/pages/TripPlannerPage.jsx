import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function TripPlannerPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState({ title: '', startDate: '', endDate: '', notes: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/trips').then(res => setTrips(res.data));
  }, [user]);

  const createTrip = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/trips', form);
      setTrips(t => [res.data, ...t]);
      setForm({ title: '', startDate: '', endDate: '', notes: '' });
      setShowForm(false);
      toast.success('Trip created!');
    } catch {
      toast.error('Failed to create trip');
    }
  };

  const deleteTrip = async (id) => {
    try {
      await api.delete(`/trips/${id}`);
      setTrips(t => t.filter(trip => trip.id !== id));
      toast.success('Trip deleted');
    } catch {
      toast.error('Failed to delete trip');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Trip Plans</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + New Trip
        </button>
      </div>

      {showForm && (
        <form onSubmit={createTrip} className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
          <h2 className="font-bold text-gray-800">Plan a New Trip</h2>
          <input placeholder="Trip title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded-lg px-3 py-2" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Start Date</label>
              <input type="date" required value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">End Date</label>
              <input type="date" required value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
          </div>
          <textarea placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 h-20 resize-none" />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Create Trip</button>
        </form>
      )}

      {trips.length === 0 ? (
        <p className="text-gray-500">No trips yet. Click "New Trip" to start planning!</p>
      ) : (
        <div className="space-y-4">
          {trips.map(trip => (
            <div key={trip.id} className="bg-white rounded-xl shadow p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-bold text-gray-800 text-lg">{trip.title}</h2>
                  <p className="text-sm text-gray-500">
                    {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
                  </p>
                  {trip.notes && <p className="text-sm text-gray-500 mt-1">{trip.notes}</p>}
                </div>
                <button onClick={() => deleteTrip(trip.id)} className="text-red-400 text-sm hover:text-red-600">Delete</button>
              </div>

              {trip.items.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Itinerary</h3>
                  {trip.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 text-sm text-gray-700 py-1">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">Day {item.dayNumber}</span>
                      <span>{item.destination.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
