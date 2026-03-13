import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg";

const AvatarComponent = ({ avatar, css }) => {
    const [avatarSrc, setAvatarSrc] = useState(avatar || DEFAULT_AVATAR);
    const [loading, setLoading] = useState(false);
    const retryTimer = useRef(null);
    const hasRetried = useRef(false);

    useEffect(() => {
        setAvatarSrc(avatar || DEFAULT_AVATAR);
        setLoading(false);
        hasRetried.current = false;
    }, [avatar]);

    const handleError = (e) => {
        const failedSrc = e.target.src;
        if (!avatar || failedSrc.includes("wikipedia.org")) return;

        // Đã retry 1 lần rồi mà vẫn lỗi → dùng avatar mặc định, dừng spinner
        if (hasRetried.current) {
            setLoading(false);
            setAvatarSrc(DEFAULT_AVATAR);
            return;
        }

        hasRetried.current = true;
        setLoading(true);
        retryTimer.current = setTimeout(() => {
            setAvatarSrc(avatar + "?t=" + Date.now());
        }, 500);
    };

    const handleLoad = () => {
        setLoading(false);
    };

    useEffect(() => {
        return () => clearTimeout(retryTimer.current);
    }, []);

    return (
        <div className="relative w-full h-full">
            <img
                src={avatarSrc}
                className={css}
                alt=""
                onError={handleError}
                onLoad={handleLoad}
            />
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-full">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

export default AvatarComponent;
