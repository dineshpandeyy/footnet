import React, { useState } from 'react';
// ... rest of the file content remains the same 

const DiscussionForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      title: '',
      content: '',
      image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          setError('Image size should be less than 5MB');
          return;
        }
        setFormData({ ...formData, image: file });
        // Create preview URL
        setImagePreview(URL.createObjectURL(file));
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.title.trim() || !formData.content.trim()) {
        setError('Please fill in all required fields');
        return;
      }
      
      // Create FormData object to handle file upload
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('content', formData.content.trim());
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      onSubmit(submitData);
      setFormData({ title: '', content: '', image: null });
      setImagePreview(null);
      setError('');
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <input
          type="text"
          placeholder="Discussion Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="What's on your mind?"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full p-2 border rounded"
          rows="4"
          required
        />
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">
            Add an image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-40 rounded"
              />
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, image: null });
                  setImagePreview(null);
                }}
                className="text-red-500 text-sm mt-1"
              >
                Remove image
              </button>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Discussion
        </button>
      </form>
    );
  };
  
  export default DiscussionForm; 