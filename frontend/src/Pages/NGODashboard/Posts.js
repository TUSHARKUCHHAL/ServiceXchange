import React, { useState, useEffect } from 'react';
import './Posts.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Simulated data fetch
  useEffect(() => {
    // This would be replaced with your actual API call
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          title: "Clean Water Initiative in Rural Communities",
          author: "Maria Johnson",
          organization: "Water For All",
          category: "environment",
          date: "2025-03-15",
          content: "Our team has successfully implemented clean water solutions in 5 rural communities this month...",
          image: "/api/placeholder/400/250",
          likes: 124,
          comments: 32
        },
        {
          id: 2,
          title: "Volunteer Opportunity: Teaching Computer Skills",
          author: "James Smith",
          organization: "Digital Access Foundation",
          category: "education",
          date: "2025-04-01",
          content: "We're looking for volunteers to teach basic computer skills in underserved communities...",
          image: "/api/placeholder/400/250",
          likes: 89,
          comments: 17
        },
        {
          id: 3,
          title: "COVID-19 Relief Fund: Progress Report",
          author: "Dr. Sarah Patel",
          organization: "Global Health Initiative",
          category: "healthcare",
          date: "2025-03-28",
          content: "Thanks to your generous donations, we've been able to provide medical supplies to...",
          image: "/api/placeholder/400/250",
          likes: 215,
          comments: 53
        },
        {
          id: 4,
          title: "Youth Mentorship Program Launches Next Month",
          author: "Robert Chen",
          organization: "Future Leaders",
          category: "education",
          date: "2025-04-05",
          content: "Our new mentorship program pairs industry professionals with high school students...",
          image: "/api/placeholder/400/250",
          likes: 76,
          comments: 21
        }
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const filterPosts = (category) => {
    setFilter(category);
  };

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category === filter);

  return (
    <div className="posts-container">
      <header className="posts-header">
        <h1>Community Updates</h1>
        <p>Stay connected with the latest initiatives, opportunities, and success stories from our partner organizations</p>
      </header>

      <div className="filter-container">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
          onClick={() => filterPosts('all')}
        >
          All Posts
        </button>
        <button 
          className={`filter-btn ${filter === 'environment' ? 'active' : ''}`} 
          onClick={() => filterPosts('environment')}
        >
          Environment
        </button>
        <button 
          className={`filter-btn ${filter === 'education' ? 'active' : ''}`} 
          onClick={() => filterPosts('education')}
        >
          Education
        </button>
        <button 
          className={`filter-btn ${filter === 'healthcare' ? 'active' : ''}`} 
          onClick={() => filterPosts('healthcare')}
        >
          Healthcare
        </button>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading latest posts...</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map(post => (
            <div className="post-card" key={post.id}>
              <div className="post-image">
                <img src={post.image} alt={post.title} />
                <div className="post-category">{post.category}</div>
              </div>
              <div className="post-content">
                <h2>{post.title}</h2>
                <div className="post-meta">
                  <span className="post-author">{post.author}</span>
                  <span className="post-org">{post.organization}</span>
                  <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <p className="post-excerpt">{post.content.substring(0, 100)}...</p>
                <div className="post-actions">
                  <button className="read-more">Read More</button>
                  <div className="post-stats">
                    <span><i className="heart-icon"></i> {post.likes}</span>
                    <span><i className="comment-icon"></i> {post.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="create-post-btn">
        <span>+</span>
      </div>
    </div>
  );
};

export default Posts;