import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const TymButton = () => {
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        setLiked(!liked);
    };

    return (
        <IconButton onClick={handleLike} color="error">
            {liked ? (
                <FavoriteIcon sx={{ fontSize: 25 }} />
            ) : (
                <FavoriteBorderIcon sx={{ fontSize: 25 }} />
            )}
        </IconButton>
    );
};

export default TymButton;
