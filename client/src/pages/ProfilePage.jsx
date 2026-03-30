import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          {user.name[0].toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
        <p className="text-gray-500 mb-2">{user.email}</p>
        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{user.role}</span>

        <div className="mt-8 flex justify-center gap-4">
          <a href="/bookings" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">My Bookings</a>
          <a href="/trips" className="border border-gray-300 px-5 py-2 rounded-lg hover:border-blue-400">My Trips</a>
        </div>

        <button onClick={() => { logout(); navigate('/'); }} className="mt-6 text-red-500 hover:underline text-sm">
          Sign Out
        </button>
      </div>
    </div>
  );
}
