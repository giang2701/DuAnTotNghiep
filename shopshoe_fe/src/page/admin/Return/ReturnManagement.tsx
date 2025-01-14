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
    TextField,
    Pagination,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import instance from "../../../api/index";
import Swal from "sweetalert2";

interface ReturnRequest {
    _id: string;
    orderId: { _id: string };
    userId: { _id: string; name: string };
    userName: string;
    userPhone: string;
    reason: string;
    status: string;
    images: string[];
    videos: string[];
    createdAt: string;
    rejectionReason?: string; // Thêm trường rejectionReason
}

interface ReturnManagementProps {
    onReturnApproved: (orderId: string) => void;
}

const ReturnManagement: React.FC<ReturnManagementProps> = ({
    onReturnApproved,
}) => {
    const [returns, setReturns] = useState<ReturnRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(
        null
    );
    const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại
    const returnsPerPage = 15; // Số lượng returns trên mỗi trang

    const [rejectionReason, setRejectionReason] = useState<string>(""); // State cho lý do từ chối
    const [openRejectionDialog, setOpenRejectionDialog] = useState(false); // State cho dialog từ chối

    const fetchReturns = async () => {
        try {
            const response = await instance.get("/returns");
            console.log(response.data);

            // Sắp xếp danh sách returns theo ngày tạo, mới nhất lên đầu
            const sortedReturns = [...response.data].sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA; // Sắp xếp giảm dần
            });
            setReturns(sortedReturns);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách hoàn trả.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    const updateReturnStatus = async (
        id: string,
        status: string,
        orderId: string,
        rejectionReason?: string // Thêm rejectionReason
    ) => {
        try {
            await instance.patch(`/returns/${id}/status`, {
                status,
                rejectionReason,
            });
            toast.success(`Trạng thái đã được cập nhật: ${status}.`);
            await fetchReturns();
            if (status === "Đang hoàn tiền") {
                // await instance.patch(`/orders/${orderId}/status`, {
                //  status: "Refunding",
                // });
            }
            if (status === "Đã được phê duyệt") {
                onReturnApproved(orderId);
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái yêu cầu.");
        }
    };

    const handleReject = (returnRequest: ReturnRequest) => {
        setSelectedReturn(returnRequest);
        setOpenRejectionDialog(true);
    };

    const handleConfirmRejection = () => {
        if (selectedReturn) {
            updateReturnStatus(
                selectedReturn._id,
                "Bị từ chối",
                selectedReturn.orderId._id,
                rejectionReason
            );
            setOpenRejectionDialog(false);
            setRejectionReason("");
        }
    };

    const deleteReturn = async (id: string) => {
        try {
            await instance.delete(`/returns/${id}`);
            toast.success("Yêu cầu hoàn trả đã được xóa.");
            await fetchReturns();
        } catch (error) {
            toast.error("Bạn ko có quyền xóa.");
        }
    };

    const filteredReturns = returns.filter((item) => {
        if (filter === "all") return true;

        // Chuẩn hóa giá trị của filter
        const normalizedFilter =
            filter === "Đang chờ xử lý"
                ? "Đang chờ xử lý"
                : filter === "Đã được phê duyệt"
                ? "Đã được phê duyệt"
                : filter === "Bị từ chốí" // Typo: "Bị từ chốí" should be "Bị từ chối"
                ? "Bị từ chối"
                : filter; // Nếu không khớp thì giữ nguyên giá trị

        return item.status === normalizedFilter;
    });

    // Logic phân trang
    const indexOfLastReturn = currentPage * returnsPerPage;
    const indexOfFirstReturn = indexOfLastReturn - returnsPerPage;
    const currentReturns = filteredReturns.slice(
        indexOfFirstReturn,
        indexOfLastReturn
    );

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = (filter: string) => {
        setFilter(filter);
        setAnchorEl(null);
        setCurrentPage(1); // Reset về trang đầu tiên sau khi thay đổi bộ lọc
    };

    const handleOpenDialog = (returnRequest: ReturnRequest) => {
        setSelectedReturn(returnRequest);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedReturn(null);
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
                        Quản Lý Yêu Cầu Hoàn Trả
                    </Typography>
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
                        <MenuItem
                            onClick={() => handleCloseMenu("Đã được phê duyệt")}
                        >
                            Đã được phê duyệt
                        </MenuItem>
                        <MenuItem
                            onClick={() => handleCloseMenu("Đang chờ xử lý")}
                        >
                            Đang chờ xử lý
                        </MenuItem>
                    </Menu>
                </Box>
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
                                <th>Tên Khách Hàng</th>
                                <th>Số Điện Thoại</th>
                                <th>Lý Do</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReturns.length === 0 ? (
                                <tr>
                                    <td colSpan={8}>
                                        Không có yêu cầu hoàn trả phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                currentReturns.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{index + 1}</td>
                                        <td>{item.orderId._id}</td>
                                        <td>
                                            {new Date(
                                                item.createdAt
                                            ).toLocaleString("vi-VN")}
                                        </td>
                                        <td>{item.userName}</td>
                                        <td>{item.userPhone}</td>
                                        <td>{item.reason}</td>
                                        <td>{item.status}</td>
                                        <td
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "5px",
                                            }}
                                        >
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
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() =>
                                                    updateReturnStatus(
                                                        item._id,
                                                        "Đã được phê duyệt",
                                                        item.orderId._id
                                                    )
                                                }
                                                disabled={
                                                    item.status !==
                                                    "Đang chờ xử lý"
                                                }
                                            >
                                                Phê Duyệt
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() =>
                                                    handleReject(item)
                                                }
                                                disabled={
                                                    item.status !==
                                                    "Đang chờ xử lý"
                                                }
                                            >
                                                Từ Chối
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() =>
                                                    updateReturnStatus(
                                                        item._id,
                                                        "Đang hoàn tiền",
                                                        item.orderId._id
                                                    )
                                                }
                                                disabled={
                                                    item.status !==
                                                    "Đang hoàn hàng"
                                                }
                                            >
                                                Đã nhận hàng
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
                        count={Math.ceil(
                            filteredReturns.length / returnsPerPage
                        )}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </Box>

            {/* Dialog to display images and videos */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
                <DialogTitle>Chi tiết yêu cầu hoàn trả</DialogTitle>
                <DialogTitle>Lý Do: {selectedReturn?.reason}</DialogTitle>
                <DialogContent>
                    {selectedReturn?.images && (
                        <Box>
                            <Typography variant="h5">Hình ảnh:</Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                                {selectedReturn.images.map((image) => (
                                    <img
                                        key={image}
                                        src={`http://localhost:8000${image}`}
                                        alt="Return Image"
                                        style={{
                                            width: "200px",
                                            height: "200px",
                                            objectFit: "cover",
                                            margin: "5px",
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                    {selectedReturn?.videos && (
                        <Box mt={2}>
                            <Typography variant="h5">Video:</Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                                {selectedReturn.videos.map((video) => (
                                    <video
                                        key={video}
                                        src={`http://localhost:8000${video}`}
                                        controls
                                        style={{
                                            width: "300px",
                                            height: "200px",
                                            margin: "5px",
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Đóng</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog to input rejection reason */}
            <Dialog
                open={openRejectionDialog}
                onClose={() => setOpenRejectionDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Lý Do Từ Chối</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="rejectionReason"
                        label="Lý Do Từ Chối"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRejectionDialog(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmRejection} color="primary">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReturnManagement;
