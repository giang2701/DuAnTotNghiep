import Order from "../model/Older.js";
import Category from "../model/Category.js";
import Products from "../model/Products.js";
import Users from "../model/User.js";

import moment from "moment";

// thống kê top sản phẩm bán chạy nhất
export const productBestSellingStats = async (req, res, next) => {
  const { limit: _limit } = req.query;

  const limit = _limit ?? 10;

  try {
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: "Completed", status: "Completed" } },

      { $unwind: "$products" },

      {
        $group: {
          _id: "$products.product",
          totalQuantity: { $sum: "$products.quantity" },
        },
      },

      { $sort: { totalQuantity: -1 } },

      { $limit: limit },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      {
        $project: {
          _id: 1,
          totalQuantity: 1,
          name: { $arrayElemAt: ["$productDetails.title", 0] },
        },
      },

      {
        $match: {
          name: { $ne: null, $exists: true, $nin: ["", " "] },
        },
      },
    ]);

    res.json(topProducts);
  } catch (error) {
    next(error);
  }
};

// so sánh doanh thu tháng trước so với hiện tại
export const revenueStats = async (req, res, next) => {
  const now = moment();
  const startOfThisMonth = now.clone().startOf("month").toDate();
  const startOfLastMonth = now
    .clone()
    .subtract(1, "month")
    .startOf("month")
    .toDate();
  const endOfLastMonth = now
    .clone()
    .subtract(1, "month")
    .endOf("month")
    .toDate();

  try {
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: "Completed", status: "Completed" } },

      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lt: now.toDate() },
        },
      },

      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },

      { $sort: { _id: 1 } },
    ]);

    const daysInLastMonth = [];
    const daysInThisMonth = [];

    const daysInPreviousMonth = moment(startOfLastMonth).daysInMonth();
    for (let i = 1; i <= daysInPreviousMonth; i++) {
      const day = moment(startOfLastMonth).date(i).format("YYYY-MM-DD");
      daysInLastMonth.push({ _id: day, totalRevenue: 0 });
    }

    const daysInCurrentMonth = now.daysInMonth();
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const day = moment(startOfThisMonth).date(i).format("YYYY-MM-DD");
      daysInThisMonth.push({ _id: day, totalRevenue: 0 });
    }

    revenueData.forEach((item) => {
      const date = item._id;
      const revenue = item.totalRevenue;

      if (
        moment(date).isBetween(startOfLastMonth, endOfLastMonth, null, "[]")
      ) {
        const day = daysInLastMonth.find((d) => d._id === date);
        if (day) {
          day.totalRevenue = revenue;
        }
      }

      if (moment(date).isBetween(startOfThisMonth, now, null, "[]")) {
        const day = daysInThisMonth.find((d) => d._id === date);
        if (day) {
          day.totalRevenue = revenue;
        }
      }
    });

    res.json({
      lastMonth: daysInLastMonth,
      currentMonth: daysInThisMonth,
    });
  } catch (error) {
    next(error);
  }
};

// thống kê thông tin chung
export const generalStatistics = async (req, res, next) => {
  const now = moment();
  const startOfThisMonth = now.clone().startOf("month").toDate();
  const endOfThisMonth = now.clone().endOf("month").toDate();

  try {
    const [monthRevenue, categoryCount, productCount, userCount] =
      await Promise.all([
        Order.aggregate([
          { $match: { paymentStatus: "Completed", status: "Completed" } },

          {
            $match: {
              createdAt: { $gte: startOfThisMonth, $lte: endOfThisMonth },
            },
          },

          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalPrice" },
            },
          },
        ]),
        Category.find().countDocuments().exec(),
        Products.find().countDocuments().exec(),
        Users.find().countDocuments().exec(),
      ]);

    const currentMonthRevenue =
      monthRevenue.length > 0 ? monthRevenue[0].totalRevenue : 0;

    res.json({
      currentMonthRevenue,
      categoryCount,
      productCount,
      userCount,
    });
  } catch (error) {
    next(error);
  }
};

//doanh thu cả nam
export const monthlyRevenueStats = async (req, res, next) => {
  const { start, end } = req.query;

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const data = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Completed",
          status: "Completed",
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          month: { $concat: [{ $toString: "$_id" }, " tháng"] },
          totalRevenue: 1,
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    next(error);
  }
};