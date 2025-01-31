import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import CreatePost from './blog/CreatePost';

const BlogContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const CreatePostSection = styled.div`
  background: rgba(45, 27, 54, 0.9);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CreateButton = styled.button`
  background: #ffd700;
  color: #2d1b36;
  padding: 1rem 2rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #ffed4a;
  }
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const PostCard = styled.div`
  background: rgba(45, 27, 54, 0.8);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s;
  position: relative;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const PostContent = styled.div`
  padding: 1.5rem;
`;

const PostTitle = styled.h3`
  color: #ffd700;
  margin: 0 0 1rem 0;
`;

const PostExcerpt = styled.p`
  color: #fff;
  margin: 0 0 1rem 0;
  line-height: 1.6;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const PostAuthor = styled.span`
  color: #ffd700;
`;

const LikeButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: ${props => (props.liked ? '#ff0000' : '#ffffff')};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:focus {
    outline: none;
  }
`;

const CommentSection = styled.div`
  margin-top: 2rem;
  color: #fff;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #ffd700;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const CommentButton = styled.button`
  background: #ffd700;
  color: #2d1b36;
  padding: 1rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #ffed4a;
  }
`;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blog');
      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error loading blog posts');
      setLoading(false);
    }
  };

  const handlePostClick = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/blog/${postId}`);
      setSelectedPost(response.data);
      setComments(Array.isArray(response.data.comments) ? response.data.comments : []);
    } catch (error) {
      console.error('Error fetching post details', error);
    }
  };

  const handleLikeToggle = async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to like a post');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/blog/${postId}/like`,
        {},
        { headers: { 'x-auth-token': token } }
      );

      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost(response.data);
      }

      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: response.data.likes } : post
      ));
    } catch (err) {
      console.error('Error liking the post', err);
      alert('Error liking the post. Please try again.');
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to comment');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/blog/${postId}/comment`,
        { comment: newComment },
        { headers: { 'x-auth-token': token } }
      );

      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost(response.data);
        setComments(response.data.comments);
      }
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment', err);
      alert('Error adding comment. Please try again.');
    }
  };

  const handleCreateClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to create a post');
      return;
    }
    setShowCreatePost(true);
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setShowCreatePost(false);
  };

  const renderLikes = (post) => {
    const liked = currentUserId && post.likes && post.likes.includes(currentUserId);
    return (
      <div>
        <LikeButton 
          liked={liked} 
          onClick={(e) => {
            e.stopPropagation();
            handleLikeToggle(post._id);
          }}
        >
          {liked ? '❤️' : '🤍'}
        </LikeButton>
        <span style={{ marginLeft: '5px' }}>
          {post.likes ? post.likes.length : 0} Likes
        </span>
      </div>
    );
  };

  const renderComments = () => {
    return comments.map((comment) => (
      <div key={comment._id} style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(0,0,0,0.2)' }}>
        <strong>{comment.user?.username || 'Anonymous'}: </strong>
        <span>{comment.text}</span>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>
          {new Date(comment.date).toLocaleDateString()}
        </div>
      </div>
    ));
  };

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <BlogContainer>
      <CreatePostSection>
        <CreateButton onClick={handleCreateClick}>
          Create New Blog Post
        </CreateButton>
        {user && <span style={{ color: '#ffd700' }}>Welcome!!!</span>}
      </CreatePostSection>

      {!selectedPost ? (
        <PostGrid>
          {posts.map((post) => (
            <PostCard key={post._id} onClick={() => handlePostClick(post._id)}>
              <PostImage src={post.image} alt={post.title} />
              <PostContent>
                <PostTitle>{post.title}</PostTitle>
                <PostExcerpt>{post.excerpt}</PostExcerpt>
                <PostMeta>
                  <span>By <PostAuthor>{post.author?.username || 'Anonymous'}</PostAuthor></span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </PostMeta>
                {renderLikes(post)}
              </PostContent>
            </PostCard>
          ))}
        </PostGrid>
      ) : (
        <div>
          <PostTitle>{selectedPost.title}</PostTitle>
          <PostImage src={selectedPost.image} alt={selectedPost.title} />
          <PostContent>{selectedPost.content}</PostContent>
          <div>
            {renderLikes(selectedPost)}
          </div>
          <CommentSection>
            <h4>Comments ({comments.length})</h4>
            <div>
              {renderComments()}
            </div>
            <CommentInput
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <CommentButton onClick={() => handleAddComment(selectedPost._id)}>
              Add Comment
            </CommentButton>
          </CommentSection>
        </div>
      )}

      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </BlogContainer>
  );
};

export default Blog;
