import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import styles from "./blog-list.module.css";

function formatDisplayDate(dateStr?: string) {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-');
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    const dateObj = new Date(parsed);
    return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  return dateStr;
}

export default async function BlogListPage() {
  let blogs: any[] = [];
  try {
    const conn = await connectDB();
    if (conn) {
      const data = await Blog.find().sort({ createdAt: -1 }).lean();
      blogs = JSON.parse(JSON.stringify(data));
    }
  } catch (err) {
    console.error('⚠️ Blogs page: DB fetch failed:', (err as Error).message);
  }

  return (
    <main className={styles.blogPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Our Journal</span>
          <h1>Expert <em>Insights</em> & Digital Strategy</h1>
          <p>
            Explore our latest articles, guides, and news about digital marketing, 
            web design, and brand growth.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className={styles.blogGridSection}>
        <div className={styles.container}>
          {blogs.length === 0 ? (
            <div className={styles.noBlogs}>
              <h2>No articles available yet.</h2>
              <p>We are currently working on some amazing content for you. Stay tuned!</p>
              <Link href="/" className={styles.backBtn}>Back to Home</Link>
            </div>
          ) : (
            <div className={styles.grid}>
              {blogs.map((blog: any) => (
                <Link href={`/blogs/${blog.slug}`} key={blog._id} className={styles.blogCard}>
                  <div className={styles.imageWrap}>
                    <Image
                      src={blog.image || "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=600&auto=format&fit=crop"}
                      alt={blog.title || "Blog Image"}
                      fill
                      className={styles.image}
                    />
                    <span className={styles.category}>{blog.category}</span>
                  </div>
                  <div className={styles.content}>
                    <div className={styles.meta}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className={styles.dateText}>{formatDisplayDate(blog.date)}</span>
                    </div>
                    <h3 className={styles.title}>{blog.title}</h3>
                    <p className={styles.excerpt}>{blog.excerpt}</p>
                    <div className={styles.footer}>
                      <span className={styles.author}>By {blog.author}</span>
                      <span className={styles.readMore}>Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
