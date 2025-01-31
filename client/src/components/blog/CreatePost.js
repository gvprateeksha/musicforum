import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Form = styled.form`
  background: #2d1b36;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #ffd700;
  border-radius: 4px;
  color: white;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #ffd700;
  border-radius: 4px;
  color: white;
  min-height: 150px;
`;

const Button = styled.button`
  background: #ffd700;
  color: #2d1b36;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 1rem;
  
  &:hover {
    background: #ffed4a;
  }
`;

const CancelButton = styled(Button)`
  background: #ff6b6b;
  color: white;
  
  &:hover {
    background: #fa5252;
  }
`;

const CreatePost = ({ onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    tags: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to create a post');
        return;
      }

      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

      const response = await axios.post(
        'http://localhost:5000/api/blog',
        {
          ...formData,
          tags: tagsArray
        },
        {
          headers: { 'x-auth-token': token }
        }
      );

      onPostCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    }
  };

  return (
    <Modal>
      <Form onSubmit={handleSubmit}>
        <h2 style={{ color: '#ffd700', marginBottom: '1rem' }}>Create New Blog Post</h2>
        
        <Input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <TextArea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          required
        />

        <TextArea
          name="excerpt"
          placeholder="Excerpt (short description)"
          value={formData.excerpt}
          onChange={handleChange}
          required
          style={{ minHeight: '100px' }}
        />

        <Input
          type="url"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />

        <Input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleChange}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <CancelButton type="button" onClick={onClose}>
            Cancel
          </CancelButton>
          <Button type="submit">
            Create Post
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreatePost;
