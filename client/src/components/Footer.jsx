import { useState } from 'react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const subscribe = async (e) => {
    e.preventDefault();
    try {
      await api.post('/newsletter/subscribe', { email });
      toast.success('Subscribed to newsletter!');
      setEmail('');
    } catch {
      toast.error('Failed to subscribe');
    }
  };

  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-3">TravelApp</h3>
          <p className="text-sm">Discover amazing destinations, plan your trip, and book your stay.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/destinations" className="hover:text-white">Explore Destinations</a></li>
            <li><a href="/trips" className="hover:text-white">Trip Planner</a></li>
            <li><a href="/blog" className="hover:text-white">Travel Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Newsletter</h4>
          <form onSubmit={subscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-3 py-2 rounded bg-gray-700 text-white text-sm placeholder-gray-400 focus:outline-none"
            />
            <button type="submit" className="bg-blue-600 px-4 py-2 rounded text-white text-sm hover:bg-blue-700">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center text-xs py-4 text-gray-500">
        © {new Date().getFullYear()} TravelApp. All rights reserved.
      </div>
    </footer>
  );
}
