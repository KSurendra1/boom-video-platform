import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideo } from '../../context/VideoContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { MAX_SHORT_VIDEO_SIZE, ALLOWED_VIDEO_FORMATS } from '../../config';

const VideoUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoType, setVideoType] = useState<'short-form' | 'long-form'>('short-form');
  const [videoUrl, setVideoUrl] = useState('');
  const [price, setPrice] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadVideo } = useVideo();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    
    const file = files[0];
    
    // Check file size
    if (file.size > MAX_SHORT_VIDEO_SIZE) {
      showToast(`File size must be less than ${MAX_SHORT_VIDEO_SIZE / (1024 * 1024)}MB`, 'error');
      e.target.value = '';
      return;
    }
    
    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !ALLOWED_VIDEO_FORMATS.includes(`.${fileExtension}`)) {
      showToast(`Only ${ALLOWED_VIDEO_FORMATS.join(', ')} formats are allowed`, 'error');
      e.target.value = '';
      return;
    }
    
    setSelectedFile(file);
    
    // Create a preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const validateForm = () => {
    if (!title.trim()) {
      showToast('Please enter a title', 'error');
      return false;
    }
    
    if (!description.trim()) {
      showToast('Please enter a description', 'error');
      return false;
    }
    
    if (videoType === 'short-form' && !selectedFile) {
      showToast('Please select a video file', 'error');
      return false;
    }
    
    if (videoType === 'long-form' && !videoUrl.trim()) {
      showToast('Please enter a video URL', 'error');
      return false;
    }
    
    if (videoType === 'long-form' && price < 0) {
      showToast('Price cannot be negative', 'error');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await uploadVideo(
        {
          title,
          description,
          videoType,
          videoUrl: videoType === 'long-form' ? videoUrl : undefined,
          price: videoType === 'long-form' ? price : 0
        },
        videoType === 'short-form' ? selectedFile : null
      );
      
      showToast('Video uploaded successfully!', 'success');
      navigate('/');
    } catch (error) {
      showToast('Failed to upload video', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Upload a Video</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg">
        <div className="space-y-4">
          <Input
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
            required
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Video Type
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="short-form"
                  checked={videoType === 'short-form'}
                  onChange={() => setVideoType('short-form')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 bg-gray-700"
                />
                <span className="ml-2 text-gray-300">Short-Form</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="long-form"
                  checked={videoType === 'long-form'}
                  onChange={() => setVideoType('long-form')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 bg-gray-700"
                />
                <span className="ml-2 text-gray-300">Long-Form</span>
              </label>
            </div>
          </div>
          
          {videoType === 'short-form' ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Upload Video (Max {MAX_SHORT_VIDEO_SIZE / (1024 * 1024)}MB)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md hover:bg-gray-700 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-12h-4m4 0h-4m-12 0v-8m0 0v-8m0 8h-4m4 0h-4"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="video/mp4,video/webm,video/ogg"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">MP4, WebM, Ogg up to {MAX_SHORT_VIDEO_SIZE / (1024 * 1024)}MB</p>
                </div>
              </div>
              
              {previewUrl && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preview
                  </label>
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-48 object-cover rounded-md bg-gray-700"
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <Input
                label="Video URL"
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                required
              />
              
              <Input
                label="Price (₹)"
                type="number"
                value={price.toString()}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Set price (0 for free)"
                min="0"
                step="1"
              />
              <p className="text-xs text-gray-400">
                Set price to 0 for free access, or enter an amount in ₹ for paid content
              </p>
            </>
          )}
        </div>
        
        <div className="pt-4">
          <Button type="submit" disabled={isSubmitting} fullWidth>
            {isSubmitting ? 'Uploading...' : 'Upload Video'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VideoUpload;