// frontend/src/components/HospitalDivision/HospitalBlogSection.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBlogPostsByLocation, BlogPost } from "@/lib/blog";
import { Calendar, User, Eye, Heart, MessageSquare, ArrowRight, Loader2 } from "lucide-react";

const LOCATION = "Afilas General Hospital";

export function HospitalBlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getBlogPostsByLocation(LOCATION, { limit: 3 });
      if (response.success) {
        setBlogs(response.data);
      } else {
        setError("Failed to load blog posts");
      }
    } catch (error) {
      console.error("Failed to load blogs:", error);
      setError("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{error}</p>
        <button onClick={loadBlogs} className="mt-2 text-blue-600 hover:underline">
          Try Again
        </button>
      </div>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Latest Health Articles
            </h2>
            <p className="text-lg text-foreground/70">
              Stay informed with our latest medical insights and health tips
            </p>
          </div>
          <Link
            href="/blogs?location=hospital"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
            >
              <Link href={`/blogs/${blog.slug}`}>
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900/60 to-slate-900 flex items-center justify-center">
                      <span className="text-slate-400 text-sm font-semibold">{blog.category}</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-blue-600/90 text-white text-xs font-bold">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold line-clamp-2 hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {blog.author || "Admin"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {blog.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {blog.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {blog.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}