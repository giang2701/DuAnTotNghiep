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
                <FavoriteIcon
                    sx={{
                        fontSize: 25,
                        marginLeft: "0px",
                        marginTop: "-0px",
                    }}
                />
            ) : (
                <FavoriteBorderIcon
                    sx={{
                        fontSize: 25,
                        marginLeft: "0px",
                        marginTop: "-0px",
                    }}
                />
            )}
        </IconButton>
    );
};

export default TymButton;
