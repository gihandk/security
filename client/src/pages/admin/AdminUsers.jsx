import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data));
  }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const res = await api.put(`/admin/users/${user.id}/role`, { role: newRole });
      setUsers(us => us.map(u => u.id === user.id ? { ...u, role: res.data.role } : u));
      toast.success(`${user.name} is now ${newRole}`);
    } catch {
      toast.error('Failed to update role');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Users</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{format(new Date(user.createdAt), 'MMM d, yyyy')}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleRole(user)} className="text-blue-600 hover:underline text-xs">
                    Make {user.role === 'ADMIN' ? 'User' : 'Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
