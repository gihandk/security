import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api.js';
import { format } from 'date-fns';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/blog/${slug}`).then(res => setPost(res.data));
  }, [slug]);

  if (!post) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover rounded-xl mb-6" />}
      <div className="flex flex-wrap gap-2 mb-3">
        {post.tags.map(tag => (
          <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">{post.title}</h1>
      <p className="text-gray-400 text-sm mb-8">
        By {post.author.name} · {format(new Date(post.createdAt), 'MMMM d, yyyy')}
      </p>
      <div className="prose prose-gray max-w-none text-gray-700 whitespace-pre-line">
        {post.content}
      </div>
    </div>
  );
}
