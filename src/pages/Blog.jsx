import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, ArrowRight, BookOpen, ChevronRight, RefreshCw } from 'lucide-react';
import * as blogApi from '../api/blogApi.js';
import SafeImage from '../components/SafeImage.jsx';

export default function Blog() {
  const { handle: routeHandle } = useParams();
  const blogHandle = routeHandle || 'news';

  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function loadBlogData() {
      try {
        setLoading(true);
        // Load blogs list
        const blogList = await blogApi.getBlogs();
        setBlogs(blogList);

        // Load posts for active blog handle
        const postsData = await blogApi.getBlogPosts(blogHandle, { page });
        setCurrentBlog(postsData.blog);
        setPosts(postsData.posts || []);
        if (postsData.pagination?.totalPages) {
          setTotalPages(postsData.pagination.totalPages);
        }
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    }

    loadBlogData();
  }, [blogHandle, page]);

  return (
    <div className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-brand-maroon font-semibold">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-bold">Sacred Blogs & Wisdom</span>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 bg-brand-cream text-brand-maroon rounded-full text-xs font-black uppercase tracking-widest mb-2">
            Nilkanth Dham Wisdom
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 font-heading">
            {currentBlog?.title || 'Sacred Knowledge & Ayurvedic News'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Discover the divine traditions, health benefits of pure satvik food, and timeless spiritual wisdom.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-brand-maroon mx-auto mb-3" />
            <p className="text-xs text-stone-500 font-semibold">Loading sacred articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-stone-200 text-center max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-stone-800">No Articles Found</h3>
            <p className="text-xs text-stone-500 mt-1">Please check back soon for divine updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post, idx) => {
              const dateStr = post.published_at
                ? new Date(post.published_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })
                : 'Sacred Offering';

              return (
                <article
                  key={post.handle || post.id || idx}
                  className="bg-white rounded-2xl border border-stone-200/90 hover:border-stone-300 shadow-none hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {post.image_url && (
                      <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                        <SafeImage
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5 sm:p-6 space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] text-stone-400 font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </div>
                      <Link to={`/blog/${post.handle}`} className="block">
                        <h2 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-brand-maroon transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h2>
                      </Link>
                      {post.excerpt && (
                        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 pt-0">
                    <Link
                      to={`/blog/${post.handle}`}
                      className="inline-flex items-center gap-1.5 text-xs font-black text-brand-maroon hover:text-brand-maroon-dark uppercase tracking-wider transition-colors"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
