import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import styles from "./blog-list.module.css";

export const revalidate = 60; 

export default async function BlogListPage() {
  await connectDB();

  const data = await Blog.find().sort({ createdAt: -1 }).lean();
  const blogs = JSON.parse(JSON.stringify(data));

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
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className={styles.image}
                    />
                    <span className={styles.category}>{blog.category}</span>
                  </div>
                  <div className={styles.content}>
                    <div className={styles.meta}>
                      <span>{blog.date}</span>
                      <span className={styles.dot}></span>
                      <span>{blog.readTime}</span>
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
