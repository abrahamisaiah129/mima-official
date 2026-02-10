
import React, { useState } from "react";
import { Send, Users, Mail } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import api from "../../api";

const NewsletterTab = ({ subscribers }) => {
    const { notify } = useNotification();
    const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
    const [newsletterSubject, setNewsletterSubject] = useState("");
    const [newsletterMessage, setNewsletterMessage] = useState("");

    const handleSendNewsletter = async (e) => {
        e.preventDefault();
        if (!newsletterSubject || !newsletterMessage) return notify("info", "Missing Fields", "Please fill in all fields");

        setIsSendingNewsletter(true);
        try {
            const res = await api.post("/newsletter/send", {
                subject: newsletterSubject,
                message: newsletterMessage
            });
            const data = res.data;
            console.log(data);
            if (data.success) {
                notify("success", "Sent", data.message);
                setNewsletterSubject("");
                setNewsletterMessage("");
            } else {
                notify("error", "Failed", data.error || "Failed to send newsletter");
            }
        } catch (error) {
            console.error(error);
            notify("error", "Error", "Error sending campaign");
        } finally {
            setIsSendingNewsletter(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-4xl">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 mb-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                    Send Campaign
                </h2>
                <p className="text-gray-500 mb-8">
                    Blast a new drop or promotion to all {subscribers?.length || 0} subscribers.
                </p>

                <form className="space-y-6" onSubmit={handleSendNewsletter}>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                            Subject Line
                        </label>
                        <input
                            type="text"
                            value={newsletterSubject}
                            onChange={(e) => setNewsletterSubject(e.target.value)}
                            className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition"
                            placeholder="e.g. FLASH SALE: 50% Off Everything!"
                            disabled={isSendingNewsletter}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                            Message Content
                        </label>
                        <textarea
                            rows="6"
                            value={newsletterMessage}
                            onChange={(e) => setNewsletterMessage(e.target.value)}
                            className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition"
                            placeholder="Write your email content here..."
                            disabled={isSendingNewsletter}
                        ></textarea>
                    </div>
                    <button
                        disabled={isSendingNewsletter}
                        className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        {isSendingNewsletter ? (
                            <>sending...</>
                        ) : (
                            <>
                                <Send size={18} /> Send Campaign
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6">Recent Subscribers</h3>
                <div className="space-y-2">
                    {Array.isArray(subscribers) && subscribers.length > 0 ? (
                        subscribers.map((email, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5"
                            >
                                <span className="text-gray-300 font-mono">{email}</span>
                                <span className="text-xs text-green-500">Active</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No recent subscribers.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsletterTab;
