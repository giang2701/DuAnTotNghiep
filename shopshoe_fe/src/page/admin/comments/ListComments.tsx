import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Pagination } from "@mui/material";
import { iComment } from "../../../interface/Conmment";

const ListComments = () => {
  const [comments, setComments] = useState<iComment[]>([]);
  const [productId] = useState("6714ffaf2c9f0f1a49e63cc9");
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10; // Updated comments per page to 10

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/comments/${productId}`
      );
      setComments(response.data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * commentsPerPage;
  const currentComments = comments.slice(
    startIndex,
    startIndex + commentsPerPage
  );

  return (
    <Container>
      <div className="container">
        <div className="box_table_size my-3">
          <div className="header_table_Size bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
            <span>Danh Sách Comments</span>
          </div>
          <div
            className="body_table_Size p-3 bg-white"
            style={{ maxHeight: "700px", overflowY: "auto" }}
          >
            <table
              className="table table-bordered table-striped text-center"
              style={{ width: "99%" }}
            >
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Sản phẩm</th>
                  <th>Người dùng</th>
                  <th>Đánh giá(sao)</th>
                  <th>Bình luận</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {currentComments.length > 0 ? (
                  currentComments.map((comment, index) => (
                    <tr key={comment._id}>
                      <td>{startIndex + index + 1}</td>
                      <td>{comment.productId?.name || "N/A"}</td>
                      <td>
                        {comment.userId ? comment.userId.username : "N/A"}
                      </td>
                      <td>{comment.rating}</td>
                      <td>{comment.comment}</td>
                      <td>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>Chưa có lượt đánh giá nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            count={Math.ceil(comments.length / commentsPerPage)} // Adjust pagination count for 10 items per page
            page={currentPage}
            onChange={handlePageChange}
            sx={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          />
        </div>
      </div>
    </Container>
  );
};

export default ListComments;
