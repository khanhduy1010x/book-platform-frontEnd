import React, { useState, useEffect } from 'react';

const AvatarComponent = ({ avatar,css }) => {
    const [avatarSrc, setAvatarSrc] = useState("");

    useEffect(() => {
        const img = new Image();
        img.src = avatar;

        img.onload = () => setAvatarSrc(avatar);
        img.onerror = () => setAvatarSrc("https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg");
    }, [avatar]);

    return <img src={avatarSrc || "https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg"} className={css} alt="Avatar" />;
};

export default AvatarComponent;
