import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import instance from "../api";
import { Baiviet } from "../interface/Baiviet";

const BaivietDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [baiviet, setBaiviet] = useState<Baiviet | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Baiviet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBaiviet = async () => {
      try {
        const { data } = await instance.get(
          `http://localhost:8000/api/baiviet/${id}`
        );
        if (data.data) {
          setBaiviet(data.data);
        } else {
          Swal.fire("Thông báo", "Bài viết không tồn tại", "info");
        }
      } catch (error) {
        Swal.fire("Lỗi", "Không thể tải bài viết", "error");
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedPosts = async () => {
      try {
        const { data } = await instance.get(
          `http://localhost:8000/api/baiviet`
        );
        // Lọc bỏ bài viết hiện tại
        const filteredPosts = data.data.filter(
          (post: Baiviet) => post._id !== id
        );
        setRelatedPosts(filteredPosts);
      } catch (error) {
        console.error("Không thể tải danh sách bài viết:", error);
      }
    };

    fetchBaiviet();
    fetchRelatedPosts();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!baiviet) {
    return <div className="text-center mt-5">Không có bài viết hiển thị</div>;
  }

  const publishDate = new Date(baiviet.publishDate);
  const day = publishDate.getDate().toString().padStart(2, "0");
  const month = publishDate.toLocaleString("en", { month: "short" });

  return (
    <div className="container my-5">
      <h1
        className="text-center mb-4 baivietchitiet"
        style={{ fontFamily: "Roboto, sans-serif", fontWeight: "600" }}
      >
        {baiviet.title}
      </h1>
      <div className="card mb-4" style={{ border: "none", boxShadow: "none" }}>
        <div className="card-img-container position-relative">
          <img
            src={`${baiviet.images}`}
            className="card-img-top"
            alt={baiviet.title}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="card-body">
          <div
            style={{ lineHeight: "1.8", marginTop: "10px", marginBottom: "15px" }}

            className="baiviet-content"
            dangerouslySetInnerHTML={{ __html: baiviet.content }}
          />
          ;
          <div className="text-center mt-3">
            <div className="date-box">
              <div>{day}</div>
              <div>{month}</div>
            </div>
          </div>
        </div>

        <td className="text-center">
  <h5
    className="mb-4 d-flex flex-row-reverse"
    style={{ fontFamily: "Roboto, sans-serif", fontWeight: "600" }}
  >
    {new Date(baiviet.publishDate).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })}{" "}
    - {" "}
    {new Date(baiviet.publishDate).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}
  </h5>
</td>


      </div>

      {/* Hiển thị bài viết tiếp theo */}
      <div className="related-posts mt-5">
        <div className="title__products__Related">
          <p>Bài viết tiếp theo</p>
        </div>
        <div className="scroll d-flex overflow-auto">
          {relatedPosts.slice(0, 6).map((post) => (
            <div
              className="card shadow-sm border-0 rounded-3 me-3 card-img-container position-relative"
              key={post._id}
              style={{ width: "300px", flex: "0 0 auto" }}
            >
              <Link to={`/baiviet/${post._id}`}>
                <img
                  src={`${post.images}`}
                  alt={post.title}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
              </Link>
              <div className="card-body text-center">
                <Link
                  className="text-decoration-none text-black font-weight-bold"
                  to={`/baiviet/${post._id}`}
                >
                  <h4 className="card-title ">{post.title}</h4>
                </Link>

                <p className="card-text text-muted">
                  Về Zokong | <i className="fa-regular fa-clock p-1"></i>
                  {new Date(post.publishDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BaivietDetailPage;
