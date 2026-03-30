import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '', slug: '', description: '', type: 'HOTEL',
  address: '', city: '', country: '', pricePerNight: '',
  images: '', amenities: '',
};

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null); // id being edited
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get('/destinations').then(res => setDestinations(res.data));
  }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setEditing(null); setShowForm(true); };

  const openEdit = (dest) => {
    setForm({
      ...dest,
      images: dest.images.join(', '),
      amenities: dest.amenities.join(', '),
      pricePerNight: dest.pricePerNight || '',
    });
    setEditing(dest.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean),
      pricePerNight: form.pricePerNight ? parseFloat(form.pricePerNight) : null,
    };
    try {
      if (editing) {
        const res = await api.put(`/destinations/${editing}`, payload);
        setDestinations(ds => ds.map(d => d.id === editing ? res.data : d));
        toast.success('Destination updated');
      } else {
        const res = await api.post('/destinations', payload);
        setDestinations(ds => [res.data, ...ds]);
        toast.success('Destination created');
      }
      setShowForm(false);
    } catch {
      toast.error('Failed to save destination');
    }
  };

  const deactivate = async (id) => {
    try {
      await api.delete(`/admin/destinations/${id}`);
      setDestinations(ds => ds.filter(d => d.id !== id));
      toast.success('Destination removed');
    } catch {
      toast.error('Failed to remove');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Destinations</h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Add Destination
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h2 className="md:col-span-2 font-bold text-gray-800">{editing ? 'Edit Destination' : 'New Destination'}</h2>
          {[
            { key: 'name', label: 'Name', span: false },
            { key: 'slug', label: 'Slug (url-friendly)', span: false },
            { key: 'city', label: 'City', span: false },
            { key: 'country', label: 'Country', span: false },
            { key: 'address', label: 'Address', span: false },
            { key: 'pricePerNight', label: 'Price per night ($)', span: false },
          ].map(({ key, label, span }) => (
            <div key={key} className={span ? 'md:col-span-2' : ''}>
              <label className="text-sm text-gray-600">{label}</label>
              <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
          ))}
          <div>
            <label className="text-sm text-gray-600">Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mt-1">
              <option>HOTEL</option>
              <option>CAMPSITE</option>
              <option>ATTRACTION</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Images (comma-separated URLs)</label>
            <input value={form.images} onChange={e => setForm({ ...form, images: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Amenities (comma-separated)</label>
            <input value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mt-1" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4} className="w-full border rounded-lg px-3 py-2 mt-1 resize-none" />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              {editing ? 'Save Changes' : 'Create'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border px-6 py-2 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Price/Night</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {destinations.map(dest => (
              <tr key={dest.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{dest.name}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{dest.type}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{dest.city}, {dest.country}</td>
                <td className="px-4 py-3 text-gray-700">{dest.pricePerNight ? `$${dest.pricePerNight}` : '—'}</td>
                <td className="px-4 py-3 flex gap-3">
                  <button onClick={() => openEdit(dest)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => deactivate(dest.id)} className="text-red-500 hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
