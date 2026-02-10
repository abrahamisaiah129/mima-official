import React, { useState, useEffect } from "react";
import { Image, UploadCloud, X, Save } from "lucide-react";
import { uploadToCloudinary } from "../../utils/upload";
import { useNotification } from "../../context/NotificationContext";
import api from "../../api";

const BannersTab = () => {
    const { notify } = useNotification();
    const [banners, setBanners] = useState([]);
    const [isSavingBanners, setIsSavingBanners] = useState(false);

    // Initial Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/banners");
                const data = res.data;
                if (data && data.length > 0) {
                    setBanners(data);
                }
            } catch (error) {
                console.error("Failed to fetch banners", error);
            }
        };
        fetchData();
    }, []);
    // set banner change
    const handleBannerChange = (index, value) => {
        const newBanners = [...banners];
        if (!newBanners[index]) newBanners[index] = { id: index + 1, url: "", text: "", pillText: "", type: "image" };

        if (typeof value === "string") {
            newBanners[index] = {
                ...newBanners[index],
                url: value,
                type: value.endsWith(".mp4") || value.endsWith(".webm") ? "video" : "image"
            };
        } else {
            newBanners[index] = { ...newBanners[index], ...value };
        }
        setBanners(newBanners);
    };
    // save banner
    const saveBanners = async () => {
        setIsSavingBanners(true);
        try {
            await Promise.all(banners.map(banner =>
                api.put(`/banners/${banner.id || banner._id}`, banner)
            ));
            notify("success", "Success", "Banners updated successfully!");
        } catch (error) {
            console.error("Failed to save banners", error);
            notify("error", "Error", "Failed to save banners.");
        } finally {
            setIsSavingBanners(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Banner Management</h2>
                <button
                    onClick={saveBanners}
                    disabled={isSavingBanners}
                    className="bg-white text-black px-6 py-2 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition disabled:opacity-50"
                >
                    {isSavingBanners ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map((index) => (
                    <div key={index} className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden p-6 space-y-4">
                        <h3 className="font-bold text-gray-400 uppercase tracking-widest text-sm">Slide {index + 1}</h3>

                        {/* Preview */}
                        <div className="aspect-[4/5] bg-black/50 rounded-xl overflow-hidden border border-white/5 relative group">
                            {banners[index]?.url ? (
                                banners[index].type === "video" ? (
                                    <video
                                        src={banners[index].url}
                                        className="w-full h-full object-cover"
                                        autoPlay muted loop playsInline
                                    />
                                ) : (
                                    <img
                                        src={banners[index].url}
                                        alt={`Banner ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                )
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-600">
                                    <Image size={40} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <span className="text-white font-bold">{banners[index]?.type === "video" ? "Video" : "Image"}</span>
                            </div>
                        </div>
                        {/* banner text */}
                        <div>
                            <span className="text-xs text-gray-500 font-bold uppercase">
                                Banner Text
                            </span>
                            <input
                                type="text"
                                value={banners[index]?.text || ""}
                                placeholder="Banner Text"
                                onChange={(e) => handleBannerChange(index, { text: e.target.value })}
                                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-sm cursor-pointer hover:border-white transition flex items-center justify-center gap-2 text-gray-400 hover:text-white"
                            />
                        </div>

                        {/* pill text */}
                        <div>
                            <span className="text-xs text-gray-500 font-bold uppercase">
                                Pill Text
                            </span>
                            <input
                                type="text"
                                value={banners[index]?.pillText || ""}
                                placeholder="Pill Text (Optional)"
                                onChange={(e) => handleBannerChange(index, { pillText: e.target.value })}
                                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-sm cursor-pointer hover:border-white transition flex items-center justify-center gap-2 text-gray-400 hover:text-white"
                            />
                        </div>

                        {/* Input */}
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-bold uppercase">Upload Media</label>
                            <div className="flex items-center space-x-2">
                                <label className="flex-1 bg-black border border-white/20 rounded-xl px-4 py-3 text-sm cursor-pointer hover:border-white transition flex items-center justify-center gap-2 text-gray-400 hover:text-white">
                                    <UploadCloud size={16} />
                                    <span>{banners[index]?.url ? "Change File" : "Upload File"}</span>
                                    <input
                                        type="file"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const url = await uploadToCloudinary(file);
                                                if (url) handleBannerChange(index, url);
                                            }
                                        }}
                                        className="hidden"
                                        accept="image/*,video/*"
                                    />
                                </label>
                                {banners[index]?.url && (
                                    <button
                                        onClick={() => handleBannerChange(index, "")}
                                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <p className="text-[10px] text-gray-500">
                                Supports images and videos (.mp4, .webm). Auto-detected.
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BannersTab;
