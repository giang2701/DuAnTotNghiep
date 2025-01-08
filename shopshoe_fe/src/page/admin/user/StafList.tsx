import { useEffect, useState } from "react";
import instance from "../../../api";
import { User } from "../../../interface/User";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Pagination } from "@mui/material";

const StafList = () => {
    const [user, setUser] = useState<User[]>([]); // Danh sách người dùng
    const UserLocal = localStorage.getItem("user");
    const level = UserLocal ? JSON.parse(UserLocal).level : null;
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // Danh sách người dùng đã lọc
    const [editingUserId, setEditingUserId] = useState<string | null>(null); // ID người dùng đang chỉnh sửa
    const [editedRole, setEditedRole] = useState<string>(""); // Vai trò người dùng đang chỉnh sửa
    const [searchTerm, setSearchTerm] = useState<string>(""); // Từ khóa tìm kiếm
    const [isSortedAsc, setIsSortedAsc] = useState<boolean>(true); // Trạng thái sắp xếp
    const [showRoleFilter, setShowRoleFilter] = useState(false); // Trạng thái hiển thị bộ lọc vai trò
    const [filterRole, setFilterRole] = useState<string>(""); // Bộ lọc vai trò
    // const [showInactive, setShowInactive] = useState(false);
    const productsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setCurrentPage(value);
    };
    useEffect(() => {
        (async () => {
            const { data } = await instance.get("/user");
            // setUser(data.data);
            // setFilteredUsers(data.data);
            setUser(data.data.filter((user: User) => user.role === "admin"));
            console.log(data.data);
            setFilteredUsers(
                data.data.filter((user: User) => {
                    user.level !== "boss", user.role === "member";
                })
            ); // Lọc bỏ 'boss'
            console.log(setFilteredUsers);
        })();
    }, []);

    const handleDelete = async (_id: string) => {
        if (window.confirm("Bạn có chắc muốn xóa người dùng này không?")) {
            await instance.delete(`/user/${_id}`);
            const updatedUsers = user.filter((item) => item._id !== _id);
            setUser(updatedUsers);
            setFilteredUsers(updatedUsers);
        }
    };

    const handleEditClick = (user: User) => {
        setEditingUserId(user._id?.toString() ?? null);
        setEditedRole(user.role ?? "member");
    };

    const handleSaveEdit = async () => {
        if (!editingUserId) return;
        try {
            await instance.put(`/user/${editingUserId}`, { role: editedRole });
            const updatedUsers = user.map((item) =>
                item._id === editingUserId
                    ? ({ ...item, role: editedRole } as User)
                    : item
            );
            setUser(updatedUsers);
            setFilteredUsers(updatedUsers);
            setEditingUserId(null);
            setEditedRole("");
        } catch (error) {
            console.error("Failed to update user role", error);
        }
    };

    const toggleActiveStatus = async (
        userId: string,
        currentStatus: boolean
    ) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "custom-confirm-button",
                cancelButton: "custom-cancel-button",
            },
            buttonsStyling: false,
        });
        try {
            const result = await swalWithBootstrapButtons.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
            });
            if (result.isConfirmed) {
                const updatedStatus = !currentStatus;
                await instance.put(`/user/${userId}`, {
                    isActive: updatedStatus,
                });

                const updatedUsers = user.map((item) =>
                    item._id === userId
                        ? { ...item, isActive: updatedStatus }
                        : item
                );
                swalWithBootstrapButtons.fire({
                    title: "Successfully!",

                    icon: "success",
                });
                setUser(updatedUsers);
                setFilteredUsers(updatedUsers);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Account Activated Cancelled",
                    icon: "error",
                });
            }
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Đã xảy ra lỗi, vui lòng thử lại sau.";
            Swal.fire({
                icon: "error",
                title: "Lỗi Khi khi thay đổi trạng thái người dùng",
                text: errorMessage, // Hiển thị nội dung của message
            });
        }
    };

    useEffect(() => {
        let filtered = user.filter(
            (item) =>
                item.username
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) || // Tìm kiếm theo tên người dùng
                item.email?.toLowerCase().includes(searchTerm.toLowerCase()) // Tìm kiếm theo email
        );
        if (filterRole) {
            filtered = filtered.filter((item) => item.role === filterRole);
        }

        // Lọc trừ level "boss"
        filtered = filtered.filter((item) => item.level !== "boss");

        setFilteredUsers(filtered);
    }, [searchTerm, user, filterRole]);

    const handleSort = () => {
        const sortedUsers = [...filteredUsers].sort((a, b) =>
            isSortedAsc
                ? a.username?.localeCompare(b.username ?? "") || 0
                : b.username?.localeCompare(a.username ?? "") || 0
        );
        setFilteredUsers(sortedUsers);
        setIsSortedAsc(!isSortedAsc);
    };
    const toggleRoleFilter = () => {
        setShowRoleFilter(!showRoleFilter);
    };
    const applyRoleFilter = (role: string) => {
        setFilterRole(role);
        setShowRoleFilter(false);
    };
    return (
        <div>
            <div className="container" style={{ paddingTop: "5px" }}>
                <div className="box_table_products">
                    <div
                        className="container"
                        style={{
                            paddingTop: "50px",
                            marginBottom: "15px",
                            marginLeft: "-8px",
                            width: "100%",
                        }}
                    >
                        <div className="box_table_products">
                            <div className="header_table_products bg-black text-white fs-5 fw-medium py-3 ps-3 d-flex justify-content-between">
                                <span>Tìm kiếm</span>
                            </div>
                            <div
                                className="body_table_products p-3 bg-white"
                                style={{ width: "1260px" }}
                            >
                                <div
                                    className="d-flex align-items-center"
                                    style={{ gap: "10px" }}
                                >
                                    {/* <button
                                        className="button_sort"
                                        onClick={handleSort}
                                        style={{
                                            fontSize: "13px",
                                            marginTop: "10px",
                                        }}
                                    >
                                        Sắp xếp {isSortedAsc ? "A-Z" : "Z-A"}
                                        <i
                                            className="fa-duotone fa-solid fa-filter"
                                            onClick={toggleRoleFilter}
                                            style={{
                                                paddingLeft: "5px",
                                                fontSize: "18px",
                                                paddingTop: "1px",
                                            }}
                                        ></i>
                                        {showRoleFilter && (
                                            <div
                                                className="position-absolute mt-3 bg-white border p-2 rounded shadow"
                                                style={{
                                                    zIndex: 100,
                                                    left: "18px",
                                                    width: "110px",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        fontSize: "13px",
                                                        paddingRight: "1px",
                                                    }}
                                                >
                                                    Quyền truy cập:
                                                </p>
                                                <p
                                                    onClick={() =>
                                                        applyRoleFilter("admin")
                                                    }
                                                >
                                                    Admin
                                                </p>
                                                <p
                                                    onClick={() =>
                                                        applyRoleFilter(
                                                            "member"
                                                        )
                                                    }
                                                >
                                                    Member
                                                </p>
                                                <p
                                                    onClick={() =>
                                                        applyRoleFilter("")
                                                    }
                                                >
                                                    Tất cả
                                                </p>
                                            </div>
                                        )}
                                    </button> */}
                                    <div className="flex-grow-1 position-relative">
                                        <input
                                            type="text"
                                            placeholder="Search......"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="form-control"
                                            style={{
                                                paddingLeft: "40px",
                                                height: "43px",
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
                                                pointerEvents: "none",
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
                                    {level === "boss" && (
                                        <th>Quyền truy cập</th>
                                    )}
                                    <th> Active/ deactive</th>
                                    {level === "boss" && <th>Quyền Hạn</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers
                                        .slice(
                                            (currentPage - 1) * productsPerPage,
                                            currentPage * productsPerPage
                                        )
                                        .map((item) => (
                                            <tr key={item._id}>
                                                <td className="text-center">
                                                    {item.username}
                                                </td>
                                                <td className="text-center">
                                                    {item.email}
                                                </td>
                                                <td className="text-center">
                                                    {item.role}
                                                </td>
                                                {level === "boss" && (
                                                    <td>
                                                        <div
                                                            className="d-flex justify-content-center"
                                                            style={{
                                                                gap: "10px",
                                                            }}
                                                        >
                                                            {/* <button
                              className="me-3"
                              onClick={() =>
                                handleDelete(item._id?.toString() ?? "")
                              }
                              style={{
                                borderRadius: "5px",
                                width: "30px",
                                height: "30px",
                                backgroundColor: "black",
                                color: "white",
                                border: "none",
                              }}
                            >
                              {" "}
                              <i className="fa-solid fa-trash"></i>
                            </button> */}

                                                            <button
                                                                onClick={() =>
                                                                    handleEditClick(
                                                                        item
                                                                    )
                                                                }
                                                                style={{
                                                                    borderRadius:
                                                                        "5px",
                                                                    width: "70px",
                                                                    height: "30px",
                                                                    backgroundColor:
                                                                        "red",
                                                                    color: "white",
                                                                    border: "none",
                                                                }}
                                                            >
                                                                Cập nhật
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}

                                                <td className="d-flex justify-content-center">
                                                    <button
                                                        className="Button_admin "
                                                        onClick={() =>
                                                            toggleActiveStatus(
                                                                item._id?.toString() ??
                                                                    "",
                                                                item.isActive ??
                                                                    false
                                                            )
                                                        }
                                                        style={{
                                                            borderRadius: "5px",
                                                            width: "90px",
                                                            height: "30px",
                                                            backgroundColor:
                                                                item.isActive
                                                                    ? "green"
                                                                    : "gray",
                                                            color: "white",
                                                            border: "none",
                                                        }}
                                                    >
                                                        {item.isActive
                                                            ? "Khóa Tài Khoản"
                                                            : "Kích Hoạt"}
                                                    </button>
                                                </td>
                                                {level === "boss" && (
                                                    <td className="text-center">
                                                        <Link
                                                            to={`/admin/user/permission/${item._id}`}
                                                        >
                                                            <button
                                                                className="Button_admin"
                                                                style={{
                                                                    borderRadius:
                                                                        "5px",
                                                                    width: "70px",
                                                                    height: "30px",
                                                                    backgroundColor:
                                                                        "red",
                                                                    color: "white",
                                                                    border: "none",
                                                                }}
                                                            >
                                                                Quyền
                                                            </button>
                                                        </Link>
                                                    </td>
                                                )}
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
                        <Pagination
                            count={Math.ceil(
                                filteredUsers.length / productsPerPage
                            )}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            className="d-flex justify-content-center mt-4"
                        />
                    </div>
                </div>
            </div>

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
                                className="btn btn-success me-2"
                                onClick={handleSaveEdit}
                            >
                                Lưu
                            </button>
                            <button
                                className="btn btn-secondary"
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

export default StafList;
