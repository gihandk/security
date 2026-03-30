import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">TravelApp</Link>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/destinations" className="hover:text-blue-600">Explore</Link>
          <Link to="/trips" className="hover:text-blue-600">Trip Planner</Link>
          <Link to="/blog" className="hover:text-blue-600">Blog</Link>

          {user ? (
            <>
              <Link to="/bookings" className="hover:text-blue-600">My Bookings</Link>
              <Link to="/profile" className="hover:text-blue-600">{user.name}</Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-purple-700">Admin</Link>
              )}
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
