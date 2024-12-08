import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import imageaboutus from "../../public/images/imageaboutus.png";
import image1 from "../../public/images/image1.png";
import image2 from "../../public/images/image2.png";
import image3 from "../../public/images/image3.png";
import image4 from "../../public/images/image4.png";
import image5 from "../../public/images/image5.png";
import aboutusadidas from "../../public/images/aboutusadiads.png";
import aboutuspuma from "../../public/images/aboutuspuma.png";
import aboutusnike from "../../public/images/aboutusnike.png";
import aboutusbanner from "../../public/images/aboutusbanner.png";

type Props = {};

const Aboutus = (props: Props) => {
  const images = [
    aboutusbanner,
    aboutusnike,
    aboutusadidas,
    aboutuspuma,
    imageaboutus,
    image1,
    image2,
    image3,
    image4,
    image5,
  ];

  return (
    <div className="container">
      <div className="aboutus-container pt-5">
        {/* Breadcrumbs */}
        <div className="breadcrumbs-wrapper">
          <Breadcrumbs
            aria-label="breadcrumb"
            className="breadcrumbs-container"
          >
            <Link className="nav-link" color="inherit" to="/">
              Trang chủ
            </Link>
            <Typography color="text.primary">Về chúng tôi</Typography>
          </Breadcrumbs>
        </div>

        {/* Section: Giới thiệu */}
        <section className="aboutus-gallery pt-5">
          <h1 className="trending-title">Trending</h1>

          {images.map((src, index) => (
            <img key={index} src={src} className="aboutus-img" />
          ))}
        </section>

        <div className="aboutus-ending text-center pt-5">
          <Typography variant="h6" gutterBottom>
            Cảm ơn bạn đã đồng hành cùng chúng tôi! Zokong luôn sẵn sàng mang
            đến những đôi giày chất lượng nhất!!!
          </Typography>
        </div>

        {/* CTA */}
      </div>
    </div>
  );
};

export default Aboutus;
// contact
{
  /* Section: Đánh giá khách hàng */
}
{
  /* <section className="customer-reviews mt-5">
          <h3 className="text-secondary text-center">Đánh giá từ khách hàng</h3>
          <div className="row text-center mt-4">
          
            <div className="col-md-4">
              <div className="card p-3 shadow-sm">
                <img
                  src="https://t4.ftcdn.net/jpg/04/42/54/79/360_F_442547913_tWYOcGkO06Vbo30KOvrOPte5JqDHVWmR.jpg"
                  alt="Nguyễn Văn A"
                  className="rounded-circle mx-auto"
                  width="80"
                  height="80"
                />
                <h5 className="mt-3">Nguyễn Văn A</h5>
                <p className="text-muted">Hà Nội, Việt Nam</p>
                <p className="mt-2">
                  "Giày của Zokoong có thiết kế rất đẹp, phù hợp với phong cách
                  thời trang hiện đại. Tôi rất hài lòng với chất lượng sản phẩm
                  và dịch vụ khách hàng tuyệt vời."
                </p>
                <p className="text-warning">⭐️⭐️⭐️⭐️⭐️</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-3 shadow-sm">
                <img
                  src="https://t4.ftcdn.net/jpg/04/42/54/79/360_F_442547913_tWYOcGkO06Vbo30KOvrOPte5JqDHVWmR.jpg"
                  alt="Lê Thị B"
                  className="rounded-circle mx-auto"
                  width="80"
                  height="80"
                />
                <h5 className="mt-3">Lê Thị B</h5>
                <p className="text-muted">TP. Hồ Chí Minh, Việt Nam</p>
                <p className="mt-2">
                  "Mình rất thích đôi giày mới mua từ Zokoong. Đế giày siêu nhẹ,
                  đi cả ngày không bị đau chân. Sẽ ủng hộ thêm trong tương lai!"
                </p>
                <p className="text-warning">⭐️⭐️⭐️⭐️⭐️</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-3 shadow-sm">
                <img
                  src="https://t4.ftcdn.net/jpg/04/42/54/79/360_F_442547913_tWYOcGkO06Vbo30KOvrOPte5JqDHVWmR.jpg"
                  alt="Trần Văn C"
                  className="rounded-circle mx-auto"
                  width="80"
                  height="80"
                />
                <h5 className="mt-3">Trần Văn C</h5>
                <p className="text-muted">Đà Nẵng, Việt Nam</p>
                <p className="mt-2">
                  "Lần đầu tiên mua sản phẩm của Zokoong và mình rất ấn tượng.
                  Giày vừa vặn, chất liệu tốt, rất đáng đồng tiền!"
                </p>
                <p className="text-warning">⭐️⭐️⭐️⭐️</p>
              </div>
            </div>
          </div>
        </section> */
}

{
  /* Section: Liên hệ */
}
{
  /* <section className="contact-section mt-5">
          <div className="row">
            <div className="col-md-6">
              <h3 className="text-secondary">Liên hệ với chúng tôi</h3>
              <form action="#" method="POST" className="mt-4">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Nhập họ tên của bạn"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Nhập email của bạn"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Tin nhắn
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Nhập tin nhắn của bạn"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Gửi liên hệ
                </button>
              </form>
            </div>

            <div className="col-md-6">
              <h3 className="text-secondary">Địa chỉ của chúng tôi</h3>
              <div className="mt-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8639311800466!2d105.74469224033999!3d21.03812978069433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455e940879933%3A0xcf10b34e9f1a03df!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1sen!2s!4v1732076690193!5m2!1sen!2s"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </section> */
}
