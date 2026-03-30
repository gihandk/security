import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import api from '../../services/api.js';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
      <div className={`text-3xl w-14 h-14 flex items-center justify-center rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      {!stats ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard label="Total Users" value={stats.users} icon="👥" color="bg-blue-100" />
          <StatCard label="Destinations" value={stats.destinations} icon="🗺️" color="bg-green-100" />
          <StatCard label="Bookings" value={stats.bookings} icon="📅" color="bg-yellow-100" />
          <StatCard label="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} icon="💰" color="bg-purple-100" />
          <StatCard label="Newsletter Subscribers" value={stats.subscribers} icon="📧" color="bg-pink-100" />
        </div>
      )}
    </AdminLayout>
  );
}
