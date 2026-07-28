// app/admin/blog/afilas-general/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  X,
  Hospital,
  Clock,
  User,
  Tag,
  Eye,
  Edit,
  Save,
  AlertCircle,
  Image as ImageIcon,
  Video,
  Calendar,
  Heart,
  MessageSquare,
  BookOpen,
  Search,
  ChevronDown,
  Upload,
  Play
} from 'lucide-react';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  category: string;
  location: string;
  tags: string[];
  image?: string;
  videoUrl?: string;
  mediaType: 'image' | 'video';
  isPublished: boolean;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  location: string;
  tags: string[];
  image: string;
  videoUrl: string;
  mediaType: 'image' | 'video';
  isPublished: boolean;
}

const LOCATION = 'Afilas General Hospital';
const CATEGORIES = [
  'Medical News',
  'Health Tips',
  'Research',
  'Patient Stories',
  'Events',
  'Announcements',
  'Wellness',
  'Technology',
  'Education',
  'Community'
];

export default function AdminBlogAfilasGeneralPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    location: LOCATION,
    tags: [],
    image: '',
    videoUrl: '',
    mediaType: 'image',
    isPublished: false
  });
  const [tagInput, setTagInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadPosts() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<any>(`/blog?location=${encodeURIComponent(LOCATION)}`, true);
      
      let postsData: BlogPost[] = [];
      if (response) {
        if (Array.isArray(response)) {
          postsData = response;
        } else if (response.data && Array.isArray(response.data)) {
          postsData = response.data;
        } else if (response.posts && Array.isArray(response.posts)) {
          postsData = response.posts;
        }
      }
      
      setPosts(postsData);
      console.log(`✅ Loaded ${postsData.length} blog posts for ${LOCATION}`);
    } catch (error: any) {
      console.error('❌ Failed to load blog posts:', error);
      setError(error.message || 'Failed to load blog posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setFormData({ 
          ...formData, 
          mediaType: 'image', 
          videoUrl: '' 
        });
        setVideoPreview('');
        setVideoUrlInput('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUrlChange = (url: string) => {
    setVideoUrlInput(url);
    if (url.trim()) {
      setVideoPreview(url);
      setFormData({ 
        ...formData, 
        videoUrl: url, 
        mediaType: 'video' 
      });
      setPreviewImage('');
      setImageFile(null);
    } else {
      setVideoPreview('');
      setFormData({ ...formData, videoUrl: '', mediaType: 'image' });
    }
  };

  // FIXED: Updated uploadImage function with correct field name
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file); // Must match backend: upload.single('image')
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('http://localhost:5000/api/upload?type=blog', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      console.log('📡 Upload response:', data);
      
      if (!response.ok) {
        console.error('Upload error response:', data);
        throw new Error(data.error || data.message || 'Upload failed');
      }
      
      return data.url;
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error;
    }
  };

  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        category: post.category,
        location: post.location,
        tags: post.tags || [],
        image: post.image || '',
        videoUrl: post.videoUrl || '',
        mediaType: post.mediaType || 'image',
        isPublished: post.isPublished
      });
      setPreviewImage(post.image || '');
      setVideoPreview(post.videoUrl || '');
      setVideoUrlInput(post.videoUrl || '');
      setImageFile(null);
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        location: LOCATION,
        tags: [],
        image: '',
        videoUrl: '',
        mediaType: 'image',
        isPublished: false
      });
      setPreviewImage('');
      setVideoPreview('');
      setVideoUrlInput('');
      setImageFile(null);
      setTagInput('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setError('');
    setTagInput('');
    setImageFile(null);
    setPreviewImage('');
    setVideoPreview('');
    setVideoUrlInput('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUploadingMedia(true);
    
    if (!formData.title.trim()) {
      setError('Title is required');
      setUploadingMedia(false);
      return;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      setUploadingMedia(false);
      return;
    }
    if (!formData.excerpt.trim()) {
      setError('Excerpt is required');
      setUploadingMedia(false);
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      setUploadingMedia(false);
      return;
    }
    if (!formData.mediaType) {
      setError('Please select either Image or Video');
      setUploadingMedia(false);
      return;
    }
    if (formData.mediaType === 'image' && !formData.image && !imageFile) {
      setError('Please upload an image');
      setUploadingMedia(false);
      return;
    }
    if (formData.mediaType === 'video' && !formData.videoUrl) {
      setError('Please enter a video URL');
      setUploadingMedia(false);
      return;
    }

    try {
      let imageUrl = formData.image;
      let videoUrl = formData.videoUrl;
      let mediaType = formData.mediaType;

      if (imageFile && formData.mediaType === 'image') {
        try {
          const uploadedUrl = await uploadImage(imageFile);
          imageUrl = uploadedUrl;
          mediaType = 'image';
        } catch (uploadError) {
          setError('Failed to upload image. Please try again.');
          setUploadingMedia(false);
          return;
        }
      }

      if (formData.mediaType === 'video') {
        videoUrl = formData.videoUrl;
        mediaType = 'video';
      }

      const submitData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        location: formData.location,
        tags: formData.tags,
        image: mediaType === 'image' ? imageUrl : '',
        videoUrl: mediaType === 'video' ? videoUrl : '',
        author: 'Admin',
        authorId: 'admin-id'
      };

      if (editingPost) {
        await api.put(`/blog/${editingPost.id}`, submitData, true);
        setSuccess('Blog post updated successfully!');
      } else {
        await api.post('/blog', submitData, true);
        setSuccess('Blog post created successfully!');
      }
      handleCloseModal();
      await loadPosts();
    } catch (error: any) {
      console.error('❌ Failed to save blog post:', error);
      setError(error.message || 'Failed to save blog post');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await api.delete(`/blog/${id}`, true);
      setSuccess('Blog post deleted successfully!');
      await loadPosts();
    } catch (error: any) {
      console.error('❌ Failed to delete blog post:', error);
      setError(error.message || 'Failed to delete blog post');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/blog/${id}`, { isPublished: !currentStatus }, true);
      setSuccess(`Blog post ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
      await loadPosts();
    } catch (error: any) {
      console.error('❌ Failed to toggle publish status:', error);
      setError(error.message || 'Failed to update blog post status');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? post.category === categoryFilter : true;
    const matchesStatus = statusFilter ? 
      (statusFilter === 'published' ? post.isPublished : !post.isPublished) : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Medical News': 'bg-blue-100 text-blue-700',
      'Health Tips': 'bg-green-100 text-green-700',
      'Research': 'bg-purple-100 text-purple-700',
      'Patient Stories': 'bg-pink-100 text-pink-700',
      'Events': 'bg-orange-100 text-orange-700',
      'Announcements': 'bg-yellow-100 text-yellow-700',
      'Wellness': 'bg-teal-100 text-teal-700',
      'Technology': 'bg-indigo-100 text-indigo-700',
      'Education': 'bg-cyan-100 text-cyan-700',
      'Community': 'bg-rose-100 text-rose-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-clinical-900 flex items-center gap-3">
            <Hospital className="w-8 h-8 text-blue-600" />
            Blog - {LOCATION}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all blog posts and articles for {LOCATION}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={loadPosts}
            className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 text-sm transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Blog Post
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="text-sm text-gray-500">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-600">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto">
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-gray-500">Loading blog posts...</p>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center p-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No blog posts found</p>
            <p className="text-xs text-gray-400 mt-1">
              {searchTerm || categoryFilter || statusFilter ? 
                'Try adjusting your filters' : 
                'Click "New Blog Post" to create your first post'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-wrap gap-6">
                  {post.image && (
                    <div className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {post.videoUrl && !post.image && (
                    <div className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-black relative flex items-center justify-center">
                      <Play className="w-12 h-12 text-white/50" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(post.category)}`}>
                            {post.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {post.isPublished ? 'Published' : 'Draft'}
                          </span>
                          {post.videoUrl && (
                            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              Video
                            </span>
                          )}
                          {post.image && !post.videoUrl && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              Image
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mt-1">{truncateText(post.excerpt, 150)}</p>
                        
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {post.likes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {post.comments || 0}
                          </span>
                        </div>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Tag className="w-3 h-3 text-gray-400" />
                            {post.tags.map(tag => (
                              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleTogglePublish(post.id, post.isPublished)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            post.isPublished
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {post.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleOpenModal(post)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && filteredPosts.length > 0 && (
        <div className="mt-4 text-xs text-gray-400">
          Showing {filteredPosts.length} blog post{filteredPosts.length !== 1 ? 's' : ''} from {LOCATION}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter blog post title"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Brief summary of the blog post"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  rows={8}
                  placeholder="Write your blog post content here... (supports HTML)"
                  required
                />
              </div>

              {/* Media Selection - Required */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Media Type * <span className="text-xs text-red-500">(Required)</span>
                </label>
                
                <div className="flex gap-2 mb-4 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, mediaType: 'image', videoUrl: '' });
                      setVideoPreview('');
                      setVideoUrlInput('');
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      formData.mediaType === 'image'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, mediaType: 'video' });
                      setPreviewImage('');
                      setImageFile(null);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      formData.mediaType === 'video'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    Video
                  </button>
                </div>

                {/* Image Upload */}
                {formData.mediaType === 'image' && (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      {previewImage ? (
                        <div className="relative">
                          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={previewImage}
                              alt="Image preview"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage('');
                              setImageFile(null);
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <p className="text-sm text-gray-500 mt-2">Click to change image</p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload an image
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            JPG, PNG, GIF, WEBP (max 10MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Video URL Only */}
                {formData.mediaType === 'video' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Video URL (YouTube, Vimeo, or direct link) *
                      </label>
                      <input
                        type="url"
                        value={videoUrlInput}
                        onChange={(e) => handleVideoUrlChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://www.youtube.com/watch?v=..."
                        required={formData.mediaType === 'video'}
                      />
                    </div>

                    {videoPreview && (
                      <div className="border border-gray-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Video Preview</p>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                          <video
                            src={videoPreview}
                            controls
                            className="w-full h-full"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoPreview('');
                            setVideoUrlInput('');
                            setFormData({ ...formData, videoUrl: '', mediaType: 'image' });
                          }}
                          className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Remove video
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Publish immediately</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingMedia}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {uploadingMedia ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingPost ? 'Update Post' : 'Create Post'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}