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
  Pagination,
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const commentsPerPage = 15;

  const fetchComments = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/comments");
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
      fetchComments();
    } catch (error: any) {
      console.error("Lỗi khi thay đổi trạng thái bình luận:", error);
      const errorMessage =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại sau.";
      Swal.fire({
        icon: "error",
        title: "Có lỗi xảy ra khi thay đổi trạng thái bình luận",
        text: errorMessage,
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

  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (filter: string) => {
    setFilter(filter);
    setAnchorEl(null);
    setCurrentPage(1); // Reset về trang đầu tiên sau khi thay đổi bộ lọc
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
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
      <Box>
        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
          Danh Sách Bình Luận
        </Typography>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={handleClickMenu}>
                <FilterListIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={() => handleCloseMenu("all")}>
                  Tất cả
                </MenuItem>
                <MenuItem onClick={() => handleCloseMenu("hidden")}>
                  Bình luận ẩn
                </MenuItem>
                <MenuItem onClick={() => handleCloseMenu("visible")}>
                  Bình luận hiện
                </MenuItem>
                <MenuItem onClick={() => handleCloseMenu("***")}>
                  Bình luận vi phạm
                </MenuItem>
              </Menu>
            </Box>
          </Box>
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
              {paginatedComments.length === 0 ? (
                <tr>
                  <td colSpan={8}>Không có bình luận phù hợp.</td>
                </tr>
              ) : (
                paginatedComments.map((comment, index) => (
                  <tr key={comment._id}>
                    <td>{(currentPage - 1) * commentsPerPage + index + 1}</td>
                    <td>{comment.userId?.username || "Ẩn danh"}</td>
                    <td>{comment.productId.title}</td>
                    <td>
                      <Rating value={comment.rating} readOnly />
                    </td>
                    <td>{comment.comment}</td>
                    <td>
                      {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td>{comment.hidden ? "Ẩn" : "Hiện"}</td>
                    <td>
                      <Button
                        variant="outlined"
                        color={comment.hidden ? "success" : "warning"}
                        onClick={() =>
                          toggleCommentVisibility(comment._id, comment.hidden)
                        }
                      >
                        {comment.hidden ? "Hiện" : "Ẩn"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Pagination
            count={Math.ceil(filteredComments.length / commentsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ListComments;
