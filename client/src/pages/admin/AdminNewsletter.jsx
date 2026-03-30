import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import api from '../../services/api.js';
import { format } from 'date-fns';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    api.get('/admin/newsletter').then(res => setSubscribers(res.data));
  }, []);

  const exportCSV = () => {
    const csv = ['Email,Subscribed At', ...subscribers.map(s => `${s.email},${s.subscribedAt}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'subscribers.csv'; a.click();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Newsletter Subscribers</h1>
        <button onClick={exportCSV} className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
          Export CSV
        </button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscribers.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{s.email}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{format(new Date(s.subscribedAt), 'MMM d, yyyy')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && <p className="text-center text-gray-400 py-8">No subscribers yet.</p>}
      </div>
      <p className="mt-4 text-sm text-gray-500">Total: {subscribers.length} subscriber(s)</p>
    </AdminLayout>
  );
}
