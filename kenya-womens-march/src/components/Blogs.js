import React from 'react';

const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Power of Women's Collective Action in Kenya",
      excerpt: "How grassroots movements are transforming communities and creating lasting change across the country.",
      author: "Amina Ochieng",
      date: "March 15, 2024",
      category: "Advocacy",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Economic Empowerment: Stories from Rural Women",
      excerpt: "Meet the women who are breaking barriers and building sustainable businesses in rural Kenya.",
      author: "Sarah Muthoni",
      date: "March 10, 2024",
      category: "Empowerment",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Education as a Tool for Gender Equality",
      excerpt: "Exploring the critical role of education in advancing women's rights and opportunities.",
      author: "Fatima Hassan",
      date: "March 5, 2024",
      category: "Education",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "Women in Leadership: Breaking the Glass Ceiling",
      excerpt: "Celebrating the achievements of Kenyan women leaders and the path forward for future generations.",
      author: "Grace Wanjiku",
      date: "February 28, 2024",
      category: "Leadership",
      readTime: "8 min read"
    },
    {
      id: 5,
      title: "Mental Health and Women's Well-being",
      excerpt: "Addressing the unique mental health challenges faced by women and strategies for support.",
      author: "Dr. Mercy Kiprop",
      date: "February 20, 2024",
      category: "Health",
      readTime: "10 min read"
    },
    {
      id: 6,
      title: "Digital Literacy: Bridging the Gender Gap",
      excerpt: "How technology is empowering women and creating new opportunities in the digital age.",
      author: "Linda Akinyi",
      date: "February 15, 2024",
      category: "Technology",
      readTime: "6 min read"
    }
  ];

  const categories = ["All", "Advocacy", "Empowerment", "Education", "Leadership", "Health", "Technology"];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Our Blog
          </h1>
          <p className="text-lg text-text max-w-3xl mx-auto">
            Stories, insights, and perspectives from our community of women leaders, 
            activists, and changemakers across Kenya.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className="px-6 py-2 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-accent flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-6xl text-primary font-bold mb-2">📝</div>
                  <p className="text-primary font-semibold">Featured Article</p>
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {blogPosts[0].category}
                  </span>
                  <span className="text-accent ml-4">{blogPosts[0].readTime}</span>
                </div>
                <h2 className="text-2xl font-bold text-primary mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-text mb-4">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-accent font-semibold">{blogPosts[0].author}</p>
                    <p className="text-text text-sm">{blogPosts[0].date}</p>
                  </div>
                  <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent hover:text-primary transition-colors duration-200">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-accent flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl text-primary mb-2">📖</div>
                  <p className="text-primary font-semibold">Blog Post</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-accent text-primary px-2 py-1 rounded text-xs font-semibold">
                    {post.category}
                  </span>
                  <span className="text-accent text-sm ml-3">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-text mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-accent font-semibold text-sm">{post.author}</p>
                    <p className="text-text text-xs">{post.date}</p>
                  </div>
                  <button className="text-primary hover:text-accent font-semibold text-sm transition-colors duration-200">
                    Read More →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-primary rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-accent mb-6">
            Subscribe to our newsletter to receive the latest articles and updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-accent transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs; 