import React from "react";
import "../App.css";
import Swal from "sweetalert2";

const Contact = () => {
  const onSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "437962c4-59bb-4981-ba17-9af103810818");
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      //   console.log("Success", res);
      Swal.fire({
        title: "Success",
        text: "Message sent successfully",
        icon: "success",
      });
    }
  };
  return (
    <section className="contact-container">
      {/* Thông tin liên hệ */}
      <div className="contact-info">
        <h2 className="h2_Contact">LIÊN HỆ</h2>
        <div>
          <ul>
            <li>
              <p className="text-dark">Địa chỉ chúng tôi:</p>
              <p className="text-dark">
                <strong>Ngõ 177 Cầu Diễn, Phúc Diễn, Bắc Từ Liêm Hà Nội</strong>
              </p>
            </li>
            <li>
              <p className="text-dark">Email chúng tôi:</p>
              <p className="text-dark">
                <strong>nguyenvangiangshoeshop@gmail.com</strong>
              </p>
            </li>
            <li>
              <p className="text-dark">Điện thoại:</p>
              <p className="text-dark">
                <strong>0385137427</strong>
              </p>
            </li>
            <li className="text-dark">
              <p>Thời gian làm việc</p>
              <p>
                <strong>
                  Thứ 2 đến Thứ 6 từ 8h đến 18h; Thứ 7 và Chủ nhật từ 8h đến 17h
                </strong>
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Form liên hệ */}
      <div className="contact5">
        <form className="form" onSubmit={onSubmit}>
          <h2 className="h2Contact">GỬI THẮC MẮC CHO CHÚNG TÔI</h2>
          <div className="input-box">
            <input
              type="email"
              className="field"
              id="email"
              placeholder="Email của bạn"
              name="email"
              required
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              className="field"
              id="phone"
              placeholder="Số điện thoại của bạn"
              name="phone"
              required
            />
          </div>
          <div className="input-box">
            <textarea
              name="message"
              id="message"
              placeholder="Mời bạn nhập nội dung"
              className="field mess"
              required
            ></textarea>
          </div>
          <button type="submit">Gửi cho chúng tôi</button>
        </form>
      </div>
      {/* Bản đồ */}
      <div className="map-container">
        <div className="map_container2">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.881205835464!2d105.74867981515464!3d21.03813288599485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134552a2c295f81%3A0x4019b8ecf32511e5!2z177hu5Mg177hu5MgMTc3IELhur91IMSQaeG7hW4sIFBoxrDhu51jIMSQaeG7hW4sIELhuq9jIFTDonkgTMOobSwgSMOgIE5vw6ksIFZpZXRuYW0!5e0!3m2!1svi!2s!4v1697909471954!5m2!1svi!2s"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;
