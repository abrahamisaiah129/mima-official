import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const Notification = ({ notification, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // Wait for fade out animation
            }, 5000); // Auto close after 5s

            return () => clearTimeout(timer);
        }
    }, [notification, onClose]);

    if (!notification) return null;

    const { type, message, description } = notification;

    const styles = {
        success: {
            bg: "bg-green-500/10",
            border: "border-green-500/20",
            icon: <CheckCircle className="text-green-500" size={24} />,
            titleColor: "text-green-500",
        },
        error: {
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            icon: <XCircle className="text-red-500" size={24} />,
            titleColor: "text-red-500",
        },
        info: {
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            icon: <Info className="text-blue-500" size={24} />,
            titleColor: "text-blue-500",
        },
    };

    const style = styles[type] || styles.info;

    return (
        <div
            className={`fixed top-24 right-4 z-[9999] max-w-sm w-full transition-all duration-300 transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                }`}
        >
            <div
                className={`backdrop-blur-xl bg-zinc-900/90 border ${style.border} p-4 rounded-2xl shadow-2xl flex items-start gap-3`}
            >
                <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
                <div className="flex-1">
                    <h4 className={`font-bold ${style.titleColor} text-sm uppercase tracking-wide`}>
                        {message}
                    </h4>
                    {description && (
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-500 hover:text-white transition"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default Notification;
