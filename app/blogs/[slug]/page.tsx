import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const blog = await Blog.findOne({ slug }).lean() as any;
  
  if (!blog) return { title: 'Blog Not Found' };

  return {
    title: blog.metaTitle || `${blog.title} | Blog | G Digital India`,
    description: blog.metaDescription || blog.excerpt,
    keywords: blog.metaKeywords || blog.category,
  };
}

export const dynamic = 'force-dynamic'

async function getBlog(slug: string) {
  try {
    await connectDB()
    const blog = await Blog.findOne({ slug })
    return blog ? JSON.parse(JSON.stringify(blog)) : null
  } catch (error) {
    console.error('Error fetching blog:', error)
    return null
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  // A plain-HTML renderer approach since we allow HTML in the admin panel
  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent }
  }

  return (
    <article className="blog-inner" style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '120px 20px 60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#888', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <Link href="/" style={{ color: '#aaa', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/blogs" style={{ color: '#aaa', textDecoration: 'none' }}>Blogs</Link>
          <span>/</span>
          <span style={{ color: '#fff' }}>{blog.category}</span>
        </div>

        {/* Header */}
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.2, fontWeight: 700, margin: '0 0 20px 0', fontFamily: 'var(--font-satoshi, sans-serif)' }}>
            {blog.title}
          </h1>
          <p style={{ fontSize: '18px', color: '#aaa', lineHeight: 1.6, margin: '0 0 30px 0' }}>
            {blog.excerpt}
          </p>

          {/* Meta Information */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderTop: '1px solid #222', borderBottom: '1px solid #222' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              ✒️
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px' }}>{blog.author}</div>
              <div style={{ fontSize: '13px', color: '#888' }}>
                {blog.date} <span style={{ margin: '0 6px' }}>•</span> {blog.readTime}
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {blog.image && (
          <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', marginBottom: '40px' }}>
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}

        {/* Blog Content */}
        <div 
          className="blog-content prose prose-invert"
          style={{ fontSize: '18px', lineHeight: 1.8, color: '#e5e5e5' }}
        >
          {blog.content ? (
            <div dangerouslySetInnerHTML={createMarkup(blog.content)} />
          ) : (
            <p style={{ color: '#aaa', fontStyle: 'italic' }}>This blog post does not have full content yet. Read the excerpt above to understand the main idea.</p>
          )}
        </div>

        <style>{`
          .blog-content h1, .blog-content h2, .blog-content h3 {
            color: #fff;
            margin-top: 2em;
            margin-bottom: 0.5em;
            line-height: 1.3;
          }
          .blog-content h2 { font-size: 28px; }
          .blog-content h3 { font-size: 24px; }
          .blog-content p {
            margin-bottom: 1.5em;
            overflow-wrap: break-word;
            word-wrap: break-word;
            word-break: break-word;
          }
          .blog-content a {
            color: #4f46e5;
            text-decoration: underline;
          }
          .blog-content ul, .blog-content ol {
            margin-bottom: 1.5em;
            padding-left: 20px;
          }
          .blog-content li {
            margin-bottom: 0.5em;
          }
          .blog-content blockquote {
            border-left: 4px solid #4f46e5;
            padding-left: 20px;
            font-style: italic;
            color: #ccc;
            margin: 2em 0;
            background: #111;
            padding: 20px;
            border-radius: 0 8px 8px 0;
          }
        `}</style>
      </div>
    </article>
  )
}
