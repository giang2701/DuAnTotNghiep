import express from "express";
import {
    CreateVoucher,
    DeleteVoucher,
    GetVoucher,
    GetVoucherDetail,
    updateVoucherStatus,
    verify,
} from "../controller/Voucher.js";
const RouterVoucher = express.Router();
RouterVoucher.get("/", GetVoucher);
RouterVoucher.get("/:id", GetVoucherDetail);
RouterVoucher.post("/", CreateVoucher);
RouterVoucher.post("/verify", verify);
RouterVoucher.put("/:id", updateVoucherStatus);
RouterVoucher.delete("/:id", DeleteVoucher);
export default RouterVoucher;
