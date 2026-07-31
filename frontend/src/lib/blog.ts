// lib/api/blog.ts
import { api } from './api';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  category: string;
  location: string;
  tags: string[];
  image?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  isPublished: boolean;
  publishedAt?: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  success: boolean;
  data: BlogPost[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// ===== PUBLIC API =====
export async function getBlogPosts(params?: {
  location?: string;
  category?: string;
  search?: string;
  limit?: number;
  page?: number;
  published?: boolean;
}): Promise<BlogResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.location) queryParams.append('location', params.location);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.published !== undefined) {
      queryParams.append('published', String(params.published));
    } else {
      queryParams.append('published', 'true');
    }

    const response = await api.get<any>(`/blog?${queryParams.toString()}`);
    
    // Handle different response formats
    let postsData: BlogPost[] = [];
    let pagination = { total: 0, page: 1, limit: 20, pages: 0 };

    if (response) {
      // If response is directly an array
      if (Array.isArray(response)) {
        postsData = response;
      } 
      // If response has data property
      else if (response.data && Array.isArray(response.data)) {
        postsData = response.data;
        if (response.pagination) {
          pagination = response.pagination;
        }
      } 
      // If response has posts property
      else if (response.posts && Array.isArray(response.posts)) {
        postsData = response.posts;
      }
      // If response has success and data
      else if (response.success && response.data && Array.isArray(response.data)) {
        postsData = response.data;
        if (response.pagination) {
          pagination = response.pagination;
        }
      }
    }

    return {
      success: true,
      data: postsData,
      pagination: pagination
    };
  } catch (error) {
    console.error('❌ Failed to fetch blog posts:', error);
    return { 
      success: false, 
      data: [], 
      pagination: { total: 0, page: 1, limit: 20, pages: 0 } 
    };
  }
}

export async function getBlogPostsByLocation(
  location: string, 
  params?: { limit?: number; page?: number }
): Promise<BlogResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.page) queryParams.append('page', String(params.page));

    const response = await api.get<any>(`/blog/location/${encodeURIComponent(location)}?${queryParams.toString()}`);
    
    let postsData: BlogPost[] = [];
    let pagination = { total: 0, page: 1, limit: 10, pages: 0 };

    if (response) {
      if (Array.isArray(response)) {
        postsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        postsData = response.data;
        if (response.pagination) {
          pagination = response.pagination;
        }
      } else if (response.posts && Array.isArray(response.posts)) {
        postsData = response.posts;
      } else if (response.success && response.data && Array.isArray(response.data)) {
        postsData = response.data;
        if (response.pagination) {
          pagination = response.pagination;
        }
      }
    }

    return {
      success: true,
      data: postsData,
      pagination: pagination
    };
  } catch (error) {
    console.error(`❌ Failed to fetch blogs for ${location}:`, error);
    return { 
      success: false, 
      data: [], 
      pagination: { total: 0, page: 1, limit: 10, pages: 0 } 
    };
  }
}

export async function getBlogPostsByCategory(
  category: string, 
  params?: { limit?: number; page?: number }
): Promise<BlogResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.page) queryParams.append('page', String(params.page));

    const response = await api.get<any>(`/blog/category/${encodeURIComponent(category)}?${queryParams.toString()}`);
    
    let postsData: BlogPost[] = [];
    let pagination = { total: 0, page: 1, limit: 10, pages: 0 };

    if (response) {
      if (Array.isArray(response)) {
        postsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        postsData = response.data;
        if (response.pagination) {
          pagination = response.pagination;
        }
      } else if (response.posts && Array.isArray(response.posts)) {
        postsData = response.posts;
      } else if (response.success && response.data && Array.isArray(response.data)) {
        postsData = response.data;
        if (response.pagination) {
          pagination = response.pagination;
        }
      }
    }

    return {
      success: true,
      data: postsData,
      pagination: pagination
    };
  } catch (error) {
    console.error(`❌ Failed to fetch blogs for category ${category}:`, error);
    return { 
      success: false, 
      data: [], 
      pagination: { total: 0, page: 1, limit: 10, pages: 0 } 
    };
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await api.get<any>(`/blog/slug/${slug}`);
    
    if (response) {
      // If response has data property
      if (response.data) {
        return response.data;
      }
      // If response is directly the post object
      if (response.id && response.title) {
        return response;
      }
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to fetch blog post:', error);
    return null;
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const response = await api.get<any>(`/blog/${id}`);
    
    if (response) {
      if (response.data) {
        return response.data;
      }
      if (response.id && response.title) {
        return response;
      }
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to fetch blog post:', error);
    return null;
  }
}

export async function likeBlogPost(id: string): Promise<{ likes: number } | null> {
  try {
    const response = await api.post<any>(`/blog/${id}/like`);
    
    if (response) {
      if (response.data) {
        return response.data;
      }
      if (response.likes !== undefined) {
        return response;
      }
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to like blog post:', error);
    return null;
  }
}

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
    : null;
}