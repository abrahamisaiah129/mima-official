import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const notify = (type, title, message) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, type, title, message }]);

        // Auto remove
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 3000);
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            {/* Notification Container */}
            <div className="fixed top-4 right-4 z-[99999] space-y-2 pointer-events-none">
                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3 w-80 pointer-events-auto animate-slide-left"
                    >
                        {n.type === "success" && <CheckCircle className="text-green-500 shrink-0" size={20} />}
                        {n.type === "error" && <XCircle className="text-red-500 shrink-0" size={20} />}
                        {n.type === "info" && <Info className="text-blue-500 shrink-0" size={20} />}

                        <div className="flex-1">
                            <h4 className="font-bold text-sm">{n.title}</h4>
                            <p className="text-xs text-gray-400 mt-1">{n.message}</p>
                        </div>
                        <button
                            onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
                            className="text-gray-500 hover:text-white"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
