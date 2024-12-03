import {
    Box,
    Typography,
    Grid,
    Paper,
    Container,
    IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import { AiFillHeart } from "react-icons/ai";
import { Product } from "../interface/Products";
import { useEffect, useState } from "react";
import instance from "../api";
import { Heart } from "../interface/Heart";
import { toast } from "react-toastify";

const ProductsLiked = () => {
    const [favorites, setFavorites] = useState<Product[]>([]); // Khởi tạo favorites là một mảng rỗng
    const [favorites2, setFavorites2] = useState<Heart[]>([]); // Khởi tạo favorites là một mảng rỗng
    const userArray = localStorage.getItem("user");
    const user = userArray ? JSON.parse(userArray) : null;

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                const { data } = await instance.get(`/heart/user/${user._id}`);
                setFavorites2(data.heart); // Đảm bảo rằng favorites là một mảng
            } else {
                const favoritesFromLocal = localStorage.getItem("favorites");
                const fav = JSON.parse(favoritesFromLocal || "[]");
                setFavorites(fav);
            }
        };
        fetchData();
    }, [user]);

    const toggleFavorite = async (item: Product) => {
        if (user) {
            await instance.delete(`/heart/${user._id}/${item._id}`);
            toast.success("Bỏ yêu thích thành công");
            const updatedFavorites = favorites.filter(
                (favItem: Product) => favItem._id !== item._id
            );
            setFavorites(updatedFavorites);
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        } else {
            const updatedFavorites = favorites.filter(
                (favItem: Product) => favItem._id !== item._id
            );
            setFavorites(updatedFavorites);
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        }

    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        })
            .format(price)
            .replace("₫", "đ");
    };
    if (user) {
        if (!Array.isArray(favorites2) || favorites2.length === 0) {
            return (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        color: "red",
                    }}
                >
                    <Typography variant="h6">
                        Không có sản phẩm yêu thích nào
                    </Typography>
                </Box>
            );
        }
    } else if (!Array.isArray(favorites) || favorites.length === 0) { // Kiểm tra nếu favorites không phải là mảng hoặc là mảng rỗng
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    color: "red",
                }}
            >
                <Typography variant="h6">
                    Không có sản phẩm yêu thích nào.
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ paddingTop: "150px" }}>
            <Typography
                variant="h4"
                fontFamily="Poppins"
                fontWeight={400}
                my={4}
            >
                Sản phẩm yêu thích
            </Typography>
            <Grid container spacing={3}>

                {user ? <>
                    {favorites2.map(item => {
                        return (
                            (
                                <Grid item xs={12} sm={6} md={4} key={item.product._id}>
                                    <Paper
                                        sx={{
                                            backgroundColor: "#f2f2f2",
                                            padding: "20px",
                                            position: "relative",
                                            borderRadius: 5,
                                            transition: "background-color 0.3s, color 0.3s",
                                            "&:hover": {
                                                backgroundColor: "#000",
                                                color: "#fff",
                                                "& .MuiTypography-root": {
                                                    color: "#fff",
                                                },
                                                "& .MuiSvgIcon-root": {
                                                    color: "#fff",
                                                },
                                                "& a": {
                                                    color: "#fff",
                                                },
                                            },
                                        }}
                                        elevation={0}
                                    >
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            position="absolute"
                                            top={10}
                                            left={10}
                                            sx={{ borderRadius: 3 }}
                                            bgcolor="#f0f0f0"
                                            p={0.5}
                                        >

                                        </Box>
                                        <Box py={3} borderRadius={4} bgcolor={"white"}>
                                            <Link to={`/detail/${item.product._id}`}>
                                                <img
                                                    src={item.product.images}
                                                    alt={item.product.title}
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                        maxHeight: "400px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </Link>
                                        </Box>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            mt={2}
                                        >
                                            <Typography variant="h6" fontWeight={600}>
                                                <Link
                                                    to={`/product/${item.product._id}`}
                                                    style={{
                                                        textDecoration: "none",
                                                        color: "inherit",
                                                    }}
                                                >
                                                    {item.product.title}
                                                </Link>
                                            </Typography>
                                            <Box>
                                                <Link
                                                    style={{
                                                        color: "black",
                                                        textDecoration: "none",
                                                        fontWeight: 600,
                                                        backgroundColor: "white",
                                                        padding: "8px 16px",
                                                        borderRadius: 5,
                                                        border: "1px solid #ccc",
                                                    }}
                                                    to={`/detail/${item.product._id}`}
                                                >
                                                    Xem
                                                </Link>
                                            </Box>
                                        </Box>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            mt={1}
                                        >
                                            <Typography
                                                variant="body2"
                                                color={"#525252"}
                                                fontWeight={600}
                                            >
                                                {formatPrice(item.product.price)}
                                            </Typography>
                                            <IconButton
                                                sx={{ marginLeft: 10 }}
                                                onClick={() => toggleFavorite(item.product)}
                                            >
                                                <AiFillHeart color="red" size={30} />
                                            </IconButton>
                                        </Box>
                                    </Paper>
                                </Grid>
                            )
                        )
                    })}
                </> : <> {favorites.map((item: Product) => (
                    <Grid item xs={12} sm={6} md={4} key={item._id}>
                        <Paper
                            sx={{
                                backgroundColor: "#f2f2f2",
                                padding: "20px",
                                position: "relative",
                                borderRadius: 5,
                                transition: "background-color 0.3s, color 0.3s",
                                "&:hover": {
                                    backgroundColor: "#000",
                                    color: "#fff",
                                    "& .MuiTypography-root": {
                                        color: "#fff",
                                    },
                                    "& .MuiSvgIcon-root": {
                                        color: "#fff",
                                    },
                                    "& a": {
                                        color: "#fff",
                                    },
                                },
                            }}
                            elevation={0}
                        >
                            <Box
                                display="flex"
                                alignItems="center"
                                position="absolute"
                                top={10}
                                left={10}
                                sx={{ borderRadius: 3 }}
                                bgcolor="#f0f0f0"
                                p={0.5}
                            >
                                <StarIcon
                                    fontSize="small"
                                    style={{ color: "#FFD700" }}
                                />
                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    paddingRight={0.8}
                                    ml={0.5}
                                >
                                    4.5
                                </Typography>
                            </Box>
                            <Box py={3} borderRadius={4} bgcolor={"white"}>
                                <Link to={`/detail/${item._id}`}>
                                    <img
                                        src={item.images}
                                        alt={item.title}
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            maxHeight: "400px",
                                            objectFit: "cover",
                                        }}
                                    />
                                </Link>
                            </Box>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mt={2}
                            >
                                <Typography variant="h6" fontWeight={600}>
                                    <Link
                                        to={`/product/${item._id}`}
                                        style={{
                                            textDecoration: "none",
                                            color: "inherit",
                                        }}
                                    >
                                        {item.title}
                                    </Link>
                                </Typography>
                                <Box>
                                    <Link
                                        style={{
                                            color: "black",
                                            textDecoration: "none",
                                            fontWeight: 600,
                                            backgroundColor: "white",
                                            padding: "8px 16px",
                                            borderRadius: 5,
                                            border: "1px solid #ccc",
                                        }}
                                        to={`/detail/${item._id}`}
                                    >
                                        Xem
                                    </Link>
                                </Box>
                            </Box>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mt={1}
                            >
                                <Typography
                                    variant="body2"
                                    color={"#525252"}
                                    fontWeight={600}
                                >
                                    {formatPrice(item.price)}
                                </Typography>
                                <IconButton
                                    sx={{ marginLeft: 10 }}
                                    onClick={() => toggleFavorite(item)}
                                >
                                    <AiFillHeart color="red" size={30} />
                                </IconButton>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
                </>}

            </Grid>
        </Container>
    );
};

export default ProductsLiked;