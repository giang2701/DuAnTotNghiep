import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Rating,
    Menu,
    MenuItem,
    IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import axios from "axios";
import { toast } from "react-toastify";
import { Product } from "../../../interface/Products";
import Swal from "sweetalert2";
import instance from "../../../api";

interface Comment {
    _id: string;
    productId: Product;
    userId: {
        username: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
    hidden: boolean; // Trạng thái ẩn/hiện
}

const ListComments: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const fetchComments = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/comments"
            );
            setComments(response.data.data);
        } catch (error) {
            console.error("Lỗi khi lấy bình luận:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const toggleCommentVisibility = async (
        commentId: string,
        hidden: boolean
    ) => {
        try {
            await instance.put(`/comments/${commentId}/hide`, {
                hidden: !hidden,
            });
            toast.success(`Bình luận đã được ${!hidden ? "hiện" : "ẩn"}.`);
            fetchComments(); // Refresh danh sách bình luận
        } catch (error: any) {
            console.error("Lỗi khi thay đổi trạng thái bình luận:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            Swal.fire({
                icon: "error",
                title: "Có lỗi xảy ra khi thay đổi trạng thái bình luận",
                text: errorMessage, // Hiển thị nội dung của message
            });
        }
    };

    const filteredComments = comments.filter((comment) => {
        const matchesFilter =
            filter === "all" ||
            (filter === "hidden" && comment.hidden) ||
            (filter === "visible" && !comment.hidden) ||
            (filter === "***" && comment.comment.includes("***"));

        const matchesSearch =
            comment.userId?.username
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            comment.productId.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            comment.comment.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = (filter: string) => {
        setFilter(filter);
        setAnchorEl(null);
    };

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
        <Box
            className="container"
            sx={{ marginTop: "15px", marginLeft: "15px", width: "100%" }}
        >
            <Box sx={{ width: "1a00%" }}>
                <div className="box_table_products">
                    <div className="header_table_products bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
                        <span>Lọc</span>
                    </div>
                    <div className="body_table_products p-3 bg-white">
                        <div className="d-flex align-items-center" style={{}}>
                            <Box
                                sx={{
                                    marginBottom: "15px",
                                    display: "flex",
                                    gap: "10px",
                                    padding: "10px",
                                    alignItems: "center",
                                }}
                            >
                                <IconButton onClick={handleClickMenu}>
                                    <FilterListIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={() => setAnchorEl(null)}
                                >
                                    <MenuItem
                                        onClick={() => handleCloseMenu("all")}
                                    >
                                        Tất cả
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            handleCloseMenu("hidden")
                                        }
                                    >
                                        Bình luận hiện
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() =>
                                            handleCloseMenu("visible")
                                        }
                                    >
                                        Bình luận ẩn
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleCloseMenu("***")}
                                    >
                                        Bình luận vi phạm
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </div>
                    </div>
                </div>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 20px",
                        backgroundColor: "black",
                        color: "white",
                        fontWeight: "bold",
                    }}
                >
                    <Typography variant="h6">Danh Sách Bình Luận</Typography>
                </Box>
                <Box sx={{ padding: "10px", backgroundColor: "#fff" }}>
                    <table
                        className="table table-bordered table-striped text-center"
                        style={{ width: "100%" }}
                    >
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên Người Dùng</th>
                                <th>Sản Phẩm</th>
                                <th>Đánh Giá</th>
                                <th>Bình Luận</th>
                                <th>Ngày Tạo</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComments.length === 0 ? (
                                <tr>
                                    <td colSpan={8}>
                                        Không có bình luận phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredComments.map((comment, index) => (
                                    <tr key={comment._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {comment.userId?.username ||
                                                "Người dùng ẩn danh"}
                                        </td>
                                        <td>{comment.productId.title}</td>
                                        <td>
                                            <Rating
                                                value={comment.rating}
                                                readOnly
                                            />
                                        </td>
                                        <td
                                            style={{
                                                textDecoration: comment.hidden
                                                    ? "none"
                                                    : "line-through",
                                            }}
                                        >
                                            {comment.comment}
                                        </td>
                                        <td>
                                            {new Date(
                                                comment.createdAt
                                            ).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td>
                                            {comment.hidden ? (
                                                <span
                                                    style={{
                                                        color: "green",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Hiện
                                                </span>
                                            ) : (
                                                <span
                                                    style={{
                                                        color: "red",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Ẩn
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <Button
                                                variant="outlined"
                                                color={
                                                    comment.hidden
                                                        ? "warning"
                                                        : "success"
                                                }
                                                size="small"
                                                onClick={() =>
                                                    toggleCommentVisibility(
                                                        comment._id,
                                                        comment.hidden
                                                    )
                                                }
                                            >
                                                {comment.hidden ? "Ẩn" : "Hiện"}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Box>
            </Box>
        </Box>
    );
};

export default ListComments;
