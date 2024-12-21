import express from "express";
import {
    CreateVoucher,
    DeleteVoucher,
    GetVoucher,
    GetVoucherDetail,
    updateVoucherStatus,
    verify,
} from "../controller/Voucher.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
import voucherSchema from "../validSchema/voucherSchema.js";
const RouterVoucher = express.Router();
RouterVoucher.get("/", GetVoucher);
RouterVoucher.get("/:id", GetVoucherDetail);
RouterVoucher.post("/", validBodyRequest(voucherSchema), CreateVoucher);
RouterVoucher.post("/verify", validBodyRequest(voucherSchema), verify);
RouterVoucher.put("/:id", updateVoucherStatus);
RouterVoucher.delete("/:id", DeleteVoucher);
export default RouterVoucher;