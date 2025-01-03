import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import instance from "../api";
import { Baiviet } from "../interface/Baiviet";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination"; // Import Pagination của MUI
import Stack from "@mui/material/Stack";

const BaivietPage = () => {
  const [baivietList, setBaivietList] = useState<Baiviet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await instance.get("/baiviet");
        if (data.data && data.data.length > 0) {
          const activeBaiviets = data.data.filter(
            (item: Baiviet) => item.isActive === true
          );
          setBaivietList(activeBaiviets);
        } else {
          Swal.fire("Thông báo", "Không có bài viết nào", "info");
        }
      } catch (error) {
        Swal.fire("Lỗi", "Không thể tải bài viết", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = baivietList.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(baivietList.length / postsPerPage);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (baivietList.length === 0) {
    return <div className="text-center mt-5">Không có bài viết hiển thị</div>;
  }

  return (
    <div className="container my-5">
      <h1
        className="danhsachbaivietpage mb-4 text-center"
        style={{ fontFamily: "Roboto, sans-serif", fontWeight: "600" }}
      >
        Danh sách bài viết
      </h1>
      <div className="row">
        {currentPosts.map((baiviet) => {
          const publishDate = new Date(baiviet.publishDate);
          const day = publishDate.getDate().toString().padStart(2, "0");
          const month = publishDate.toLocaleString("en", { month: "short" });

          return (
            <div className="col-md-4 mb-4" key={baiviet._id}>
              <div className="card shadow-lg border-0 rounded-3">
                <div className="card-img-container">
                  <div className="date-box">
                    <div>{day}</div>
                    <div>{month}</div>
                  </div>
                  <Link
                    className="text-decoration-none text-black font-weight-bold"
                    to={`/baiviet/${baiviet._id}`}
                  >
                    <img
                      src={`${baiviet.images}`}
                      className="card-img-top"
                      alt={baiviet.title}
                    />
                  </Link>
                  <div className="gray-overlay">
                    <span className="overlay-text">zokong</span>
                  </div>
                </div>
                <div className="card-body">
                  <Link
                    className="text-decoration-none text-black font-weight-bold"
                    to={`/baiviet/${baiviet._id}`}
                  >
                    <h5 className="card-title text-dark title-overflow">
                      {baiviet.title}
                    </h5>
                  </Link>
                  <div
                    className="card-text"
                    dangerouslySetInnerHTML={{ __html: baiviet.content }}
                  />
                  <div className="card-body text-center">
                    <p className="card-text text-muted">
                      Về Zokong |{" "}
                      <i className="fa-regular fa-clock p-1"></i>
                      {new Date(baiviet.publishDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Phân trang */}
      <div className="d-flex justify-content-center mt-4">
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            siblingCount={1}
            boundaryCount={1}
          />
        </Stack>
      </div>
    </div>
  );
};

export default BaivietPage;
