// components/DiagnosticsBlogSection.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBlogPostsByLocation, BlogPost } from "@/lib/blog";
import { Calendar, User, Eye, Heart, MessageSquare, ArrowRight, Loader2 } from "lucide-react";

const LOCATION = "Afilas Diagnosis Center";

export function DiagnosticsBlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const response = await getBlogPostsByLocation(LOCATION, { limit: 3 });
      if (response.success) {
        setBlogs(response.data);
      }
    } catch (error) {
      console.error("Failed to load blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/80 dark:bg-slate-900/50 border-t border-border">
      {/* Changed to explicit visible background color */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Diagnostic Insights
            </h2>
            <p className="text-lg text-foreground/70">
              Latest diagnostic news, research, and health screening updates
            </p>
          </div>
          <Link
            href="/blogs?location=diagnostics"
            className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white dark:bg-slate-800 border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
            >
              {/* Changed bg-card to bg-white dark:bg-slate-800 for visible card background */}
              <Link href={`/blogs/${blog.slug}`}>
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900/60 to-slate-900 flex items-center justify-center">
                      <span className="text-slate-400 text-sm font-semibold">{blog.category}</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-purple-600/90 text-white text-xs font-bold">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground line-clamp-2 hover:text-purple-600 transition-colors">
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