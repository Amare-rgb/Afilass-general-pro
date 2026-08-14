// app/blogs/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { getBlogPosts, BlogPost, getYouTubeEmbedUrl } from "@/lib/blog";
import {
  Search,
  Tag,
  Eye,
  Heart,
  MessageSquare,
  Play,
  Calendar,
  User,
  MapPin,
  X,
  Sparkles,
  ArrowRight,
  Filter,
  Loader2,
} from "lucide-react";

export default function BlogsPage() {
  return (
    <Suspense fallback={<BlogsLoadingFallback />}>
      <BlogsContent />
    </Suspense>
  );
}

function BlogsLoadingFallback() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </main>
    </div>
  );
}

function BlogsContent() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location");

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>(
    locationParam ? getLocationFromParam(locationParam) : "All"
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeModalBlog, setActiveModalBlog] = useState<BlogPost | null>(null);
  const [likedBlogIds, setLikedBlogIds] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState("");
  const [commentsMap, setCommentsMap] = useState<Record<string, Array<{ author: string; text: string; date: string }>>>({});

  function getLocationFromParam(param: string): string {
    const map: { [key: string]: string } = {
      hospital: "Afilas General Hospital",
      diagnostics: "Afilas Diagnosis Center",
      pharma: "Afilas Drug Manufacturing",
    };
    return map[param] || "All";
  }

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBlogPosts({ published: true });
      if (response.success) {
        setBlogs(response.data || []);
      } else {
        setError("Failed to load blogs. Please try again.");
        setBlogs([]);
      }
    } catch (error) {
      console.error("Failed to load blogs:", error);
      setError("Failed to load blogs. Please try again later.");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(blogs.map(b => b.category)));
  const locations = Array.from(new Set(blogs.map(b => b.location)));

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = searchQuery.trim() === "" ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    const matchesLocation = selectedLocation === "All" || blog.location === selectedLocation;
    const matchesTag = !selectedTag || blog.tags.includes(selectedTag);
    return matchesSearch && matchesCategory && matchesLocation && matchesTag;
  });

  const featuredBlog = blogs.find(b => b.videoUrl || b.image) || blogs[0];

  const handleToggleLike = (e: React.MouseEvent, blogId: string) => {
    e.stopPropagation();
    const isLiked = likedBlogIds[blogId];
    setLikedBlogIds(prev => ({ ...prev, [blogId]: !isLiked }));
    setBlogs(prev => prev.map(b =>
      b.id === blogId ? { ...b, likes: isLiked ? b.likes - 1 : b.likes + 1 } : b
    ));
    if (activeModalBlog && activeModalBlog.id === blogId) {
      setActiveModalBlog(prev => prev ? { ...prev, likes: isLiked ? prev.likes - 1 : prev.likes + 1 } : null);
    }
  };

  const handleOpenBlog = (blog: BlogPost) => {
    setActiveModalBlog(blog);
    setBlogs(prev => prev.map(b =>
      b.id === blog.id ? { ...b, views: b.views + 1 } : b
    ));
  };

  const handleAddComment = (e: React.FormEvent, blogId: string) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const commentObj = {
      author: "You",
      text: newCommentText.trim(),
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setCommentsMap(prev => ({
      ...prev,
      [blogId]: [...(prev[blogId] || []), commentObj],
    }));
    setBlogs(prev => prev.map(b =>
      b.id === blogId ? { ...b, comments: b.comments + 1 } : b
    ));
    if (activeModalBlog && activeModalBlog.id === blogId) {
      setActiveModalBlog(prev => prev ? { ...prev, comments: prev.comments + 1 } : null);
    }
    setNewCommentText("");
  };

  // Render error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="text-center px-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">Oops! Something went wrong</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => loadBlogs()}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 sm:pt-36 pb-32 sm:pb-40 bg-gradient-to-b from-teal-700 via-teal-800 to-teal-900 dark:from-teal-950 dark:via-teal-900 dark:to-slate-950">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-12 left-[8%] w-72 h-72 rounded-full bg-teal-400/20 blur-3xl" />
            <div className="absolute bottom-16 right-[12%] w-96 h-96 rounded-full bg-teal-300/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-teal-500/10 blur-[120px]" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-xs font-semibold uppercase tracking-wider border border-white/20 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Afilas Group Newsroom</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                Health & Medical Blog
              </h1>
              <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
                Latest news, health tips, and insights from our medical experts
              </p>
              <div className="pt-6 max-w-2xl mx-auto">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-white/70 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white/15 dark:bg-slate-900/60 backdrop-blur-md border border-white/25 text-white placeholder:text-white/70 shadow-2xl focus:outline-none focus:ring-2 focus:ring-white/40 transition-all text-sm sm:text-base"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-4 text-white/70 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="xMidYMax slice" className="relative block w-full h-[80px] sm:h-[120px]">
              <path d="M0,25 C150,85 350,-20 600,55 C850,130 1050,15 1200,35 L1200,120 L0,120 Z" className="fill-background" />
            </svg>
          </div>
        </section>

        {/* Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-border pb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Categories:
              </span>
              <button
                onClick={() => { setSelectedCategory("All"); setSelectedTag(null); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === "All"
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setSelectedTag(null); }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Locations:
              </span>
              <button
                onClick={() => setSelectedLocation("All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedLocation === "All"
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {locations.map(loc => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedLocation === loc
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {loc.replace("Afilas ", "")}
                </button>
              ))}
            </div>
          </div>
          {selectedTag && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Filtered by tag:</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-400 text-xs font-semibold">
                #{selectedTag}
                <button onClick={() => setSelectedTag(null)} className="ml-1 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
        </section>

        {/* Featured Blog */}
        {!loading && !error && selectedCategory === "All" && selectedLocation === "All" && !searchQuery && !selectedTag && featuredBlog && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="relative rounded-3xl overflow-hidden bg-card border border-border shadow-xl grid md:grid-cols-12 gap-0 group">
              <div className="md:col-span-7 relative min-h-[300px] md:min-h-[420px] bg-slate-900 flex items-center justify-center">
                {featuredBlog.image ? (
                  <img src={featuredBlog.image} alt={featuredBlog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-8 text-center">
                    <Sparkles className="w-16 h-16 text-teal-400/40 mb-4 animate-pulse" />
                    <span className="text-slate-400 text-sm font-medium">Afilas Group Highlight</span>
                  </div>
                )}
                {featuredBlog.videoUrl && (
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center">
                    <button onClick={() => handleOpenBlog(featuredBlog)} className="w-20 h-20 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-teal-500 transition-all duration-300">
                      <Play className="w-8 h-8 ml-1 fill-current" />
                    </button>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-teal-600 text-white text-xs font-bold shadow-md">Featured</span>
                  {featuredBlog.videoUrl && (
                    <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-md flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current" /> Video
                    </span>
                  )}
                </div>
              </div>
              <div className="md:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-teal-600 dark:text-teal-400">{featuredBlog.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      {featuredBlog.location}
                    </span>
                  </div>
                  <h2 onClick={() => handleOpenBlog(featuredBlog)} className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer transition-colors">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{featuredBlog.excerpt}</p>
                </div>
                <div className="pt-6 border-t border-border mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-xs">
                      {featuredBlog.author?.charAt(0) || "A"}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{featuredBlog.author || "Admin"}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(featuredBlog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleOpenBlog(featuredBlog)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-all shadow-md hover:shadow-teal-600/30">
                    {featuredBlog.videoUrl ? "Watch Video" : "Read More"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-foreground">
              {loading ? "Loading..." : `${filteredBlogs.length} ${filteredBlogs.length === 1 ? "Article" : "Articles"} Found`}
            </h2>
            {(searchQuery || selectedCategory !== "All" || selectedLocation !== "All" || selectedTag) && (
              <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedLocation("All"); setSelectedTag(null); }} className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                Clear Filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border p-8">
              <p className="text-muted-foreground text-lg mb-4">No blog posts found</p>
              <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedLocation("All"); setSelectedTag(null); }} className="px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold text-sm">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => {
                const isLiked = likedBlogIds[blog.id];
                return (
                  <article key={blog.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      <div onClick={() => handleOpenBlog(blog)} className="relative h-48 w-full bg-slate-900 overflow-hidden cursor-pointer">
                        {blog.image ? (
                          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-teal-900/60 to-slate-900 flex items-center justify-center p-6 text-center">
                            <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase">{blog.category}</span>
                          </div>
                        )}
                        {blog.videoUrl && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 ml-0.5 fill-current" />
                            </div>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-1 rounded-md bg-teal-600/90 backdrop-blur-md text-white text-[10px] font-bold tracking-wide">{blog.category}</span>
                          {blog.videoUrl && (
                            <span className="px-2 py-1 rounded-md bg-red-600/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                              <Play className="w-2.5 h-2.5 fill-current" /> Video
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <MapPin className="w-3 h-3 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span className="truncate">{blog.location}</span>
                        </div>
                        <h3 onClick={() => handleOpenBlog(blog)} className="text-lg font-bold text-foreground line-clamp-2 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">{blog.excerpt}</p>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {blog.tags.slice(0, 3).map((tag) => (
                              <button key={tag} onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); }} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 text-[10px] font-medium">
                                #{tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-6 pt-0 border-t border-border/50 mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{blog.views}</span>
                        <button onClick={(e) => handleToggleLike(e, blog.id)} className={`flex items-center gap-1 transition-colors ${isLiked ? "text-red-500 font-bold" : "hover:text-foreground"}`}>
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />{blog.likes}
                        </button>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{blog.comments}</span>
                      </div>
                      <button onClick={() => handleOpenBlog(blog)} className="text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1 text-xs">
                        Read More <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Blog Modal */}
      {activeModalBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md">
          <div className="bg-card border border-border w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
            <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-400 text-xs font-bold">{activeModalBlog.category}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">• {activeModalBlog.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={(e) => handleToggleLike(e, activeModalBlog.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-xs font-medium transition-colors ${likedBlogIds[activeModalBlog.id] ? "bg-red-500/10 border-red-500/30 text-red-500" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground"}`}>
                  <Heart className={`w-3.5 h-3.5 ${likedBlogIds[activeModalBlog.id] ? "fill-current" : ""}`} />
                  <span>{activeModalBlog.likes}</span>
                </button>
                <button onClick={() => setActiveModalBlog(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">{activeModalBlog.title}</h1>
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground pt-2 border-b border-border pb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />{activeModalBlog.author || "Admin"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />{new Date(activeModalBlog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{activeModalBlog.views} views</span>
                  </div>
                </div>
              </div>
              {activeModalBlog.videoUrl && (
                <div className="space-y-2">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-border shadow-lg">
                    {getYouTubeEmbedUrl(activeModalBlog.videoUrl) ? (
                      <iframe src={getYouTubeEmbedUrl(activeModalBlog.videoUrl)!} title={activeModalBlog.title} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white">
                        <Play className="w-12 h-12 text-teal-400 mb-2" />
                        <p className="text-sm">Video URL: {activeModalBlog.videoUrl}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!activeModalBlog.videoUrl && activeModalBlog.image && (
                <div className="rounded-2xl overflow-hidden border border-border max-h-[400px]">
                  <img src={activeModalBlog.image} alt={activeModalBlog.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4 rounded-xl bg-teal-500/10 dark:bg-teal-950/30 border border-teal-500/20 text-teal-900 dark:text-teal-200 text-sm sm:text-base font-medium italic">
                "{activeModalBlog.excerpt}"
              </div>
              <div className="prose dark:prose-invert max-w-none text-foreground/90 space-y-4 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {activeModalBlog.content || (
                  <p>Medical advancements and research at {activeModalBlog.location} continuously elevate the benchmark of health care. This article provides essential insights into {activeModalBlog.category.toLowerCase()} methodologies, safety protocols, and clinical effectiveness.</p>
                )}
              </div>
              {activeModalBlog.tags && activeModalBlog.tags.length > 0 && (
                <div className="pt-6 border-t border-border flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground mr-2">Tags:</span>
                  {activeModalBlog.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium">#{tag}</span>
                  ))}
                </div>
              )}
              <div className="pt-8 border-t border-border space-y-6">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Comments ({activeModalBlog.comments})
                </h3>
                <form onSubmit={(e) => handleAddComment(e, activeModalBlog.id)} className="space-y-3">
                  <textarea rows={3} value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} placeholder="Share your thoughts..." className="w-full p-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
                  <div className="flex justify-end">
                    <button type="submit" className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-all shadow-md">
                      Submit Comment
                    </button>
                  </div>
                </form>
                <div className="space-y-3 pt-2">
                  {commentsMap[activeModalBlog.id] && commentsMap[activeModalBlog.id].length > 0 ? (
                    commentsMap[activeModalBlog.id].map((c, i) => (
                      <div key={i} className="p-4 rounded-xl bg-card border border-border space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-teal-600 dark:text-teal-400">{c.author}</span>
                          <span className="text-muted-foreground">{c.date}</span>
                        </div>
                        <p className="text-sm text-foreground">{c.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No comments yet. Be the first to share your thoughts!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}