export const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        console.error("Cloudinary configuration missing");
        return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        if (data.secure_url) {
            return data.secure_url;
        } else {
            console.error("Cloudinary Upload Failed", data);
            alert("Upload failed. Check Cloud Name & Preset.");
            return null;
        }
    } catch (error) {
        console.error("Error uploading to Cloudinary", error);
        alert("Error uploading file.");
        return null;
    }
};
