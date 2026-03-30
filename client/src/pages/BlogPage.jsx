import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { format } from 'date-fns';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blog').then(res => setPosts(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Travel Blog</h1>
      {loading ? <p className="text-gray-400">Loading...</p> : posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
              {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full h-44 object-cover" />}
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <h2 className="text-lg font-bold text-gray-800">{post.title}</h2>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{post.excerpt}</p>
                <p className="text-xs text-gray-400 mt-3">By {post.author.name} · {format(new Date(post.createdAt), 'MMM d, yyyy')}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
