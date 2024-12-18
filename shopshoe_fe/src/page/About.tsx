import { Box, Typography } from "@mui/material";
import React from "react";

type Props = {};

const About = (props: Props) => {
  return (
    <Box
      sx={{
        pt: 20,
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Article title */}
      <Typography
        variant="h3"
        align="center"
        sx={{ mb: 4, fontWeight: "bold", fontSize: "3rem" }}
      >
        A Collection of Trendy Sneaker Models for Young People in 2024
      </Typography>

      {/* Replace image with video */}
      <Box sx={{ mb: 4, width: "100%", maxWidth: "800px" }}>
        <video
          src="../../public/images/invideo-ai-1080 Zokong - Bước nhảy của sự năng động 2024-09-14.mp4"
          loop
          autoPlay
          muted
          style={{
            width: "100%", // Video will take up the full width of the container
            height: "auto", // Maintain the aspect ratio of the video
            borderRadius: "8px", // Round the corners of the video
          }}
        />
      </Box>

      {/* Introduction about sneakers */}
      <Typography
        variant="body1"
        sx={{
          maxWidth: "800px",
          textAlign: "left",
          lineHeight: 1.8,
          mb: 4,
          fontSize: "1.4rem",
        }}
      >
        Sneakers are not just fashion items but also a personal style statement,
        especially among young people. In 2024, many trendy, authentic sneaker
        models are making waves due to their unique design, superior quality,
        and high practicality. If you are looking for the perfect pair of
        sneakers to showcase your fashion taste, let's explore the top sneaker
        models of this year.
      </Typography>

      {/* First sneaker */}
      <Box sx={{ maxWidth: "800px", width: "100%" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 2, fontSize: "2rem" }}
        >
          1. Puma Caven: Classic Fashion Sneaker
        </Typography>

        <Typography
          variant="body1"
          sx={{ textAlign: "left", lineHeight: 1.8, mb: 2, fontSize: "1.4rem" }}
        >
          Puma Caven is one of the most popular sneakers in 2024. Inspired by
          retro style, Puma Caven blends the classic and modern looks
          harmoniously. The upper is made of premium synthetic leather, making
          it durable and giving it a luxurious appearance.
        </Typography>

        <Typography
          variant="body1"
          sx={{ textAlign: "left", lineHeight: 1.8, mb: 4, fontSize: "1.4rem" }}
        >
          The special feature of these sneakers is their versatility in styling.
          You can wear Puma Caven with jeans for a sporty look or pair it with a
          skirt for a more feminine touch. The thick rubber outsole ensures grip
          and safety while moving.
        </Typography>

        {/* Product image */}
        <Box sx={{ mb: 4, width: "100%" }}>
          <img
            src="https://myshoes.vn/image/catalog/2024/blog/huyen/18724/giay-puma-caven-nam-trang-xam-de.jpg" // Placeholder image for Puma Caven
            alt="Puma Caven"
            style={{
              width: "100%", // Image takes up the full width of the container
              height: "auto", // Maintain the aspect ratio of the image
              borderRadius: "8px", // Round the corners of the image
            }}
          />
        </Box>

        <Typography
          variant="body1"
          sx={{ textAlign: "left", lineHeight: 1.8, mb: 4, fontSize: "1.4rem" }}
        >
          Whether you're a student, office worker, or street fashion lover, Puma
          Caven is always a worthy choice.
        </Typography>
      </Box>

      {/* Conclusion section */}
      <Box sx={{ maxWidth: "800px", width: "100%", mt: 4 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 2, fontSize: "1.8rem" }}
        >
          If you are wondering where to buy authentic trendy sneakers to ensure
          quality and reliability, visit Myshoes.vn.
        </Typography>

        <Typography
          variant="body1"
          sx={{ textAlign: "left", lineHeight: 1.8, mb: 4, fontSize: "1.4rem" }}
        >
          Why should you choose Myshoes.vn for your authentic sneaker purchases?
        </Typography>

        <ul>
          <li>
            <Typography variant="body1" sx={{ fontSize: "1.4rem" }}>
              100% Authentic products: Myshoes.vn guarantees authentic sneakers
              from famous brands like Puma, Adidas, Nike.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" sx={{ fontSize: "1.4rem" }}>
              Wide variety: Here, you can find sneakers for sports, fashion, and
              office wear, suitable for all needs and preferences.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" sx={{ fontSize: "1.4rem" }}>
              Reasonable prices: Myshoes.vn always ensures competitive prices
              along with exciting promotions.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" sx={{ fontSize: "1.4rem" }}>
              Professional service: The staff are dedicated to helping you find
              the perfect pair of sneakers.
            </Typography>
          </li>
        </ul>

        <Typography
          variant="body1"
          sx={{ textAlign: "left", lineHeight: 1.8, mb: 4, fontSize: "1.4rem" }}
        >
          Visit Myshoes.vn to find the perfect sneakers and enjoy a
          professional, reliable shopping experience. With Myshoes.vn, owning an
          authentic trendy sneaker has never been easier!
        </Typography>

        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", mb: 2, fontSize: "1.6rem" }}
        >
          Buy authentic sneakers at Myshoes!
        </Typography>
      </Box>
    </Box>
  );
};

export default About;
