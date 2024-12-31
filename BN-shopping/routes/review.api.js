const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// 리뷰 추가~
router.post("/:productId", reviewController.addReview);

// 특정 상품의 리뷰 조회~
router.get("/:productId", reviewController.getReviewsByProduct);

// 리뷰 삭제 ~
router.delete("/:id", reviewController.deleteReview);

module.exports = router;

