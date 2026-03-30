import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const EMPTY_FORM = { title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: '', published: false };

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get('/admin/blog').then(res => setPosts(res.data));
  }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setEditing(null); setShowForm(true); };

  const openEdit = (post) => {
    setForm({ ...post, tags: post.tags.join(', ') });
    setEditing(post.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (editing) {
        const res = await api.put(`/admin/blog/${editing}`, payload);
        setPosts(ps => ps.map(p => p.id === editing ? res.data : p));
        toast.success('Post updated');
      } else {
        const res = await api.post('/blog', payload);
        setPosts(ps => [res.data, ...ps]);
        toast.success('Post created');
      }
      setShowForm(false);
    } catch {
      toast.error('Failed to save post');
    }
  };

  const togglePublish = async (post) => {
    try {
      const res = await api.put(`/admin/blog/${post.id}`, { published: !post.published });
      setPosts(ps => ps.map(p => p.id === post.id ? res.data : p));
      toast.success(res.data.published ? 'Published' : 'Unpublished');
    } catch {
      toast.error('Failed');
    }
  };

  const deletePost = async (id) => {
    try {
      await api.delete(`/admin/blog/${id}`);
      setPosts(ps => ps.filter(p => p.id !== id));
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blog Posts</h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + New Post
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
          <h2 className="font-bold text-gray-800">{editing ? 'Edit Post' : 'New Post'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Title</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Slug</label>
              <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Tags (comma-separated)</label>
              <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Cover Image URL</label>
              <input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Excerpt</label>
            <textarea required value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
              rows={2} className="w-full border rounded-lg px-3 py-2 mt-1 resize-none" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Content</label>
            <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
              rows={10} className="w-full border rounded-lg px-3 py-2 mt-1 resize-none font-mono text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
            <label htmlFor="published" className="text-sm text-gray-600">Publish immediately</label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              {editing ? 'Save Changes' : 'Create Post'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border px-6 py-2 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Author</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{post.title}</td>
                <td className="px-4 py-3 text-gray-500">{post.author.name}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{format(new Date(post.createdAt), 'MMM d, yyyy')}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button onClick={() => openEdit(post)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => togglePublish(post)} className="text-gray-500 hover:underline">
                    {post.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => deletePost(post.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="text-center text-gray-400 py-8">No posts yet.</p>}
      </div>
    </AdminLayout>
  );
}
