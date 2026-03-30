import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect } from 'react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/destinations', label: 'Destinations', icon: '🗺️' },
  { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
  { path: '/admin/blog', label: 'Blog', icon: '✍️' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/newsletter', label: 'Newsletter', icon: '📧' },
];

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) navigate('/login');
    else if (user.role !== 'ADMIN') navigate('/');
  }, [user]);

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-700">
          <Link to="/" className="text-white font-bold text-lg">TravelApp</Link>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-gray-700">
          <Link to="/" className="text-xs text-gray-400 hover:text-white">← Back to site</Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
