import React, { useState, useEffect } from "react";
import { Plus, X, UploadCloud } from "lucide-react";
import { uploadToCloudinary } from "../../utils/upload";
import api from "../../api";

const SocialTab = () => {
    const [posts, setPosts] = useState([]);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [postForm, setPostForm] = useState({ image: "", user: "", link: "", date: "Just now" });
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch Posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get("/posts");
                const data = res.data;
                setPosts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch posts", error);
            }
        };
        fetchPosts();
    }, []);

    const handleAddPost = async () => {
        if (!postForm.image && !imageFile) return alert("Image is required");

        try {
            setIsUploading(true);
            let imageUrl = postForm.image;

            if (imageFile) {
                const uploadedUrl = await uploadToCloudinary(imageFile);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                } else {
                    setIsUploading(false);
                    return; // Stop if upload failed
                }
            }

            const newPost = {
                id: Date.now(), // Simple ID
                ...postForm,
                image: imageUrl,
                date: "Just now" // Or prompt for it
            };

            const postRes = await api.post("/posts", newPost);
            setPosts([...posts, postRes.data || newPost]);
            setIsPostModalOpen(false);
            setPostForm({ image: "", user: "", link: "", date: "Just now" });
            setImageFile(null);
        } catch (error) {
            console.error("Failed to add post", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeletePost = async (id) => {
        if (!window.confirm("Delete this post?")) return;
        try {
            await api.delete(`/posts/${id}`);
            setPosts(posts.filter(p => p._id !== id && p.id !== id));
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Instagram Feed</h2>
                    <p className="text-sm text-gray-400">Manage 'MIMA on You' posts.</p>
                </div>
                <button
                    onClick={() => setIsPostModalOpen(true)}
                    className="bg-white text-black font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-gray-200 transition flex items-center gap-2"
                >
                    <Plus size={20} /> Add Post
                </button>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {posts.map((post) => (
                    <div key={post.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
                        <img src={post.image} alt={post.user} className="w-full h-full object-cover" />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="bg-red-500/20 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div>
                                <p className="font-bold text-white text-sm">{post.user}</p>
                                <p className="text-xs text-gray-400">{post.date}</p>
                                <a href={post.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline truncate block mt-1">
                                    Link
                                </a>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State Add Button */}
                {posts.length === 0 && (
                    <button
                        onClick={() => setIsPostModalOpen(true)}
                        className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 hover:border-white/30 hover:text-white transition group"
                    >
                        <Plus size={32} className="group-hover:scale-110 transition-transform mb-2" />
                        <span className="text-xs font-bold uppercase tracking-widest">Add First Post</span>
                    </button>
                )}
            </div>

            {/* Post Modal */}
            {isPostModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-3xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-white uppercase">New Post</h2>
                            <button onClick={() => setIsPostModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image</label>

                                {/* File Upload */}
                                <div className="border border-white/20 rounded-xl p-4 mb-2 flex flex-col items-center justify-center bg-black hover:bg-white/5 transition cursor-pointer relative overflow-hidden group min-h-[150px]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />

                                    {imageFile ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={URL.createObjectURL(imageFile)}
                                                alt="Preview"
                                                className="w-full h-40 object-cover rounded-lg"
                                            />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                <p className="text-white text-xs font-bold uppercase tracking-widest">Click to Change</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <UploadCloud size={32} className="text-gray-400 mb-3" />
                                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                Click to Upload Image
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">User / Handle</label>
                                <input
                                    type="text"
                                    value={postForm.user}
                                    onChange={(e) => setPostForm({ ...postForm, user: e.target.value })}
                                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-white transition"
                                    placeholder="@username"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Link</label>
                                <input
                                    type="text"
                                    value={postForm.link}
                                    onChange={(e) => setPostForm({ ...postForm, link: e.target.value })}
                                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-white transition"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <button
                                onClick={handleAddPost}
                                disabled={isUploading}
                                className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-gray-200 transition mt-4 disabled:opacity-50"
                            >
                                {isUploading ? "Uploading..." : "Publish Post"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SocialTab;
