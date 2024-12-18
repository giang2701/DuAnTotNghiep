import { Box, Typography } from "@mui/material";
import React from "react";

type Props = {};

const About = (props: Props) => {
    return (
      <Box sx={{ pt: 20, px: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Article title */}
        <Typography variant="h3" align="center" sx={{ mb: 4, fontWeight: "bold", fontSize: "3rem" }}>
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
              width: "100%",
              height: "auto",
              borderRadius: "8px",
            }}
          />
        </Box>

        {/* Introduction about sneakers */}
        <Typography variant="body1" sx={{ maxWidth: "800px", textAlign: "left", lineHeight: 1.8, mb: 4, fontSize: "1.4rem" }}>
          Sneakers are not just fashion items but also a personal style statement, especially among young people.
          In 2024, many trendy, authentic sneaker models are making waves due to their unique design, superior quality,
          and high practicality. If you are looking for the perfect pair of sneakers to showcase your fashion taste,
          let's explore the top sneaker models of this year.
        </Typography>

        {/* Puma Caven */}
        <Box sx={{ maxWidth: "800px", width: "100%" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, fontSize: "2rem" }}>
            1. Puma Caven: Classic Fashion Sneaker
          </Typography>

          <Typography variant="body1" sx={{ textAlign: "left", lineHeight: 1.8, mb: 2, fontSize: "1.4rem" }}>
            Puma Caven is one of the most popular sneakers in 2024. Inspired by retro style, Puma Caven blends the classic
            and modern looks harmoniously. The upper is made of premium synthetic leather, making it durable and giving it a
            luxurious appearance.
          </Typography>

          <Typography variant="body1" sx={{ textAlign: "left", lineHeight: 1.8, mb: 4, fontSize: "1.4rem" }}>
            The special feature of these sneakers is their versatility in styling. You can wear Puma Caven with jeans for a sporty
            look or pair it with a skirt for a more feminine touch. The thick rubber outsole ensures grip and safety while moving.
          </Typography>

          <Box sx={{ mb: 4, width: "100%" }}>
            <img
              src="https://myshoes.vn/image/catalog/2024/blog/huyen/18724/giay-puma-caven-nam-trang-xam-de.jpg"
              alt="Puma Caven"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Box>

        {/* Nike Air Force 1 */}
        <Box sx={{ maxWidth: "800px", width: "100%" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, fontSize: "2rem" }}>
            2. Nike Air Force 1: Timeless Streetwear
          </Typography>

          <Typography variant="body1" sx={{ textAlign: "left", lineHeight: 1.8, mb: 2, fontSize: "1.4rem" }}>
            The Nike Air Force 1 continues to be a staple in the sneaker world in 2024. Known for its sleek design and
            unparalleled comfort, this sneaker is a favorite among both sneakerheads and casual wearers.
          </Typography>

          <Typography variant="body1" sx={{ textAlign: "left", lineHeight: 1.8, mb: 4, fontSize: "1.4rem" }}>
            With its premium leather upper, perforated toe box for breathability, and durable rubber sole, the Air Force 1
            is both stylish and functional. Perfect for any occasion, from streetwear outfits to semi-casual events.
          </Typography>

          <Box sx={{ mb: 4, width: "100%" }}>
            <img
              src="https://myshoes.vn/image/catalog/2024/blog/huyen/18724/giay-puma-caven-nam-trang-xam-de.jpg"
              alt="Nike Air Force 1"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Box>

        {/* Adidas Ultraboost 23 */}
        <Box sx={{ maxWidth: "800px", width: "100%" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, fontSize: "2rem" }}>
            3. Adidas Ultraboost 23: Ultimate Comfort and Performance
          </Typography>

          <Typography variant="body1" sx={{ textAlign: "left", lineHeight: 1.8, mb: 2, fontSize: "1.4rem" }}>
            The Adidas Ultraboost 23 is designed for both athletes and casual users. With its innovative Boost midsole,
            this sneaker offers superior cushioning and energy return, making it ideal for running or daily wear.
          </Typography>

          <Typography variant="body1" sx={{ textAlign: "left", lineHeight: 1.8, mb: 4, fontSize: "1.4rem" }}>
            The Primeknit upper adapts to the shape of your foot, providing a snug fit, while the Continental rubber outsole
            ensures excellent traction on various surfaces.
          </Typography>

          <Box sx={{ mb: 4, width: "100%" }}>
            <img
              src="https://myshoes.vn/image/catalog/2024/blog/huyen/18724/giay-puma-caven-nam-trang-xam-de.jpg"
              alt="Adidas Ultraboost 23"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Box>

        {/* Conclusion */}
        <Box sx={{ maxWidth: "800px", width: "100%", mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, fontSize: "1.8rem" }}>
            Find your perfect sneakers at Zokong today!
          </Typography>
        </Box>
      </Box>
    );
  };

export default About;
