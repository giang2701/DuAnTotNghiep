import React, { useCallback, useContext, useEffect, useState } from "react";
import { ProductContext, ProductContextType } from "../context/ProductContext";
import { Link, useLocation } from "react-router-dom";
import {
    CategoryContext,
    CategoryContextType,
} from "../context/CategoryContext";
import axios from "axios";
import { Product } from "../interface/Products";
import instance from "../api";
import { toast } from "react-toastify";
import ProductItem from "./ProductItem";

