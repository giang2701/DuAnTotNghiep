import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import instance from "../../../api";
import { FlashSale } from "../../../interface/Products";
import { useNavigate, useParams } from "react-router-dom";
import { useFlashSale } from "../../../context/FlashSale";
import { useForm } from "react-hook-form";
import moment from "moment";

const ApplyFlashSale = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { flashSale } = useFlashSale();
    const [selectedFlashSale, setSelectedFlashSale] = useState<FlashSale>(); // Lưu flash sale đã chọn
    const [activeFlashSale, setActiveFlashSale] = useState<FlashSale | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm(); // Khởi tạo react-hook-form

    useEffect(() => {
        // Lấy Flash Sale đang hoạt động dựa trên thời gian hiện tại
        const currentTime = new Date().getTime();
        const activeSale = flashSale.find(
            (sale) =>
                sale.isActive && // Kiểm tra trạng thái `isActive`
                new Date(sale.endDate).getTime() > currentTime // Kiểm tra nếu `endDate` lớn hơn thời gian hiện tại
        );
        setActiveFlashSale(activeSale || null);
    }, [flashSale]);

    const handleApplyFlashSale = async (data: any) => {
        // Lấy Flash Sale đang hoạt động
        const activeFlashSale = flashSale.find(
            (fs) => fs.isActive && moment(fs.startDate).isBefore(moment()) && moment(fs.endDate).isAfter(moment())
        );

        // Kiểm tra nếu Flash Sale đang hoạt động và sản phẩm đang cố gắng áp dụng không phải là Flash Sale đang hoạt động
        if (activeFlashSale && activeFlashSale._id !== data.flashSale) {
            toast.error(
                `Không thể áp dụng Flash Sale này vì Flash Sale "${activeFlashSale.title}" đang hoạt động.`
            );
            return;
        }


        if (!data.flashSale) return;

        try {
            const selected = flashSale.find((sale) => sale._id === data.flashSale);
            console.log("selected", selected);

            const dataSale = await instance.put(`/products/flashSale/${id}`, {
                flashSale: selected?._id,
            });
            console.log("dataSale", dataSale);

            toast.success("Áp mã Flash Sale Thành Công!");
            navigate("/admin/products");
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;

                if (errorMessage.includes("đã được áp dụng Flash Sale này rồi")) {
                    toast.error("Sản phẩm đã được áp dụng Flash Sale này rồi.");
                } else if (errorMessage.includes("đã được áp dụng")) {
                    toast.error("Sản phẩm đã được áp dụng một mã Flash Sale khác.");
                } else if (errorMessage.includes("đã hết hạn")) {
                    toast.error("Mã Flash Sale đã hết hạn, không thể áp dụng.");
                } else {
                    toast.error(errorMessage); // Hiển thị lỗi khác
                }
            } else {
                toast.error("Đã xảy ra lỗi không xác định khi áp mã Flash Sale.");
            }
        }
    };

    return (
        <div className="container">
            <h1 className="mt-2" style={{ display: "inline-block", fontFamily: "serif" }}>
                FlashSale
            </h1>
            <span style={{ marginLeft: "5px", fontFamily: "serif" }}>Áp mã</span>

            {/* Hiển thị thông báo Flash Sale đang hoạt động */}
            {activeFlashSale && (
                <div className="active-flash-sale">
                    <h4 className="active-flash-sale-title">Flash Sale đang hoạt động</h4>
                    <p>
                        Flash Sale: <strong>{activeFlashSale.title}</strong> đang hoạt động với mức giảm{" "}
                        <strong>{activeFlashSale.discountPercent}%</strong>.
                    </p>
                    <p>Vui lòng đợi đến khi kết thúc để áp dụng Flash Sale mới.</p>
                </div>
            )}

            {/* Hiển thị form nhập Flash Sale */}
            <form onSubmit={handleSubmit(handleApplyFlashSale)}>
                <div>
                    <label className="form-label">Danh sách Flash Sale:</label>
                    <select
                        {...register("flashSale", { required: "Flash Sale is required" })}
                        className="form-control"
                        onChange={(e) => {
                            const selected = flashSale.find(
                                (sale) => sale._id === e.target.value
                            );
                            setSelectedFlashSale(selected);
                        }}
                    >
                        <option value="">Select a Flash Sale</option>
                        {flashSale.map((sale) => (
                            <option key={sale._id} value={sale._id}>
                                {sale.title} - {sale.discountPercent}%
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" disabled={!selectedFlashSale} className="btn btn">
                    Apply Flash Sale
                </button>
            </form>
        </div>
    );
};

export default ApplyFlashSale;
