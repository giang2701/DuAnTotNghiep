import { useEffect, useState } from "react";
import instance from "../../../api";
import { User } from "../../../interface/User";

const UserList = () => {
  const [user, setUser] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedRole, setEditedRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSortedAsc, setIsSortedAsc] = useState<boolean>(true); // State để kiểm tra thứ tự sắp xếp

  useEffect(() => {
    (async () => {
      const { data } = await instance.get("/user");
      setUser(data.data);
      setFilteredUsers(data.data); // Ban đầu hiển thị toàn bộ danh sách
    })();
  }, []);

  // Xóa
  const handleDelete = async (_id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này không?")) {
      await instance.delete(`/user/${_id}`);
      const updateUsers = user.filter((item) => item._id !== _id);
      setUser(updateUsers);
      setFilteredUsers(updateUsers);
    }
  };

  // Sửa
  const handleEditCLick = (user: User) => {
    setEditingUserId(user._id);
    setEditedRole(user.role);
  };

  const handleSaveEdit = async () => {
    if (!editingUserId) return;
    try {
      await instance.put(`/user/${editingUserId}`, { role: editedRole });
      const updatedUsers = user.map((item) =>
        item._id === editingUserId ? { ...item, role: editedRole } : item
      );
      setUser(updatedUsers);
      setFilteredUsers(updatedUsers);
      setEditingUserId(null);
      setEditedRole("");
    } catch (error) {
      console.error("Failed to update user role", error);
    }
  };

  // Lọc người dùng dựa trên từ khóa tìm kiếm
  useEffect(() => {
    const filtered = user.filter((item) =>
      item.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, user]);

  // Sắp xếp danh sách người dùng theo tên A-Z hoặc Z-A
  const handleSort = () => {
    const sortedUsers = [...filteredUsers].sort((a, b) =>
      isSortedAsc
        ? a.username.localeCompare(b.username)
        : b.username.localeCompare(a.username)
    );
    setFilteredUsers(sortedUsers);
    setIsSortedAsc(!isSortedAsc); // Đảo chiều sắp xếp cho lần nhấn nút tiếp theo
  };

  return (
    <div>
      <div className="container" style={{ paddingTop: "5px" }}>
        <div className="box_table_products">
          {/* Thanh tìm kiếm và nút sắp xếp */}
          <div
            className="container"
            style={{
              paddingTop: "50px",
              marginBottom: "15px",
              marginLeft: "-8px",
              width: "1800px",
            }}
          >
            <div className="box_table_products">
              <div className="header_table_products bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
                <span>Tìm kiếm</span>
              </div>
              <div className="body_table_products p-3 bg-white">
                {/* Thêm Pagination của MUI */}
                <div
                  className="d-flex align-items-center"
                  style={{ gap: "10px" }}
                >
                  <button
                    className="btn btn-primary button_sort"
                    onClick={handleSort}
                  >
                    Sắp xếp {isSortedAsc ? "A-Z" : "Z-A"}
                  </button>
                  <div className="flex-grow-1 position-relative">
                    <input
                      type="text"
                      placeholder="Search......"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-control"
                      style={{
                        paddingLeft: "40px", // Giảm độ rộng của ô input
                        height: "43px", // Đảm bảo ô input cao tương tự như nút
                        marginTop: "1px",
                        marginLeft: "1px",
                        border: "1px solid black",
                        fontSize: "15px",
                        width: "500px",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        left: "5px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "16px",
                        color: "#aaa",
                        pointerEvents: "none", // Để chuột không tương tác với biểu tượng
                      }}
                      role="img"
                      aria-label="search"
                    >
                      <i
                        className="fa-solid fa-magnifying-glass"
                        style={{ paddingLeft: "10px" }}
                      ></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="header_table_products bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
            <span>Danh Sách</span>
          </div>

          <div className="body_table_products p-3 bg-white">
            <table className="table table-bordered table-striped">
              <thead className="text-center">
                <tr>
                  <th>Tên người dùng</th>
                  <th>Email người dùng</th>
                  <th>Quyền truy cập</th>
                  <th>Thanh điều hướng</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((item) => (
                    <tr key={item._id}>
                      <td className="text-center">{item.username}</td>
                      <td className="text-center">{item.email}</td>
                      <td className="text-center">{item.role}</td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <button
                            className="me-3"
                            onClick={() => handleDelete(item._id)}
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
                          <button
                            onClick={() => handleEditCLick(item)}
                            style={{
                              borderRadius: "5px",
                              width: "70px",
                              height: "30px",
                              backgroundColor: "red",
                              color: "white",
                              border: "none",
                              fontSize: "1.3rem",
                              paddingLeft: "1px",
                            }}
                          >
                            Cập nhật
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Hiển thị form chỉnh sửa quyền truy cập và overlay */}
      {editingUserId && (
        <div className="overlay__phanquyen">
          <div className="boxPhanQuyen">
            <h3>Chỉnh sửa quyền truy cập người dùng</h3>
            <label>
              Quyền truy cập:
              <select
                value={editedRole}
                onChange={(e) => setEditedRole(e.target.value)}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <div className="mt-3">
              <button
                className="btn btn-success me-2 saveDecentralization1"
                onClick={handleSaveEdit}
              >
                Lưu
              </button>
              <button
                className="btn btn-secondary saveDecentralization2"
                onClick={() => setEditingUserId(null)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
