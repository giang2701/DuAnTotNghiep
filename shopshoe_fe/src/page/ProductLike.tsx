import {
    Box,
    Typography,
    Grid,
    Paper,
    Container,
    IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import { AiFillHeart } from "react-icons/ai";
import { Product } from "../interface/Products";
import { useEffect, useState } from "react";
import instance from "../api";
import { Heart } from "../interface/Heart";
import { toast } from "react-toastify";


export default ProductsLiked;
