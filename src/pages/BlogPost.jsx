import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ChevronRight, ArrowLeft, RefreshCw, BookOpen, Share2 } from 'lucide-react';
import * as blogApi from '../api/blogApi.js';
import SafeImage from '../components/SafeImage.jsx';

export default function BlogPost() {
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPost() {
      if (!postSlug) return;
      try {
        setLoading(true);
        const data = await blogApi.getBlogPost(postSlug);
        if (data) {
          setPost(data);
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        console.error('Failed to load blog post:', err);
        setError(err.message || 'Failed to load article.');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [postSlug]);

  const handleShare = async () => {
    const url = window.location.href;
    const title = post?.title || 'Bhagvat Prasadam Blog';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  if (loading) {
    return (
      <div className="py-24 bg-stone-50 min-h-[70vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-maroon" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="py-20 bg-stone-50 min-h-[70vh] flex items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-3xl border border-stone-200">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-stone-900 mb-2">Article Not Found</h2>
          <p className="text-xs text-stone-500 mb-6">The sacred article you are looking for is unavailable.</p>
          <Link
            to="/blogs"
            className="inline-block bg-brand-maroon text-white font-bold text-xs py-3 px-6 rounded-full hover:bg-brand-maroon-dark transition-colors"
          >
            Back to All Blogs
          </Link>
        </div>
      </div>
    );
  }

  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  return (
    <div className="py-10 bg-stone-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-6">
          <div className="flex items-center gap-2">
            <Link to="/blogs" className="hover:text-brand-maroon flex items-center gap-1 font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Blogs</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-stone-900 font-bold truncate max-w-xs">{post.title}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Article Container */}
        <article className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs">
          {dateStr && (
            <div className="flex items-center gap-2 text-xs text-stone-400 font-semibold mb-3">
              <Calendar className="w-4 h-4 text-brand-maroon" />
              <span>{dateStr}</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 leading-tight mb-6 font-heading">
            {post.title}
          </h1>

          {post.image_url && (
            <div className="rounded-2xl overflow-hidden mb-8 aspect-[16/9] bg-stone-100">
              <SafeImage
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Body Content */}
          <div
            className="prose prose-stone max-w-none text-stone-700 text-sm sm:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer Back Button */}
          <div className="pt-8 mt-10 border-t border-stone-100 flex justify-between items-center">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-maroon hover:text-brand-maroon-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all articles</span>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
