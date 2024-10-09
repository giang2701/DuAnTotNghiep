import { Box } from "@mui/material";
import { styled } from "@mui/system";

const ImgContainer = styled(Box)({
    width: 100,
    height: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
});

interface ImgProductDetailProps {
    product: {
        imgCategory: string[];
    };
}

const ImgProductDetail = ({ product }: ImgProductDetailProps) => {
    // Kiểm tra nếu imgCategory là một mảng và có ít nhất 1 URL
    if (!Array.isArray(product.imgCategory) || product.imgCategory.length === 0) {
        return <div>Không có ảnh danh mục</div>;
    }

    return (
        <Box>
            {product.imgCategory.map((imgUrl, index) => (
                <ImgContainer key={index}>
                    <img src={imgUrl} alt={`Category ${index}`} style={{ maxWidth: "100%", height: "auto" }} />
                </ImgContainer>
            ))}
        </Box>
    );
};

export default ImgProductDetail;
