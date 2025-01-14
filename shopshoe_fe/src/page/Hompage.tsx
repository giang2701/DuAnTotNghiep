import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../api";
// import TymButton from "../component/Btn__tym";
import { ProductContext, ProductContextType } from "../context/ProductContext";
import { Product } from "../interface/Products";
import { toast } from "react-toastify";
import ProductItem from "./ProductItem";
import { useLoading } from "../context/Loading";
import Loading from "../component/Loading";
import FlashSaleSection from "./FlashSaleSection";
import { Baiviet } from "../interface/Baiviet";
import Swal from "sweetalert2";

const Hompage = () => {
  const { state } = useContext(ProductContext) as ProductContextType;
  const [productCate, setProductsCate] = useState<Product[]>([]);
  const [productCate2, setProductsCate2] = useState<Product[]>([]);
  const { apiLoading, setApiLoading } = useLoading();
  useEffect(() => {
    (async () => {
      setApiLoading(true);
      try {
        const { data } = await instance.get("/products");
        // Lọc sản phẩm chỉ lấy những sản phẩm có isActive là true
        const activeProducts = data.data.filter(
          (product: Product) => product.isActive
        );
        console.log("activeProducts", activeProducts);

        // console.log(data);
        // lọc sản phẩm theo id danh mục nam
        const filteredProducts = activeProducts.filter(
          (product: Product) => product.category?.title === "Nam"
        );
        // lọc sản phẩm theo id danh mục nữ
        const filteredProducts2 = activeProducts.filter(
          (product: Product) => product.category?.title === "Nữ"
        );
        // console.log(filteredProducts);
        setProductsCate(filteredProducts);
        setProductsCate2(filteredProducts2);
      } catch (error) {
        console.log(error);
      } finally {
        setApiLoading(false);
      }
    })();
  }, []);
  const [activeCategory, setActiveCategory] = useState("women");

  const showCategory = (category: string) => {
    setActiveCategory(category);
  };

  const userArray = localStorage.getItem("user");
  const user = userArray ? JSON.parse(userArray) : null;

  const [favorites, setFavorites] = useState<Product[]>(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites");
      return storedFavorites ? JSON.parse(storedFavorites) : []; // Đảm bảo luôn là mảng
    } catch (error) {
      console.error("Error parsing favorites from localStorage:", error);
      return []; // Trả về mảng trống khi có lỗi
    }
  });

  const toggleFavorite = async (item: Product) => {
    const isAlreadyFavorite = favorites.some((fav) => fav._id === item._id);
    console.log(isAlreadyFavorite);

    if (!user) {
      const isAlreadyFavorite = favorites.some((fav) => fav._id === item._id);
      // Xử lý khi không có user (chưa đăng nhập)
      const updatedFavorites = isAlreadyFavorite
        ? favorites.filter((fav) => fav._id !== item._id)
        : [...favorites, item];

      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      // Xử lý khi đã đăng nhập
      try {
        if (isAlreadyFavorite) {
          // Nếu đã thích, xóa khỏi server và localStorage
          await instance.delete(`/heart/${user._id}/${item._id}`);
          toast.success("Bỏ thích thành công");
          const updatedFavorites = favorites.filter(
            (fav) => fav._id !== item._id
          );
          setFavorites(updatedFavorites);
          localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        } else {
          // Nếu chưa thích, thêm vào server và localStorage
          const heart = {
            userId: user._id,
            productId: item._id,
          };
          await instance.post("/heart", heart);
          toast.success("Thích sản phẩm thành công");
          const updatedFavorites = [...favorites, item];
          setFavorites(updatedFavorites);
          localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    }
  };

  // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
  const isFavorite = (item: Product) => {
    // Kiểm tra `favorites` là mảng hợp lệ
    return (
      Array.isArray(favorites) && favorites.some((fav) => fav._id === item._id)
    );
  };

  const [relatedPosts, setRelatedPosts] = useState<Baiviet[]>([]);
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const { data } = await instance.get("/baiviet");
        if (data.data && data.data.length > 0) {
          const activeBaiviets = data.data
            .filter((item: Baiviet) => item.isActive === true)
            .sort((a: Baiviet, b: Baiviet) => {
              const dateA = new Date(a.publishDate).getTime();
              const dateB = new Date(b.publishDate).getTime();
              return dateB - dateA; // Sắp xếp giảm dần theo ngày đăng
            });
          setRelatedPosts(activeBaiviets);
        } else {
          Swal.fire("Thông báo", "Không có bài viết nào", "info");
        }
      } catch (error) {
        Swal.fire("Lỗi", "Không thể tải bài viết", "error");
      }
      // try {
      //     const { data } = await instance.get("/baiviet");
      //     // Lọc bỏ bài viết hiện tại
      //     const filteredPosts = data.data.filter(
      //         (post: Baiviet) => post._id !== id
      //     );
      //     setRelatedPosts(filteredPosts);
      // } catch (error) {
      //     console.error("Không thể tải danh sách bài viết:", error);
      // }
    };

    fetchRelatedPosts();
  }, [id]);

  return (
    <>
      {" "}
      {/* sm (Small devices, ≥576px)
                md (Medium devices, ≥768px)
                lg (Large devices, ≥992px)
                xl (Extra large devices, ≥1200px)
                xxl (Extra extra large devices, ≥1400px) 
            */}
      {/* banner */}
      {apiLoading ? (
        <Loading />
      ) : (
        <>
          {" "}
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={0}
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              />
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={1}
                aria-label="Slide 2"
              />
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={2}
                aria-label="Slide 3"
              />
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active " data-bs-interval="3000">
                <img
                  src="../../public/images/Banner__1.png"
                  className="d-block w-100"
                  alt="..."
                />
                <div className="carousel-caption slide-up">
                  <p className="introduction">
                    Discover the Latest Trends in Footwear
                  </p>
                  <h1>Step into Style with Our Latest Shoe Collection</h1>
                  <p className="describe">
                    Explore our exclusive range of trendy sneakers designed for
                    comfort and style. Find the perfect pair to express your
                    unique personality!
                  </p>
                  <div className="btn btn-primary">Shop Sneakers Now</div>
                </div>
              </div>
              <div className="carousel-item" data-bs-interval="3000">
                <img
                  src="../../public/images/Banner__2.png"
                  className="d-block w-100"
                  alt="..."
                />
                <div className="carousel-caption slide-up">
                  <p className="introduction">
                    Discover the Latest Trends in Footwear
                  </p>
                  <h1>Step into Style with Our Latest Shoe Collection</h1>
                  <p className="describe">
                    Explore our exclusive range of trendy sneakers designed for
                    comfort and style. Find the perfect pair to express your
                    unique personality!
                  </p>
                  <div className="btn btn-primary">Shop Sneakers Now</div>
                </div>
              </div>
              <div className="carousel-item" data-bs-interval="3000">
                <img
                  src="../../public/images/Banner__1.png"
                  className="d-block w-100"
                  alt="..."
                />
                <div className="carousel-caption slide-up">
                  <p className="introduction">
                    Discover the Latest Trends in Footwear
                  </p>
                  <h1>Step into Style with Our Latest Shoe Collection</h1>
                  <p className="describe">
                    Explore our exclusive range of trendy sneakers designed for
                    comfort and style. Find the perfect pair to express your
                    unique personality!
                  </p>
                  <div className="btn btn-primary">Shop Sneakers Now</div>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
          {/* ==========================Shipping================================================ */}
          <div className="box_shipping container-fluid ">
            <div className="sub_shipping container text-center ">
              <p>What we Serve</p>
              <p>Sneakers delivered straight to your doorstep</p>
              <div
                className="d-flex justify-content-evenly"
                style={{ marginTop: "80px" }}
              >
                {/* 1 : Free shipping */}
                <div className="Free_shipping">
                  <svg
                    width="144"
                    height="103"
                    viewBox="0 0 144 103"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_d_1_1486)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M101.528 43.9008C103.746 43.9008 105.293 42.2198 105.293 40.4499C105.293 38.68 103.746 36.999 101.528 36.999C99.3096 36.999 97.7633 38.68 97.7633 40.4499C97.7633 42.2198 99.3096 43.9008 101.528 43.9008ZM101.528 47.038C105.34 47.038 108.43 44.0884 108.43 40.4499C108.43 36.8114 105.34 33.8618 101.528 33.8618C97.7161 33.8618 94.6261 36.8114 94.6261 40.4499C94.6261 44.0884 97.7161 47.038 101.528 47.038Z"
                        fill="url(#paint0_linear_1_1486)"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M58.2347 43.9008C60.453 43.9008 61.9993 42.2198 61.9993 40.4499C61.9993 38.68 60.453 36.999 58.2347 36.999C56.0164 36.999 54.4701 38.68 54.4701 40.4499C54.4701 42.2198 56.0164 43.9008 58.2347 43.9008ZM58.2347 47.038C62.0464 47.038 65.1365 44.0884 65.1365 40.4499C65.1365 36.8114 62.0464 33.8618 58.2347 33.8618C54.4229 33.8618 51.3329 36.8114 51.3329 40.4499C51.3329 44.0884 54.4229 47.038 58.2347 47.038Z"
                        fill="url(#paint1_linear_1_1486)"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M47.3581 5C46.057 5 44.9716 5.99432 44.8579 7.29043L44.5635 10.6469H51.3332C52.0262 10.6469 52.588 11.2088 52.588 11.9018C52.588 12.5948 52.0262 13.1567 51.3332 13.1567H44.3433L44.1232 15.6664H48.8234C49.5165 15.6664 50.0783 16.2282 50.0783 16.9213C50.0783 17.6143 49.5165 18.1762 48.8234 18.1762H43.903L43.6829 20.6859H51.9606C52.6537 20.6859 53.2155 21.2477 53.2155 21.9408C53.2155 22.6338 52.6537 23.1957 51.9606 23.1957H43.4627L43.2426 25.7054H49.4509C50.1439 25.7054 50.7057 26.2672 50.7057 26.9603C50.7057 27.6533 50.1439 28.2151 49.4509 28.2151H43.0224L42.161 38.0348C42.0324 39.5018 43.1885 40.7639 44.6612 40.7639H50.0783C50.0783 36.2591 53.7302 32.6072 58.235 32.6072C62.7398 32.6072 66.3916 36.2591 66.3916 40.7639H87.3269H87.9748H93.3714C93.3714 36.2591 97.0233 32.6072 101.528 32.6072C106.033 32.6072 109.685 36.2591 109.685 40.7639H110.509C111.816 40.7639 112.904 39.7609 113.01 38.4583L113.992 26.4347C114.046 25.7672 113.832 25.1056 113.396 24.5972L105.417 15.288C104.94 14.7317 104.244 14.4115 103.511 14.4115H94.2498C93.8192 14.4115 93.4048 14.3013 93.0409 14.1012L93.707 7.77248C93.863 6.29063 92.7011 5 91.2111 5H47.3581ZM95.2314 16.5835C95.244 16.4201 95.3803 16.2939 95.5442 16.2939H102.234C102.584 16.2939 102.918 16.4402 103.156 16.6976L109.826 23.924C110.012 24.125 109.869 24.4505 109.596 24.4505H94.9651C94.7823 24.4505 94.6383 24.295 94.6523 24.1128L95.2314 16.5835ZM63.9398 17.2074L64.1807 15.8672H58.0218L56.1696 26.3328H57.8863L58.6994 21.7099H62.1629L62.4038 20.3847H58.9404L59.4975 17.2074H63.9398ZM71.78 16.5749C71.2379 16.1031 70.4397 15.8672 69.3857 15.8672H65.7716L63.9194 26.3328H65.6361L66.374 22.1466H67.6991L69.3555 26.3328H71.4035L69.5814 21.996C70.4347 21.7952 71.1073 21.4137 71.5993 20.8516C72.1012 20.2894 72.4124 19.672 72.5329 18.9994C72.573 18.7383 72.5931 18.5426 72.5931 18.4121C72.5931 17.6592 72.3221 17.0468 71.78 16.5749ZM70.8162 18.5627C70.8162 18.7032 70.8012 18.8488 70.771 18.9994C70.6807 19.5515 70.4397 19.9882 70.0482 20.3095C69.6667 20.6307 69.1548 20.7913 68.5123 20.7913H66.6149L67.2474 17.2074H69.1447C69.7069 17.2074 70.1235 17.3279 70.3946 17.5688C70.6757 17.7997 70.8162 18.131 70.8162 18.5627ZM76.2047 20.3697L76.7618 17.1923H80.8276L81.0686 15.8521H75.2861L73.4339 26.3328H79.2164L79.4573 24.9926H75.3915L75.9788 21.6948H79.5928L79.8187 20.3697H76.2047ZM84.1016 20.3697L84.6587 17.1923H88.7245L88.9654 15.8521H83.183L81.3308 26.3328H87.1132L87.3542 24.9926H83.2884L83.8757 21.6948H87.4897L87.7156 20.3697H84.1016Z"
                        fill="url(#paint2_linear_1_1486)"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M38.7841 8.13721C38.0911 8.13721 37.5292 8.69903 37.5292 9.39208C37.5292 10.0851 38.0911 10.647 38.7841 10.647H53.8426C54.5356 10.647 55.0975 10.0851 55.0975 9.39208C55.0975 8.69903 54.5356 8.13721 53.8426 8.13721H38.7841ZM33.7646 13.1567C33.0716 13.1567 32.5097 13.7185 32.5097 14.4116C32.5097 15.1046 33.0716 15.6664 33.7646 15.6664H53.8426C54.5356 15.6664 55.0975 15.1046 55.0975 14.4116C55.0975 13.7185 54.5356 13.1567 53.8426 13.1567H33.7646ZM35.0195 19.4311C35.0195 18.738 35.5813 18.1762 36.2744 18.1762H53.8426C54.5356 18.1762 55.0975 18.738 55.0975 19.4311C55.0975 20.1241 54.5356 20.6859 53.8426 20.6859H36.2744C35.5813 20.6859 35.0195 20.1241 35.0195 19.4311ZM31.2549 23.1957C30.5618 23.1957 30 23.7575 30 24.4506C30 25.1436 30.5618 25.7054 31.2549 25.7054H53.8426C54.5356 25.7054 55.0975 25.1436 55.0975 24.4506C55.0975 23.7575 54.5356 23.1957 53.8426 23.1957H31.2549Z"
                        fill="url(#paint3_linear_1_1486)"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_d_1_1486"
                        x="0"
                        y="0"
                        width="144"
                        height="102.038"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy="25" />
                        <feGaussianBlur stdDeviation="15" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0.972549 0 0 0 0 0.262745 0 0 0 0 0.266667 0 0 0 0.1 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_1_1486"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_1_1486"
                          result="shape"
                        />
                      </filter>
                      <linearGradient
                        id="paint0_linear_1_1486"
                        x1="101.528"
                        y1="33.8618"
                        x2="101.528"
                        y2="47.038"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FF6162" />
                        <stop offset="1" stop-color="#F43435" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_1_1486"
                        x1="58.2347"
                        y1="33.8618"
                        x2="58.2347"
                        y2="47.038"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FF6162" />
                        <stop offset="1" stop-color="#F43435" />
                      </linearGradient>
                      <linearGradient
                        id="paint2_linear_1_1486"
                        x1="49.8781"
                        y1="5"
                        x2="113.038"
                        y2="44.1144"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FF6263" />
                        <stop offset="1" stop-color="#F43435" />
                      </linearGradient>
                      <linearGradient
                        id="paint3_linear_1_1486"
                        x1="32.6991"
                        y1="8.13721"
                        x2="59.7948"
                        y2="18.3698"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#F43435" />
                        <stop offset="0.458015" stop-color="#FF6364" />
                        <stop offset="0.651879" stop-color="#FE5E5E" />
                        <stop offset="1" stop-color="#FE5C5D" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <p>Free shipping</p>
                  <p>
                    Enjoy easy ordering with the premium quality of our
                    sneakers.
                  </p>
                </div>
                {/* 2 : 15 days returns */}
                <div className="days_returns ">
                  <svg
                    width="144"
                    height="125"
                    viewBox="0 0 144 125"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_d_1_1496)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M31.3764 53.283C30.8325 53.6785 30.7283 54.4189 31.1437 54.9368L42.8549 69.5365C43.2703 70.0544 44.0479 70.1536 44.5918 69.758L56.7792 60.8951C57.3231 60.4996 57.4272 59.7591 57.0118 59.2412L45.3007 44.6415C44.8853 44.1237 44.1076 44.0245 43.5637 44.42L31.3764 53.283ZM49.9086 62.0292C51.1062 62.0292 52.0771 61.1047 52.0771 59.9644C52.0771 58.824 51.1062 57.8996 49.9086 57.8996C48.7109 57.8996 47.74 58.824 47.74 59.9644C47.74 61.1047 48.7109 62.0292 49.9086 62.0292Z"
                        fill="url(#paint0_linear_1_1496)"
                      />
                      <path
                        d="M83.0561 6.27917C78.4092 8.34396 75.6211 6.57414 75.6211 6.57414L78.6456 13.4856C78.8597 13.4036 79.0936 13.3585 79.3386 13.3585H85.5344C85.6786 13.3585 85.8189 13.3741 85.9536 13.4037L88.9422 6.57414C88.9422 6.57414 86.1948 4.88454 83.0561 6.27917Z"
                        fill="url(#paint1_linear_1_1496)"
                      />
                      <path
                        d="M81.1527 28.1915C80.8417 27.9068 80.6862 27.5107 80.6862 27.0032C80.6862 26.4585 80.8482 26.0253 81.1721 25.7034C81.509 25.3816 81.9559 25.1897 82.5131 25.1278V28.8785C81.93 28.7052 81.4766 28.4762 81.1527 28.1915Z"
                        fill="url(#paint2_linear_1_1496)"
                      />
                      <path
                        d="M85.1173 34.1517C84.7933 34.4983 84.3464 34.7149 83.7763 34.8016V31.0324C84.3593 31.2057 84.8063 31.4347 85.1173 31.7194C85.4412 31.9917 85.6031 32.3754 85.6031 32.8705C85.6031 33.3657 85.4412 33.7927 85.1173 34.1517Z"
                        fill="url(#paint3_linear_1_1496)"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M66.9653 36.5299C67.6222 27.5818 75.9964 18.7079 78.1939 16.5228C78.5094 16.7579 78.9068 16.8981 79.3386 16.8981H85.5344C85.8857 16.8981 86.2141 16.8054 86.4943 16.6442C88.769 18.9149 96.3044 26.9865 97.6164 35.4813C98.1398 38.87 97.7424 41.5403 96.7006 43.5902C96.0478 43.8353 95.4382 44.0724 94.8643 44.3008C94.9526 44.1857 95.0347 44.069 95.1106 43.951C95.8754 42.7617 96.0741 41.2326 94.9569 40.018C93.951 38.9244 92.1569 38.431 89.8716 38.431C88.9957 38.431 87.9661 38.5545 86.9036 38.7069C86.4388 38.7736 85.9776 38.8442 85.5084 38.9161C84.852 39.0166 84.1802 39.1194 83.4618 39.2172C81.0387 39.5468 78.5855 39.7391 76.4837 39.3388C75.4115 39.1347 74.2225 38.7714 72.8877 38.3339C72.5907 38.2366 72.2862 38.1355 71.9755 38.0323C70.9157 37.6804 69.7833 37.3044 68.6224 36.9699C68.0823 36.8142 67.5294 36.6655 66.9653 36.5299ZM87.3522 34.5045C87.6761 33.9599 87.8381 33.3781 87.8381 32.7591C87.8381 31.9422 87.6502 31.3047 87.2745 30.8467C86.8987 30.3763 86.4388 30.0359 85.8946 29.8255C85.3505 29.6026 84.6444 29.3922 83.7763 29.1942V25.1836C84.2298 25.295 84.5925 25.5054 84.8646 25.8149C85.1367 26.1119 85.2922 26.4523 85.331 26.8361H87.702C87.6113 25.8087 87.2162 25.0041 86.5165 24.4223C85.8298 23.8281 84.9164 23.4815 83.7763 23.3825V21.8785H82.5131V23.3825C81.2952 23.4939 80.3105 23.89 79.559 24.5708C78.8076 25.2393 78.4319 26.0872 78.4319 27.1146C78.4319 27.9316 78.6197 28.5752 78.9955 29.0456C79.3841 29.516 79.8506 29.8626 80.3947 30.0854C80.9389 30.2958 81.645 30.5063 82.5131 30.7167V34.8016C81.9819 34.7149 81.5737 34.5169 81.2887 34.2074C81.0037 33.8856 80.8417 33.4833 80.8028 33.0005H78.4319C78.4319 34.0156 78.8076 34.8325 79.559 35.4515C80.3105 36.0704 81.2952 36.4355 82.5131 36.5469V38.0509H83.7763V36.5469C84.6184 36.4727 85.344 36.2499 85.9529 35.8785C86.5748 35.5072 87.0413 35.0492 87.3522 34.5045Z"
                        fill="url(#paint4_linear_1_1496)"
                      />
                      <path
                        d="M56.7236 57.604L46.8102 45.2152C49.9081 41.9705 52.3865 38.4309 58.8921 37.251C65.3978 36.0711 71.5937 39.6107 76.2406 40.4957C80.8875 41.3806 86.7735 39.6107 89.8715 39.6107C98.5457 39.6107 93.8988 47.28 85.2246 46.3951C76.5504 45.5102 73.1426 47.28 76.8601 47.8699C80.5777 48.4599 84.605 49.3448 88.3225 48.1649C92.04 46.985 95.4478 44.9202 104.432 42.2655C111.619 40.1417 113.209 42.1672 113.106 43.4454C106.91 46.985 93.1553 54.7723 87.7029 57.604C80.8875 61.1436 82.1266 61.7336 73.1426 59.0788C65.9554 56.955 59.2019 57.2107 56.7236 57.604Z"
                        fill="url(#paint5_linear_1_1496)"
                      />
                      <path
                        d="M78.0992 15.1286C78.0992 14.6398 78.5153 14.2437 79.0286 14.2437H85.8441C86.3574 14.2437 86.7735 14.6398 86.7735 15.1286C86.7735 15.6173 86.3574 16.0135 85.8441 16.0135H79.0286C78.5153 16.0135 78.0992 15.6173 78.0992 15.1286Z"
                        fill="#F54748"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_d_1_1496"
                        x="0.889282"
                        y="0.727539"
                        width="142.221"
                        height="124.273"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy="25" />
                        <feGaussianBlur stdDeviation="15" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0.972549 0 0 0 0 0.262745 0 0 0 0 0.266667 0 0 0 0.1 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_1_1496"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_1_1496"
                          result="shape"
                        />
                      </filter>
                      <linearGradient
                        id="paint0_linear_1_1496"
                        x1="44.0778"
                        y1="44.1777"
                        x2="44.0778"
                        y2="70.0003"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#E32223" />
                        <stop offset="1" stop-color="#FD6C6D" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_1_1496"
                        x1="82.4058"
                        y1="5.72754"
                        x2="82.4058"
                        y2="44.3008"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FF7374" />
                        <stop offset="1" stop-color="#E22123" />
                      </linearGradient>
                      <linearGradient
                        id="paint2_linear_1_1496"
                        x1="82.4058"
                        y1="5.72754"
                        x2="82.4058"
                        y2="44.3008"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FF7374" />
                        <stop offset="1" stop-color="#E22123" />
                      </linearGradient>
                      <linearGradient
                        id="paint3_linear_1_1496"
                        x1="82.4058"
                        y1="5.72754"
                        x2="82.4058"
                        y2="44.3008"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FF7374" />
                        <stop offset="1" stop-color="#E22123" />
                      </linearGradient>
                      <linearGradient
                        id="paint4_linear_1_1496"
                        x1="82.4058"
                        y1="5.72754"
                        x2="82.4058"
                        y2="44.3008"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FF7374" />
                        <stop offset="1" stop-color="#E22123" />
                      </linearGradient>
                      <linearGradient
                        id="paint5_linear_1_1496"
                        x1="85.0809"
                        y1="38.9348"
                        x2="87.8161"
                        y2="56.8273"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#E22123" />
                        <stop offset="1" stop-color="#FF7374" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <p>15 days returns</p>
                  <p>
                    Order with ease and enjoy the freshness of our premium
                    sneakers.
                  </p>
                </div>
                <div className="days_returns_before"></div>
                {/* 3 : Free shipping */}
                <div className="Secure_checkout">
                  <svg
                    width="134"
                    height="129"
                    viewBox="0 0 134 129"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_d_1_1479)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M34.6843 19.8139H32.5652C31.3949 19.8139 30.4462 20.7614 30.4462 21.9301V37.2731C30.4462 38.4418 31.3949 39.3894 32.5652 39.3894H57.4642C58.6345 39.3894 59.5833 38.4418 59.5833 37.2731V21.9301C59.5833 20.7614 58.6345 19.8139 57.4642 19.8139H55.3452V15.3168C55.3452 9.61899 50.7201 5 45.0147 5C39.3094 5 34.6843 9.61899 34.6843 15.3168V19.8139ZM36.8034 19.8139H53.2261V15.3168C53.2261 10.7878 49.5497 7.11627 45.0147 7.11627C40.4797 7.11627 36.8034 10.7878 36.8034 15.3168V19.8139ZM46.0304 28.5058C46.5354 28.175 46.8689 27.6045 46.8689 26.9563C46.8689 25.9336 46.0388 25.1045 45.0147 25.1045C43.9907 25.1045 43.1605 25.9336 43.1605 26.9563C43.1605 27.6045 43.494 28.175 43.999 28.5058C43.9705 28.6015 43.9552 28.703 43.9552 28.808V30.9243C43.9552 31.5087 44.4295 31.9824 45.0147 31.9824C45.5999 31.9824 46.0743 31.5087 46.0743 30.9243V28.808C46.0743 28.703 46.0589 28.6015 46.0304 28.5058Z"
                        fill="url(#paint0_linear_1_1479)"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M50.5768 41.5057V60.023C50.5768 62.945 52.9486 65.3137 55.8744 65.3137H81.9251L93.9415 73.6777C94.644 74.1666 95.6069 73.6647 95.6069 72.8096V65.3137H98.2557C101.182 65.3137 103.553 62.945 103.553 60.023V36.215C103.553 33.293 101.182 30.9243 98.2557 30.9243H61.7019V37.2731C61.7019 39.6107 59.8044 41.5057 57.4637 41.5057H50.5768ZM63.2912 40.4475C63.2912 39.8631 63.7655 39.3894 64.3507 39.3894H89.7795C90.3646 39.3894 90.839 39.8631 90.839 40.4475C90.839 41.0319 90.3646 41.5057 89.7795 41.5057H64.3507C63.7655 41.5057 63.2912 41.0319 63.2912 40.4475ZM63.2912 47.8545C63.2912 47.27 63.7655 46.7963 64.3507 46.7963H89.7795C90.3646 46.7963 90.839 47.27 90.839 47.8545C90.839 48.4389 90.3646 48.9126 89.7795 48.9126H64.3507C63.7655 48.9126 63.2912 48.4389 63.2912 47.8545ZM64.3507 54.2033C63.7655 54.2033 63.2912 54.677 63.2912 55.2614C63.2912 55.8457 63.7655 56.3195 64.3507 56.3195H89.7795C90.3646 56.3195 90.839 55.8457 90.839 55.2614C90.839 54.677 90.3646 54.2033 89.7795 54.2033H64.3507Z"
                        fill="url(#paint1_linear_1_1479)"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_d_1_1479"
                        x="0.446167"
                        y="0"
                        width="133.107"
                        height="128.87"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy="25" />
                        <feGaussianBlur stdDeviation="15" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0.972549 0 0 0 0 0.262745 0 0 0 0 0.266667 0 0 0 0.1 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_1_1479"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_1_1479"
                          result="shape"
                        />
                      </filter>
                      <linearGradient
                        id="paint0_linear_1_1479"
                        x1="45.0147"
                        y1="5"
                        x2="45.0147"
                        y2="39.3894"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FF7374" />
                        <stop offset="1" stop-color="#E22123" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_1_1479"
                        x1="77.0651"
                        y1="30.9243"
                        x2="77.0651"
                        y2="73.8696"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FF7374" />
                        <stop offset="1" stop-color="#E22123" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <p>Secure checkout</p>
                  <p>If you get rotten items - return immediately to us.</p>
                </div>
              </div>
            </div>
          </div>
          {/* ==========================IMAGE PRODUCTS DISPLAY================================ */}
          <div className="display__products ">
            {/* ----1---- */}
            <div className="sub__display__products">
              <div className="sub__display__products__img">
                <img
                  src="../../public/images/display__products__3.png"
                  alt="Giày Hoka Clifton 9 Running 'Orange' 1127895-SSEG"
                />
              </div>
              <Link
                to={`/detail/6752a1a0a47257a38e5cbff1`}
                className="nav-link"
              >
                <p>Giày Hoka Clifton 9 Running 'Orange'</p>
              </Link>
            </div>
            {/* ----2---- */}
            <div className="sub__display__products">
              <div className="sub__display__products__img">
                <img
                  src="../../public/images/display__products__1.png"
                  alt="Nike Air Max 270 React"
                />
              </div>
              <Link
                to={`/detail/6752a272a47257a38e5cc19d`}
                className="nav-link"
              >
                {" "}
                <p>Nike Air Max 270 React</p>
              </Link>
            </div>
            {/* ----3---- */}
            <div className="sub__display__products ">
              <div className="sub__display__products__img">
                <img
                  src="../../public/images/display__products__5.png"
                  alt="VANS OLD SKOOL STRAWBERRY PINK TRUE WHITE"
                />
              </div>
              <Link
                to={`/detail/6752a32fa47257a38e5cc1b5`}
                className="nav-link"
              >
                {" "}
                <p>VANS OLD SKOOL STRAWBERRY PINK TRUE WHITE</p>
              </Link>
            </div>
            {/* ----4---- */}
            <div className="sub__display__products">
              <div className="sub__display__products__img">
                <img
                  src="../../public/images/display__products__4.png"
                  alt="Deichmann - Graceland Chunky tenisky"
                />
              </div>
              <Link
                to={`/detail/6752a453a47257a38e5cc2f9`}
                className="nav-link"
              >
                <p>Deichmann - Graceland Chunky tenisky</p>
              </Link>
            </div>
          </div>
          <div>
            <FlashSaleSection />
          </div>
          {/* ==========================NEW ARRIVAL================================ */}
          <div className="title__products__new_arrival">
            <p>NEW ARRIVAL</p>
          </div>
          <div>
            <div className="category-menu">
              <button
                className="category-button"
                onClick={() => showCategory("women")}
              >
                Women
              </button>
              <button
                className="category-button"
                onClick={() => showCategory("men")}
              >
                Men
              </button>
            </div>
            <div className="category-content">
              <div
                id="women"
                className={`category-section ${
                  activeCategory === "women" ? "active" : ""
                }`}
              >
                <div className="container">
                  <div className="scroll container">
                    <div className="product__slip">
                      {productCate2.slice(0, 8).map((item) => (
                        <ProductItem
                          key={item._id}
                          product={item}
                          toggleFavorite={toggleFavorite}
                          isFavorite={isFavorite(item)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* men */}
              <div
                id="men"
                className={`category-section ${
                  activeCategory === "men" ? "active" : ""
                }`}
              >
                <div className="container">
                  <div className="scroll">
                    <div className="product__slip">
                      {productCate.slice(0, 8).map((item) => (
                        <ProductItem
                          key={item._id}
                          product={item}
                          toggleFavorite={toggleFavorite}
                          isFavorite={isFavorite(item)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ==========================GALLERY=================================== */}
          <div className="title__products__GALLERY">
            <p>GALLERY</p>
          </div>
          <div className="container-fluid box__gallery">
            <div className="Container__product__gallery ">
              {state.products.slice(0, 15).map((item) => (
                <ProductItem
                  key={item._id}
                  product={item}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite(item)}
                  // isFavorites2={favorites2}
                />
              ))}
            </div>
            <Link to="/product_list" className="nav-link">
              <div className="see__more">Xem Tất Cả</div>
            </Link>
          </div>
          {/*========================================Content about==========================*/}
          <div className="about container-fluid" id="about">
            <h2 className="heading">
              <span>About</span> us
            </h2>
            <div className="row">
              <div className="video-container">
                <video
                  src="../../public/images/invideo-ai-1080 Zokong - Bước nhảy của sự năng động 2024-09-14.mp4"
                  loop
                  autoPlay
                  muted
                />
                <h3>----Zokong---</h3>
              </div>
              <div className="content p-4">
                <h3>why choose us?</h3>
                <p>
                  At Zokong, we pride ourselves on delivering an unparalleled
                  footwear experience. Our commitment to excellence is evident
                  in every pair of shoes we offer. Each design is a masterpiece,
                  meticulously crafted by our skilled artisans who ensure that
                  every stitch and detail is executed with precision and care.
                </p>
                <p>
                  We source only the finest materials from trusted suppliers,
                  guaranteeing durability, comfort, and style in every pair.
                  Whether you're stepping out for a special occasion or seeking
                  everyday comfort, our dedicated team is here to understand
                  your needs and provide custom designs that speak to your
                  style.
                </p>
                <Link to={"/about"}>
                  <a className="btn">Learn More</a>
                </Link>
              </div>
            </div>
          </div>
          {/* Cac hãng hợp tác */}
          <div className="container">
            <div className="title__products__company">
              Collaborating Shoe Brands
            </div>
            <div className="scroll_company">
              <div className="company">
                {/* category */}
                {/* 1 */}
                <div className="sub__company">
                  {/* conteent */}
                  <img
                    src="https://static.ftshp.digital/img/p/7/5/7/4/3/75743.jpg"
                    alt="nike air max 2017"
                    className="profile_image"
                  />
                  <video
                    src="../../public/images/video hãng/Quảng cáo- Nike Air Max 2017 - Nike.mp4"
                    autoPlay
                    muted
                    loop
                  ></video>
                  <div className="profile_detail">
                    <span>nike</span>
                    <span>air max 2017</span>
                  </div>
                  <div className=" profile_quote">
                    <p>
                      Nike Air Max 2017 features full-length cushioning and a
                      sleek, modern design for maximum comfort.
                    </p>
                  </div>
                </div>
                {/* 2 */}
                <div className="sub__company">
                  <img
                    src="https://bizweb.dktcdn.net/100/140/774/products/giay-vans-authentic-vr3-sf-folky-floral-oatmeal-peyote-vn0a4bx50cx-2.jpg?v=1708409962647"
                    alt="Vans Authentic Trang SF"
                    className="profile_image"
                  />
                  <video
                    src="../../public/images/video hãng/Vans Authentic Trang SF - UNDER STREETWEAR.mp4"
                    autoPlay
                    muted
                    loop
                  ></video>
                  <div className="profile_detail">
                    <span style={{ color: "red" }}>Vans</span>
                    <span style={{ marginLeft: "57px" }}>
                      Authentic Trang SF
                    </span>
                  </div>
                  <div className=" profile_quote">
                    <p>
                      Vans Authentic SF in white offers a classic, minimalist
                      style with a comfortable, durable design.
                    </p>
                  </div>
                </div>
                {/* 3 */}
                <div className="sub__company">
                  <img
                    src="https://images.unsplash.com/photo-1473010350295-2c82192ebd8e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNob2VzJTIwYWRpZGFzfGVufDB8fDB8fHww"
                    alt="Epic Adidas"
                    className="profile_image"
                  />
                  <video
                    src="../../public/images/video hãng/Epic Adidas shoe commercial concept - product video B-ROLL.mp4"
                    autoPlay
                    muted
                    loop
                  ></video>
                  <div className="profile_detail">
                    <span style={{ color: "orange" }}>Epic</span>
                    <span style={{ marginLeft: "50px" }}>Adidas</span>
                  </div>
                  <div className=" profile_quote">
                    <p>
                      Epic Adidas embodies athletic excellence and innovation,
                      merging performance with iconic style for all.
                    </p>
                  </div>
                </div>
                {/* 3 */}
                <div className="sub__company">
                  <img
                    src="../../public/images/01_396403_2_11d7c6810ec34bc6811c5e47153b2716_large.webp"
                    alt="Epic Adidas"
                    className="profile_image"
                  />
                  <video
                    src="../../public/images/video hãng/iLoveYt.net_YouTube_Puma-Fenty-Creeper-Trang-Den-UNDER-STREE_Media_xi_loofIde4_002_360p.mp4"
                    autoPlay
                    muted
                    loop
                  ></video>
                  <div className="profile_detail">
                    <span style={{ color: "orange" }}>Puma</span>
                    <span style={{ marginLeft: "70px" }}>Fenty Creepe</span>
                  </div>
                  <div className="profile_quote">
                    <p>Giày sneakers unisex cổ thấp Fenty Creepe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* bài viết tiêu biểu  */}
          <div className="container">
            <div className="title__products__company">Featured Articles</div>
            {/* đổ bài viết */}
            <div className="related-posts mt-5">
  <div className="scroll d-flex overflow-auto">
    {relatedPosts.slice(0, 6).map((post) => (
      <div
        className="card shadow-sm border-0 rounded-3 me-3 card-img-container position-relative"
        key={post._id}
        style={{
          width: "300px",
          height: "300px",
          flex: "0 0 auto",
        }}
      >
        <Link to={`/baiviet/${post._id}`}>
          <img
            src={`${post.images}`}
            alt={post.title}
            className="card-img-top"
            style={{
              height: "180px",
              objectFit: "cover",
            }}
          />
        </Link>
        {/* Thêm ô ngày tháng ở đây */}
        <div
          className="date-box position-absolute d-flex flex-column align-items-center justify-content-center text-white"
          style={{
            top: "10px",
            left: "10px",
            width: "38px",
            height: "38px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: "5px",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          <span>{new Date(post.publishDate).getDate()}</span>
          <span>
            {new Date(post.publishDate).toLocaleString("en-US", { month: "short" })}
          </span>
        </div>
        <div className="card-body text-center">
          <Link
            className="text-decoration-none text-black font-weight-bold"
            to={`/baiviet/${post._id}`}
          >
            <h4 className="card-title">{post.title}</h4>
          </Link>
          <p className="card-text text-muted">
            Về Zokong |{" "}
            {new Date(post.publishDate).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>


          </div>
        </>
      )}
    </>
  );
};

export default Hompage;
