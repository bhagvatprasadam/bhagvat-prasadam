import { apiGet } from './apiClient.js';

/**
 * Fetch all blogs
 */
export async function getBlogs() {
  const response = await apiGet('/cms/blogs');
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Fetch blog posts by blog handle with pagination
 */
export async function getBlogPosts(handle = 'news', { page = 1 } = {}) {
  const response = await apiGet(`/cms/blogs/${encodeURIComponent(handle)}?page=${page}`);
  return {
    blog: response.data || {},
    posts: Array.isArray(response.data?.posts) ? response.data.posts : [],
    pagination: response.pagination || {
      page,
      total: response.data?.posts?.length || 0
    }
  };
}

/**
 * Fetch single blog post by slug
 */
export async function getBlogPost(slug) {
  const response = await apiGet(`/cms/posts/${encodeURIComponent(slug)}`);
  return response.data || null;
}
