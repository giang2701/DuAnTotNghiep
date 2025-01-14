import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Menu,
    MenuItem,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Pagination,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import instance from "../../../api/index";
import Swal from "sweetalert2";

interface RefundRequest {
    _id: string;
    orderId: { _id: string };
    userId: { _id: string; name: string };
    bankName: string;
    accountNumber: string;
    accountName: string;
    phoneNumber: string;
    qrCodeImage: string;
    status: string;
    createdAt: string;
}

const RefundManagement = () => {
    const [refunds, setRefunds] = useState<RefundRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(
        null
    );
    const [currentPage, setCurrentPage] = useState(1);
    const refundsPerPage = 15;

    const fetchRefunds = async () => {
        try {
            const response = await instance.get("/refunds");
            console.log(response.data);
            // Sắp xếp danh sách hoàn tiền theo ngày tạo, mới nhất lên đầu
            const sortedRefunds = [...response.data].sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
            });
            setRefunds(sortedRefunds);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách yêu cầu hoàn tiền.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRefunds();
    }, []);

    const updateRefundStatus = async (id: string, status: string) => {
        try {
            await instance.patch(`/refunds/${id}/status`, { status });
            toast.success(`Trạng thái đã được cập nhật: ${status}.`);
            await fetchRefunds();
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái yêu cầu.");
        }
    };

    const deleteRefund = async (id: string) => {
        try {
            await instance.delete(`/refunds/${id}`);
            toast.success("Yêu cầu hoàn tiền đã được xóa.");
            await fetchRefunds();
        } catch (error) {
            toast.error("Bạn không có quyền xóa.");
        }
    };

    const filteredRefunds = refunds.filter((item) => {
        if (filter === "all") return true;
        // Chuẩn hóa giá trị của filter
        const normalizedFilter =
            filter === "Pending"
                ? "Đang chờ xử lý"
                : filter === "Approved"
                ? "Đã được phê duyệt"
                : filter === "Rejected"
                ? "Bị từ chối"
                : filter; // Nếu không khớp thì giữ nguyên giá trị

        return item.status === normalizedFilter;
    });

    // Logic phân trang
    const indexOfLastRefund = currentPage * refundsPerPage;
    const indexOfFirstRefund = indexOfLastRefund - refundsPerPage;
    const currentRefunds = filteredRefunds.slice(
        indexOfFirstRefund,
        indexOfLastRefund
    );

    // Hàm xử lý khi thay đổi trang
    const handlePageChange = (event: any, value: number) => {
        setCurrentPage(value);
    };

    const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = (filter: string) => {
        setFilter(filter);
        setAnchorEl(null);
        setCurrentPage(1); // Reset trang hiện tại khi thay đổi filter
    };

    const handleOpenDialog = (refundRequest: RefundRequest) => {
        setSelectedRefund(refundRequest);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedRefund(null);
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
            {/* Title bar với filter menu */}
            <Box sx={{ width: "100%" }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 20px",
                        backgroundColor: "black",
                        color: "white",
                    }}
                >
                    <Typography variant="h6">
                        Quản Lý Yêu Cầu Hoàn Tiền
                    </Typography>
                    {/* Filter menu */}
                    <IconButton onClick={handleClickMenu}>
                        <FilterListIcon style={{ color: "white" }} />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem onClick={() => handleCloseMenu("all")}>
                            Tất cả
                        </MenuItem>
                        <MenuItem onClick={() => handleCloseMenu("Pending")}>
                            Đang chờ xử lý
                        </MenuItem>
                        <MenuItem onClick={() => handleCloseMenu("Approved")}>
                            Đã được phê duyệt
                        </MenuItem>
                        <MenuItem onClick={() => handleCloseMenu("Rejected")}>
                            Bị từ chối
                        </MenuItem>
                    </Menu>
                </Box>
                {/* Table hiển thị danh sách yêu cầu hoàn tiền */}
                <Box sx={{ padding: "10px", backgroundColor: "#fff" }}>
                    <table
                        className="table table-bordered table-striped text-center"
                        style={{ width: "100%" }}
                    >
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>ID Đơn Hàng</th>
                                <th>Thời Gian</th>
                                <th>Số Điện Thoại</th>
                                <th>Ngân hàng</th>
                                <th>Số tài khoản</th>
                                <th>Tên tài khoản</th>
                                <th>Ảnh QR</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRefunds.length === 0 ? (
                                <tr>
                                    <td colSpan={10}>
                                        Không có yêu cầu hoàn tiền phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                currentRefunds.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td>{item.orderId?._id}</td>
                                        <td>
                                            {new Date(
                                                item.createdAt
                                            ).toLocaleString("vi-VN")}
                                        </td>
                                        <td>{item.phoneNumber}</td>
                                        <td>{item.bankName}</td>
                                        <td>{item.accountNumber}</td>
                                        <td>{item.accountName}</td>
                                        <td>
                                            {item.qrCodeImage && (
                                                <img
                                                    src={`http://localhost:8000/${item.qrCodeImage}`}
                                                    alt="QR Code"
                                                    style={{
                                                        width: "50px",
                                                        height: "auto",
                                                    }}
                                                />
                                            )}
                                        </td>
                                        <td>{item.status}</td>
                                        <td
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "5px",
                                            }}
                                        >
                                            {/* Nút xem chi tiết */}
                                            <IconButton
                                                onClick={() =>
                                                    handleOpenDialog(item)
                                                }
                                                aria-label="view"
                                                style={{
                                                    borderRadius: "5px",
                                                    width: "30px",
                                                    height: "30px",
                                                    color: "white",
                                                    backgroundColor: "black",
                                                    border: "none",
                                                    padding: "0",
                                                }}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>

                                            {/* Nút phê duyệt */}
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() =>
                                                    updateRefundStatus(
                                                        item._id,
                                                        "Đã được phê duyệt"
                                                    )
                                                }
                                                disabled={
                                                    item.status !==
                                                    "Đang chờ xử lý"
                                                }
                                            >
                                                Phê Duyệt
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "20px",
                        }}
                    >
                        <Pagination
                            count={Math.ceil(
                                filteredRefunds.length / refundsPerPage
                            )}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </Box>
            </Box>

            {/* Dialog hiển thị chi tiết yêu cầu hoàn tiền (bao gồm ảnh QR code) */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
                <DialogTitle>Chi tiết yêu cầu hoàn tiền</DialogTitle>
                <DialogContent>
                    {selectedRefund && (
                        <Box>
                            <Typography>
                                ID Đơn hàng: {selectedRefund.orderId._id}
                            </Typography>
                            <Typography>
                                Tên khách hàng: {selectedRefund.userId.name}
                            </Typography>
                            <Typography>
                                Số điện thoại: {selectedRefund.phoneNumber}
                            </Typography>
                            <Typography>
                                Ngân hàng: {selectedRefund.bankName}
                            </Typography>
                            <Typography>
                                Số tài khoản: {selectedRefund.accountNumber}
                            </Typography>
                            <Typography>
                                Tên tài khoản: {selectedRefund.accountName}
                            </Typography>
                            {selectedRefund.qrCodeImage && (
                                <Box mt={2}>
                                    <Typography variant="h6">
                                        Ảnh QR Code:
                                    </Typography>
                                    {selectedRefund.qrCodeImage && (
                                        <img
                                            src={`http://localhost:8000/${selectedRefund.qrCodeImage}`}
                                            alt="QR Code"
                                            style={{
                                                width: "300px",
                                                height: "auto",
                                            }}
                                        />
                                    )}
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RefundManagement;
