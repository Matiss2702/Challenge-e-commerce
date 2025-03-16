const UserMongo = require("../models/mongo/UserMongo");
const OrderMongo = require("../models/mongo/OrderMongo");
const ProductMongo = require("../models/mongo/ProductMongo");

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await UserMongo.countDocuments();

    const usersByBirthYear = await UserMongo.aggregate([
      {
        $group: {
          _id: { $year: "$birthdate" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topProducts = await OrderMongo.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product_id",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      {
        $lookup: {
          from: "productmongos",
          localField: "_id",
          foreignField: "postgresId",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          totalQuantity: 1,
          "productInfo.name": 1,
        },
      },
    ]);

    const paidOrdersStats = await OrderMongo.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: null,
          totalPaidOrders: { $sum: 1 },
          totalPaidAmount: { $sum: "$total_amount" },
        },
      },
    ]);

    const totalPaidOrders = paidOrdersStats.length > 0 ? paidOrdersStats[0].totalPaidOrders : 0;
    const totalPaidAmount = paidOrdersStats.length > 0 ? paidOrdersStats[0].totalPaidAmount : 0;

    res.json({
      totalUsers,
      usersByBirthYear,
      topProducts,
      totalPaidOrders,
      totalPaidAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
