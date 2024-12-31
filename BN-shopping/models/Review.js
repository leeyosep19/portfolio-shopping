const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = Schema(
{
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
}
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
