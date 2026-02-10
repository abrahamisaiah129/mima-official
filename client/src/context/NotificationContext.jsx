import React, { createContext, useContext, useState, useCallback } from "react";
import Notification from "../components/Notification";

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const notify = useCallback((type, message, description = "") => {
        setNotification({ type, message, description });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <Notification notification={notification} onClose={closeNotification} />
        </NotificationContext.Provider>
    );
};
