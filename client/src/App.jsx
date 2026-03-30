import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import DestinationsPage from './pages/DestinationsPage.jsx';
import DestinationDetailPage from './pages/DestinationDetailPage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import TripPlannerPage from './pages/TripPlannerPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminDestinations from './pages/admin/AdminDestinations.jsx';
import AdminBookings from './pages/admin/AdminBookings.jsx';
import AdminBlog from './pages/admin/AdminBlog.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminNewsletter from './pages/admin/AdminNewsletter.jsx';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/trips" element={<TripPlannerPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/destinations" element={<AdminDestinations />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/newsletter" element={<AdminNewsletter />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
