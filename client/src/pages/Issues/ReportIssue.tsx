import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const reportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Please provide a detailed description (min 20 characters)'),
  category: z.string().min(1, 'Category is required'),
  priority: z.string().min(1, 'Priority is required'),
  location: z.string().min(3, 'Location details are required'),
});

const ReportIssue = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(reportSchema),
  });

  const categories = [
    'Furniture', 'Electricity', 'Water Supply', 'Toilet', 'Sanitation', 
    'Roof', 'Classroom', 'Playground', 'Boundary Wall', 'Computer Lab', 
    'Science Lab', 'Library', 'Sports', 'Other'
  ];

  const priorities = ['Critical', 'High', 'Medium', 'Low'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Validate
      const validFiles = filesArray.filter(file => {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} is larger than 5MB`);
          return false;
        }
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          toast.error(`${file.name} is not a supported image format`);
          return false;
        }
        return true;
      });

      if (images.length + validFiles.length > 5) {
        toast.error('You can only upload up to 5 images');
        return;
      }

      setImages(prev => [...prev, ...validFiles]);
      
      // Create previews
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('priority', data.priority);
      formData.append('location', data.location);
      
      images.forEach(image => {
        formData.append('images', image);
      });

      // API expects multipart/form-data for image uploads
      await api.post('/issues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Issue reported successfully!');
      navigate('/dashboard/issues');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to report issue');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
            Report an Issue
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Please provide accurate details and clear pictures to help our maintenance team.
          </p>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 border border-slate-200">
        <form className="space-y-8 divide-y divide-slate-200" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 sm:space-y-5">
            
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-b sm:border-slate-200 sm:pb-5">
              <label className="block text-sm font-medium text-slate-700 sm:mt-px sm:pt-2">
                Title *
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  {...register('title')}
                  placeholder="E.g. Broken desk in Room 104"
                  className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-slate-300 rounded-md py-2 px-3 border"
                />
                {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message as string}</p>}
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-b sm:border-slate-200 sm:pb-5">
              <label className="block text-sm font-medium text-slate-700 sm:mt-px sm:pt-2">
                Category *
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <select
                  {...register('category')}
                  className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-slate-300 rounded-md py-2 px-3 border bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category.message as string}</p>}
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-b sm:border-slate-200 sm:pb-5">
              <label className="block text-sm font-medium text-slate-700 sm:mt-px sm:pt-2">
                Priority *
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <select
                  {...register('priority')}
                  className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-slate-300 rounded-md py-2 px-3 border bg-white"
                >
                  <option value="">Select priority</option>
                  {priorities.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.priority && <p className="mt-2 text-sm text-red-600">{errors.priority.message as string}</p>}
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-b sm:border-slate-200 sm:pb-5">
              <label className="block text-sm font-medium text-slate-700 sm:mt-px sm:pt-2">
                Specific Location *
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  {...register('location')}
                  placeholder="E.g. Main Building, First Floor, Boys Washroom"
                  className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-slate-300 rounded-md py-2 px-3 border"
                />
                {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location.message as string}</p>}
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-b sm:border-slate-200 sm:pb-5">
              <label className="block text-sm font-medium text-slate-700 sm:mt-px sm:pt-2">
                Description *
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  {...register('description')}
                  rows={4}
                  className="max-w-lg shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-slate-300 rounded-md py-2 px-3"
                  placeholder="Describe the issue in detail..."
                />
                {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message as string}</p>}
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-b sm:border-slate-200 sm:pb-5">
              <label className="block text-sm font-medium text-slate-700 sm:mt-px sm:pt-2">
                Photos (Max 5)
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 transition-colors">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 px-2 py-1">
                        <span>Upload files</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageChange} disabled={images.length >= 5} />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </div>
                
                {/* Image Previews */}
                {previews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {previews.map((src, idx) => (
                      <div key={idx} className="relative group">
                        <img src={src} alt="Preview" className="h-24 w-full object-cover rounded-md border border-slate-200 shadow-sm" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 shadow-sm"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
