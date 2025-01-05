import express from "express";
import {
    CreateVoucher,
    DeleteVoucher,
    GetVoucher,
    GetVoucherDetail,
    updateVoucher,
    updateVoucherStatus,
    verify,
} from "../controller/Voucher.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
import voucherSchema from "../validSchema/voucherSchema.js";
import checkPermission from "../middlewares/checkPermission.js";
const RouterVoucher = express.Router();
RouterVoucher.get("/", GetVoucher);
RouterVoucher.get("/:id", GetVoucherDetail);
RouterVoucher.post(
    "/",
    checkPermission("add-voucher"),
    validBodyRequest(voucherSchema),
    CreateVoucher
);
RouterVoucher.post("/verify", verify);
RouterVoucher.put("/:id", checkPermission("edit-voucher"), updateVoucherStatus);
RouterVoucher.delete("/:id", checkPermission("delete-voucher"), DeleteVoucher);
RouterVoucher.put("/edit/:id", checkPermission("edit-voucher"), updateVoucher);

export default RouterVoucher;
