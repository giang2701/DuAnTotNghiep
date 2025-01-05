import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../../../interface/User";
import instance from "../../../api";
import Swal from "sweetalert2";

const PermissionDenied = () => {
    const { id } = useParams();
    const [userDetail, setUserDetail] = useState<User | null>(null);
    const [permissionId, setPermissionId] = useState<string[]>([]); // Mảng lưu quyền

    useEffect(() => {
        (async () => {
            const { data } = await instance.get(`/user/${id}`);
            setUserDetail(data.data);
            // Lấy quyền đã được gán cho người dùng
            if (data.data.permissions) {
                setPermissionId(data.data.permissions); // Giả sử API trả về permissions
            }
        })();
    }, [id]);

    const handleCheckboxChange = (permission: string) => {
        setPermissionId((prev) => {
            const isChecked = prev.includes(permission);
            // Cập nhật danh sách quyền
            return isChecked
                ? prev.filter((id) => id !== permission) // Bỏ chọn
                : [...prev, permission]; // Chọn
        });
    };

    const handleSubmit = async () => {
        try {
            await instance.post(`/permissions/users/${id}/permissions`, {
                permissionId, // Gửi mảng quyền đã chọn
            });
            Swal.fire({
                icon: "success",
                title: "Cập nhật quyền thành công",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error("Lỗi khi cập nhật quyền:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    return (
        <div className="container">
            <div className="d-flex mt-5">
                <div className="mt-4" style={{ width: "40%" }}>
                    <div
                        style={{
                            width: "85%",
                            margin: "20px auto",
                            height: "550px",
                            borderRadius: "10px",
                            boxShadow: `rgba(0, 0, 0, 0.35) 0px 5px 15px`,
                        }}
                    >
                        <div className="img d-flex justify-content-center">
                            <img
                                src={userDetail?.avatar}
                                alt=""
                                style={{
                                    width: "30%",
                                    borderRadius: "50%",
                                    marginTop: "40px",
                                }}
                            />
                        </div>
                        <p className="text-center mt-4 fw-bold fs-2">
                            {userDetail?.username}
                        </p>
                        {userDetail?.level !== "boss" ? (
                            <button
                                className="Button_admin d-flex justify-content-center align-items-center m-auto"
                                style={{
                                    borderRadius: "5px",
                                    width: "70px",
                                    height: "30px",
                                    backgroundColor: "red",
                                    color: "white",
                                    border: "none",
                                }}
                            >
                                Nhân Viên
                            </button>
                        ) : (
                            <button
                                className="Button_admin d-flex justify-content-center align-items-center m-auto"
                                style={{
                                    borderRadius: "5px",
                                    width: "70px",
                                    height: "30px",
                                    backgroundColor: "red",
                                    color: "white",
                                    border: "none",
                                }}
                            >
                                Admin
                            </button>
                        )}
                        <p
                            className="ms-5 fw-bold fs-2"
                            style={{ fontFamily: "serif", marginTop: "50px" }}
                        >
                            <i className="fa-solid fa-circle-info fs-5 text-primary me-2"></i>
                            Thông Tin Nhân Viên
                        </p>
                        <ul style={{ marginLeft: "40px" }}>
                            <li className="text-dark">
                                Phone: ****************
                            </li>
                            <li className="text-dark">
                                Address: ******,******,******
                            </li>
                            <li className="text-dark">
                                Email: {userDetail?.email}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="w-50">
                    <div style={{ marginTop: "30px" }}>
                        <h3 className="fw-bold fs-2 pt-3">Danh Sách Quyền</h3>
                        <table
                            className="table table-striped table-bordered"
                            style={{
                                height: "400px",
                                fontSize: "15px",
                                width: "700px",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th className="py-4">Quyền</th>
                                    <th className="py-4 text-center">Thêm</th>
                                    <th className="py-4 text-center">Sửa</th>
                                    <th className="py-4 text-center">Xóa</th>
                                    <th className="py-4 text-center">
                                        Giảm Giá
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/** Các quyền */}
                                {[
                                    {
                                        name: "Quản Lý Sản Phẩm",
                                        ids: [
                                            "67677468977b2d90715a723d", // Thêm
                                            "67677464977b2d90715a723b", // Sửa
                                            "6767746f977b2d90715a723f", // Xóa
                                            "677a2370439720e13f9e3d56", // giảm giá
                                        ],
                                    },
                                    {
                                        name: "Quản Lý Biến Thể (Size)",
                                        ids: [
                                            "6767913e17d173ba48ab9558", // Thêm
                                            null, // Sửa ko có
                                            "6767913417d173ba48ab9554", // Xóa
                                            null, // giảm giá ko có
                                        ],
                                    },
                                    {
                                        name: "Quản Lý Danh Mục",
                                        ids: [
                                            "676790bd719ba0030d5234f3", // Thêm
                                            "676790b7719ba0030d5234f1", // Sửa
                                            "676790c4719ba0030d5234f5", // Xóa
                                            null, // giảm giá ko có
                                        ],
                                    },
                                    {
                                        name: "Quản Lý Thương Hiệu",
                                        ids: [
                                            "6767908a4c43995efdfe21ba", // Thêm
                                            "676790934c43995efdfe21bc", // Sửa
                                            "676790854c43995efdfe21b8", // Xóa
                                            null, // giảm giá ko có
                                        ],
                                    },
                                    {
                                        name: "Quản Lý Đơn Hàng",
                                        ids: [
                                            null, // Thêm không có
                                            "676791154628a5e0d6bea916", // Sửa
                                            null, // Xóa không có
                                            null, // giảm giá ko có
                                        ],
                                    },
                                    {
                                        name: "Quản Lý Voucher",
                                        ids: [
                                            "676791827bb8c246e8ce7775", // Thêm
                                            "6767917f7bb8c246e8ce7773", // Sửa
                                            "6767917b7bb8c246e8ce7771", // Xóa
                                            null, // giảm giá ko có
                                        ],
                                    },
                                    {
                                        name: "Quản Lý Đánh Giá",
                                        ids: [
                                            null, // Thêm không có
                                            "676790dd3a8a9c257431d348", // Sửa
                                            null, // Xóa không có
                                            null, // giảm giá ko có
                                        ],
                                    },
                                    {
                                        name: "Quản Lý Nhân Viên",
                                        ids: [
                                            null, // Thêm không có
                                            "6767915fabc2de264978c17d", // Sửa
                                            null, // Xóa không có
                                            null, // giảm giá ko có
                                        ],
                                    },
                                    {
                                        name: "Quản Lý Bài Viết",
                                        ids: [
                                            "677a1de4ef53133450ce4c7a", // Thêm
                                            "677a1e13ef53133450ce4c7c", // Sửa
                                            "677a1e28ef53133450ce4c7e", // Xóa
                                            null, // giảm giá ko có
                                        ],
                                    },
                                ].map((permission) => (
                                    <tr key={permission.name}>
                                        <td>{permission.name}</td>
                                        {permission.ids.map((id, index) => (
                                            <td
                                                key={index}
                                                className="text-center"
                                            >
                                                {id ? (
                                                    <input
                                                        type="checkbox"
                                                        checked={permissionId.includes(
                                                            id
                                                        )}
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                id
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <span></span> // Chỗ trống khi ID là null
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            onClick={handleSubmit}
                            className="Button_admin  align-items-center m-auto fs-3"
                            style={{
                                borderRadius: "5px",
                                width: "140px",
                                height: "40px",
                                backgroundColor: "red",
                                color: "white",
                                border: "none",
                            }}
                        >
                            Cập Nhật Quyền
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PermissionDenied;
