import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, MapPin, User, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  
  const { data: issue, isLoading, error } = useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      const response = await api.get(`/issues/${id}`);
      return response.data.data;
    }
  });

  const { data: comments, refetch: refetchComments } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const response = await api.get(`/comments/${id}`);
      return response.data.data;
    }
  });

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await api.post(`/comments/${id}`, { message: commentText });
      setCommentText('');
      refetchComments();
      toast.success('Comment posted');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to post comment');
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await api.put(`/repairs/${id}`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      window.location.reload(); // Quick refresh to get updated issue + activity logs
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (isLoading) return <div className="animate-pulse">Loading issue details...</div>;
  if (error || !issue) return <div className="text-red-500">Failed to load issue.</div>;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-slate-900">#{issue.issueId} - {issue.title}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
              {issue.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Reported on {new Date(issue.createdAt).toLocaleString()} by {issue.reportedBy?.name || 'Unknown'}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button onClick={() => navigate(-1)} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium">
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Details Card */}
          <div className="bg-white shadow rounded-lg border border-slate-100 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2 mb-4">Description</h3>
              <p className="text-slate-700 whitespace-pre-wrap">{issue.description}</p>
              
              {/* Images */}
              {issue.images && issue.images.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-slate-900 mb-3">Attached Photos</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {issue.images.map((img: string, idx: number) => (
                      <a key={idx} href={img} target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-lg shadow-sm border border-slate-200">
                        <img src={img} alt={`Issue attachment ${idx + 1}`} className="h-32 w-full object-cover transition-transform group-hover:scale-105" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments / Activity */}
          <div className="bg-white shadow rounded-lg border border-slate-100 overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2 mb-4">Discussion & Updates</h3>
              
              <div className="space-y-6 mb-6">
                {comments?.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No comments yet.</p>
                ) : (
                  comments?.map((comment: any) => (
                    <div key={comment._id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src={comment.user?.profileImage || `https://ui-avatars.com/api/?name=${comment.user?.name}&background=2563eb&color=fff`} alt="" />
                      </div>
                      <div>
                        <div className="text-sm">
                          <span className="font-medium text-slate-900">{comment.user?.name}</span>
                          <span className="text-slate-500 mx-2">•</span>
                          <span className="text-slate-500 text-xs">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="mt-1 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 inline-block">
                          {comment.message}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              <form onSubmit={handlePostComment} className="mt-6 flex gap-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Meta Info */}
          <div className="bg-white shadow rounded-lg border border-slate-100 p-5">
            <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wide mb-4">Details</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Location</p>
                  <p className="text-sm text-slate-500">{issue.location}</p>
                </div>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Priority</p>
                  <p className="text-sm text-slate-500">{issue.priority}</p>
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Category</p>
                  <p className="text-sm text-slate-500">{issue.category}</p>
                </div>
              </li>
              <li className="flex items-start">
                <User className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Assigned To</p>
                  <p className="text-sm text-slate-500">{issue.assignedTo?.name || 'Unassigned'}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Admin Controls */}
          {user?.role === 'Admin' && (
            <div className="bg-slate-50 shadow rounded-lg border border-slate-200 p-5">
              <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wide mb-4">Admin Controls</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => handleStatusUpdate('In Progress')}
                  disabled={issue.status === 'In Progress' || issue.status === 'Completed' || issue.status === 'Verified'}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
                >
                  Mark In Progress
                </button>
                <button 
                  onClick={() => handleStatusUpdate('Verified')}
                  disabled={issue.status === 'Verified'}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                >
                  Verify & Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
