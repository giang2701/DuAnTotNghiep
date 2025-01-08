import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Rating,
    CircularProgress,
    Pagination,
} from "@mui/material";
import instance from "../api";
import { iComment } from "../interface/Conmment";

const ProductComments = ({ productId }: { productId: string }) => {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 3;

    const fetchComments = async () => {
        try {
            const response = await instance.get(
                `/comments/product/${productId}`
            );
            const fifterCmt = response.data.data.filter(
                (product: iComment) => product.hidden
            );
            console.log("fifterCmt", fifterCmt);

            //  const activeProducts = data.data.filter(
            //           (product: Product) => product.isActive
            //         );
            setComments(fifterCmt); // API chỉ trả về bình luận `hidden: false`
        } catch (error) {
            console.error("Lỗi khi lấy bình luận:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [productId]);

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setCurrentPage(value);
    };

    const startIndex = (currentPage - 1) * commentsPerPage;
    const currentComments = comments.slice(
        startIndex,
        startIndex + commentsPerPage
    );

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography
                variant="h5"
                sx={{ marginBottom: "20px", fontWeight: "bold" }}
            >
                Đánh giá
            </Typography>

            {comments.length === 0 ? (
                <Typography>Chưa có bình luận nào cho sản phẩm này.</Typography>
            ) : (
                <>
                    {currentComments.map((comment) => (
                        <Box
                            key={comment._id}
                            sx={{
                                marginBottom: "20px",
                                padding: "15px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            <Typography sx={{ fontWeight: "bold" }}>
                                {comment?.userId?.username ||
                                    "Người dùng ẩn danh"}
                            </Typography>
                            <Rating
                                value={comment.rating}
                                readOnly
                                sx={{ marginY: "2px" }}
                            />
                            <Typography>{comment.comment}</Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {new Date(comment.createdAt).toLocaleDateString(
                                    "vi-VN"
                                )}
                            </Typography>
                        </Box>
                    ))}

                    <Box
                        display="flex"
                        justifyContent="center"
                        marginTop="20px"
                    >
                        <Pagination
                            count={Math.ceil(comments.length / commentsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default ProductComments;
