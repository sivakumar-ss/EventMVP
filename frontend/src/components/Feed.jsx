import React, { useState, useEffect, useRef } from 'react';
import { postApi } from '../services/api';
import { Image as ImageIcon, Send, MessageSquare, Edit2, X, Save, Heart, Share2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const editFileInputRef = useRef(null);

  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [expandedCommentIds, setExpandedCommentIds] = useState([]);

  const toggleCommentsList = (postId) => {
    if (expandedCommentIds.includes(postId)) {
      setExpandedCommentIds(prev => prev.filter(id => id !== postId));
    } else {
      setExpandedCommentIds(prev => [...prev, postId]);
    }
  };

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const res = await postApi.getFeed();
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) {
      toast.error('Please add some text or an image');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      await postApi.createPost(formData);
      toast.success('Post created successfully!');
      
      // Reset form
      setContent('');
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Refresh feed
      fetchFeed();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (post) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
    setEditImage(null);
    setEditImagePreview(post.imageUrl);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setEditImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (postId) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('content', editContent);
      if (editImage) {
        formData.append('image', editImage);
      }

      await postApi.updatePost(postId, formData);
      toast.success('Post updated successfully!');
      
      setEditingPostId(null);
      fetchFeed();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLike = async (postId) => {
    // Optimistic UI update
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLikedByCurrentUser: !p.isLikedByCurrentUser,
          likeCount: p.isLikedByCurrentUser ? p.likeCount - 1 : p.likeCount + 1
        };
      }
      return p;
    }));

    try {
      await postApi.toggleLike(postId);
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle like');
      // Revert optimism by fetching feed
      fetchFeed();
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      setIsCommenting(true);
      const res = await postApi.addComment(postId, commentText.trim());
      setPosts(prevPosts => prevPosts.map(p => p.id === postId ? res.data : p));
      setCommentText('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await postApi.deleteComment(commentId);
      setPosts(prevPosts => prevPosts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.filter(c => c.id !== commentId)
          };
        }
        return p;
      }));
      toast.success('Comment deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete comment');
    }
  };

  const handleShare = (post) => {
    const text = encodeURIComponent(`Check out this update from ${post.authorName} on our Campus Network:\n\n"${post.content}"`);
    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${text}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Create Post Box */}
      <div className="glass rounded-3xl p-6 border border-white/5 shadow-lg">
        <div className="flex gap-4 mb-4">
          <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your achievements, certificates, or thoughts..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none min-h-[100px]"
          />
        </div>
        
        {imagePreview && (
          <div className="mb-4 relative rounded-xl overflow-hidden max-w-md mx-auto">
            <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover" />
            <button 
              type="button" 
              onClick={() => { setImage(null); setImagePreview(null); }}
              className="absolute top-2 right-2 w-8 h-8 bg-slate-900/80 rounded-full text-white flex items-center justify-center hover:bg-rose-500 transition-colors"
            >
              &times;
            </button>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-indigo-400 transition-colors"
          >
            <ImageIcon size={20} />
            <span className="text-sm font-medium">Add Image</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          <button
            onClick={handlePostSubmit}
            disabled={isSubmitting || (!content.trim() && !image)}
            className="btn-primary !py-2 !px-6 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post'} <Send size={16} />
          </button>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {loading ? (
          <div className="glass p-8 rounded-3xl text-center text-slate-400 skeleton min-h-[200px]" />
        ) : posts.length === 0 ? (
          <div className="glass p-12 rounded-3xl text-center border border-white/5">
            <MessageSquare size={48} className="mx-auto text-slate-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Your Feed is Empty</h3>
            <p className="text-slate-400">Follow more students in your Network to see their achievements here!</p>
          </div>
        ) : (
          posts.map(post => {
            const isOwner = user?.id === post.authorId || user?.email === post.authorName; // Use a heuristic if id is not perfectly matched or just assume user object has correct email. Actually backend matches by email, so we could check if user email is somewhat matched, but let's check post.authorName. Wait, in PostService mapToDto, authorName is user.getName(). We don't return authorEmail! Wait, user.id is returned as authorId. Let's use user?.id === post.authorId.

            return (
            <div key={post.id} className="glass rounded-3xl p-6 border border-white/5 shadow-lg relative group">
              {editingPostId === post.id ? (
                <div className="space-y-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none min-h-[100px]"
                  />
                  
                  {editImagePreview && (
                    <div className="relative rounded-xl overflow-hidden max-w-md">
                      <img src={editImagePreview} alt="Preview" className="w-full h-auto object-cover" />
                      <button 
                        type="button" 
                        onClick={() => { setEditImage(null); setEditImagePreview(null); }}
                        className="absolute top-2 right-2 w-8 h-8 bg-slate-900/80 rounded-full text-white flex items-center justify-center hover:bg-rose-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <button 
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-indigo-400 transition-colors"
                    >
                      <ImageIcon size={20} />
                      <span className="text-sm font-medium">Change Image</span>
                    </button>
                    <input 
                      type="file" 
                      ref={editFileInputRef} 
                      onChange={handleEditImageChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingPostId(null)}
                        className="btn-secondary !py-2 !px-4"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleEditSubmit(post.id)}
                        disabled={isSubmitting || (!editContent.trim() && !editImagePreview)}
                        className="btn-primary !py-2 !px-4 flex items-center gap-2"
                      >
                        <Save size={16} /> Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {user?.id === post.authorId && (
                    <button 
                      onClick={() => startEditing(post)}
                      className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-slate-400 hover:text-indigo-400 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                      {post.authorName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{post.authorName}</h4>
                      <p className="text-xs text-slate-400">{post.authorCollege || 'Student'}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{post.createdAt}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4 text-white whitespace-pre-wrap leading-relaxed pr-8">
                    {post.content}
                  </div>
                  
                  {post.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border border-white/10 mb-4">
                      <img src={post.imageUrl} alt="Post attachment" className="w-full h-auto object-cover max-h-[500px]" />
                    </div>
                  )}

                  {/* Social Actions */}
                  <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                    <button 
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${post.isLikedByCurrentUser ? 'text-rose-500' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Heart size={18} className={post.isLikedByCurrentUser ? 'fill-current' : ''} />
                      <span>{post.likeCount || 0}</span>
                    </button>
                    <button 
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${activeCommentPostId === post.id ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                    >
                      <MessageSquare size={18} className={activeCommentPostId === post.id ? 'fill-current opacity-20' : ''} />
                      <span>{post.comments?.length || 0}</span>
                    </button>
                    <button 
                      onClick={() => handleShare(post)}
                      className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors ml-auto"
                    >
                      <Share2 size={18} />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {activeCommentPostId === post.id && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
                          {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 flex gap-2">
                          <input 
                            type="text" 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id) }}
                            placeholder="Add a comment..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                          />
                          <button 
                            onClick={() => handleAddComment(post.id)}
                            disabled={isCommenting || !commentText.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl disabled:opacity-50 transition-colors"
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </div>

                      {post.comments?.length > 0 && (
                        !expandedCommentIds.includes(post.id) ? (
                          <button 
                            onClick={() => toggleCommentsList(post.id)} 
                            className="text-sm text-slate-400 hover:text-white mt-3 font-medium transition-colors"
                          >
                            View all {post.comments.length} comments
                          </button>
                        ) : (
                          <div className="space-y-3 mt-4">
                            <button 
                              onClick={() => toggleCommentsList(post.id)} 
                              className="text-sm text-slate-400 hover:text-white mb-2 font-medium transition-colors"
                            >
                              Hide comments
                            </button>
                            {post.comments.map(comment => (
                              <div key={comment.id} className="flex gap-3 group">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs shrink-0">
                                  {comment.authorName?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1 bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 relative">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-white text-sm">{comment.authorName}</span>
                                    <span className="text-[10px] text-slate-500">{comment.createdAt}</span>
                                  </div>
                                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{comment.content}</p>
                                  
                                  {user?.id === comment.authorId && (
                                    <button 
                                      onClick={() => handleDeleteComment(post.id, comment.id)}
                                      className="absolute top-2 right-2 text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )})
        )}
      </div>
    </div>
  );
}
