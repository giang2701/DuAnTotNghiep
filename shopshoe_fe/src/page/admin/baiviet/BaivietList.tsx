import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Pagination } from "@mui/material"; // Import Pagination từ Material-UI
import { Baiviet } from "../../../interface/Baiviet";
import instance from "../../../api";
import Swal from "sweetalert2";

const BaivietList = () => {
  const [Baiviets, setBaiviets] = useState<Baiviet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("titleAsc"); // Thay đổi trạng thái sắp xếp
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [postsPerPage] = useState(7); // Số bài viết trên mỗi trang

  // Fetch data from API
  useEffect(() => {
    const fetchBaiviets = async () => {
      try {
        const response = await instance.get("baiviet/");
        const data = response.data.data || []; // Đảm bảo `data` luôn là mảng, mặc dù có thể rỗng
        setBaiviets(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBaiviets();
  }, []);

  const filteredBaiviets = Baiviets.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(item.publishDate)
        .toLocaleDateString()
        .includes(searchTerm.toLowerCase())
  );

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  // Sắp xếp lại dữ liệu
  const sortedBaiviets = filteredBaiviets.sort((a, b) => {
    switch (sortOption) {
      case "titleAsc":
        return a.title.localeCompare(b.title); // Sắp xếp A-Z
      case "titleDesc":
        return b.title.localeCompare(a.title); // Sắp xếp Z-A
      case "dateAsc":
        return (
          new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
        ); // Ngày tăng dần
      case "dateDesc":
        return (
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        ); // Ngày giảm dần
      default:
        return 0;
    }
  });

  const toggleVisibility = async (id: string, isActive: boolean) => {
    try {
      const updatedStatus = !isActive; // Lật trạng thái isActive
      // Gửi yêu cầu PUT đến API để cập nhật trạng thái
      await instance.put(`baiviet/${id}`, { isActive: updatedStatus });

      // Cập nhật trạng thái trong frontend sau khi cập nhật thành công
      setBaiviets((prev) =>
        prev.map((Baiviet) =>
          Baiviet._id === id ? { ...Baiviet, isActive: updatedStatus } : Baiviet
        )
      );

      // Thông báo thành công khi thay đổi trạng thái
      Swal.fire({
        title: "Thành công",
        text: `Trạng thái đã được cập nhật.`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Cập nhật trạng thái thất bại:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Đã có lỗi xảy ra khi cập nhật trạng thái.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const getShortContent = (content: string) => {
    return content.length > 20 ? content.substring(0, 20) + "..." : content;
  };

  const handleDelete = async (id: string) => {
    try {
      // Xác nhận trước khi xóa
      const result = await Swal.fire({
        title: "Bạn có chắc không?",
        text: "Bạn sẽ không thể hoàn tác hành động này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Có, xóa nó!",
        cancelButtonText: "Không, hủy bỏ",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        // Gửi yêu cầu DELETE tới API
        await instance.delete(`baiviet/${id}`);

        // Cập nhật lại danh sách bài viết sau khi xóa thành công
        setBaiviets((prev) => prev.filter((Baiviet) => Baiviet._id !== id));

        // Thông báo xóa thành công
        Swal.fire({
          title: "Đã xóa!",
          text: "Bài viết của bạn đã được xóa.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        // Thông báo nếu hành động bị hủy bỏ
        Swal.fire({
          title: "Đã hủy",
          text: "Bài viết của bạn an toàn :)",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      setError("Có lỗi khi xóa bài viết.");
      console.error("Lỗi khi xóa bài viết:", err);
      Swal.fire({
        title: "Lỗi",
        text: "Đã có lỗi xảy ra khi xóa bài viết.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    // const paginate = (event: any, page: number) => {
    //   setCurrentPage(page);
    // };
  };
  // Xử lý phân trang
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedBaiviets.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (event: any, page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-danger">Lỗi: {error}</p>;

  return (
    <div className="container">
      <div className="box_table_Baiviets my-3">
        <div className="box_table_products" style={{ marginBottom: "17px" }}>
          <div className="header_table_products bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
            <span>Tìm kiếm</span>
          </div>
          <div className="body_table_products p-3 bg-white">
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle box-sort"
                  type="button"
                  id="sortMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Sắp xếp
                </button>
                <ul className="dropdown-menu" aria-labelledby="sortMenuButton">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleSortChange("titleAsc")}
                    >
                      Từ A-Z
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleSortChange("titleDesc")}
                    >
                      Từ Z-A
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleSortChange("dateAsc")}
                    >
                      Ngày tăng dần
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleSortChange("dateDesc")}
                    >
                      Ngày giảm dần
                    </button>
                  </li>
                </ul>
              </div>
              <div className="position-relative">
                <i
                  className="fa-solid fa-magnifying-glass position-absolute"
                  style={{
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    fontSize: "16px",
                  }}
                ></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc ngày tạo"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control ps-5"
                  style={{
                    width: "500px",
                    height: "43px",
                    marginTop: "1px",
                    fontSize: "15px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="header_table_Size bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
          <span>Danh Sách Bài viết</span>
          <Link
            to="/admin/baiviet/add"
            className="bg-primary"
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "20px",
              paddingTop: "2px",
            }}
          >
            <i className="fa-solid fa-plus text-white fs-9"></i>
          </Link>
        </div>
        <div className="body_table_Baiviets p-3 bg-white">
          <table className="table table-bordered table-striped text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Tiêu Đề</th>
                <th>Nội Dung</th>
                <th>Hình Ảnh</th>
                <th>Ngày Đăng</th>
                <th>Hành Động</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.length > 0 ? (
                currentPosts.map((item, index) => (
                  <tr key={item._id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{item.title}</td>
                    <td className="text-center">
                      {getShortContent(item.content)}
                    </td>
                    <td className="text-center ">
                      <img
                        src={`${item.images}`}
                        alt={item.title}
                        width={"50px"}
                      />
                    </td>
                    <td className="text-center">
                      {new Date(item.publishDate).toLocaleDateString()}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center">
                        <button
                          className="me-3"
                          onClick={() => handleDelete(item._id!)}
                          style={{
                            borderRadius: "5px",
                            width: "30px",
                            height: "30px",
                            backgroundColor: "black",
                            color: "white",
                            border: "none",
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                        <Link
                          to={`/admin/baiviet/edit/${item._id}`}
                          style={{
                            borderRadius: "5px",
                            width: "30px",
                            height: "30px",
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            fontSize: "1.2rem",
                            paddingLeft: "1px",
                            paddingTop: "5px",
                          }}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </Link>
                      </div>
                    </td>
                    <td>
                      <Button
                        variant="outlined"
                        color={item.isActive ? "warning" : "success"}
                        size="small"
                        onClick={() =>
                          toggleVisibility(item._id, item.isActive)
                        }
                      >
                        {item.isActive ? "Ẩn" : "Hiện"}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>Không có bài viết nào.</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Component */}
          <div className="d-flex justify-content-center mt-3">

          <Pagination
            count={Math.ceil(sortedBaiviets.length / postsPerPage)}
            page={currentPage}
            onChange={paginate}
            color="primary"
            // showFirstButton
            // showLastButton
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaivietList;
