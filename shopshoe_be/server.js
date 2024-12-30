import express from "express";
import cors from "cors";
import router from "./src/router/index.js";
import { connectDB } from "./src/utils/connectDB.js";
import Cart from "./src/model/Cart.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "src")));

// cross origin resource sharing
app.use(cors());
app.use(express.json());

// Kết nối cơ sở dữ liệu
connectDB();

app.use("/api", router);

const errorNotFound = (req, res, next) => {
  const error = new Error(`Not found`);
  error.status = 404;
  next(error);
};

const errorCommon = (err, req, res, next) => {
  return res.status(err.status || 500).json({
    message: err.message || "Lỗi server",
  });
};

// Middleware xử lý lỗi
app.use(errorNotFound, errorCommon);

// Lắng nghe server
app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
