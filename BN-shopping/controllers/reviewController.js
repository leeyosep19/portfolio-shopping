const Review = require("../models/Review");

// 리뷰 컨트롤러 객체 선언
const reviewController = {};

// 리뷰 추가
reviewController.addReview = async (req, res) => {
    try {
      const { productId, userId, rating, text } = req.body;
      const newReview = new Review({ productId, userId, rating, text });
      await newReview.save();
      res.status(201).json(newReview);
      console.log("리뷰 저장 요청 데이터: ", req.body);
      
    } catch (error) {
      console.error("리뷰 저장 오류:", error);
      res.status(500).json({ message: "리뷰 저장 실패", error: error.message });
    }
  };
  

// 특정 상품의 리뷰 조회
reviewController.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("리뷰 조회 에러:", error);
    res.status(500).json({ message: "리뷰 조회 실패", error: error.message });
  }
};

// 리뷰 삭제
reviewController.deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({ message: "삭제할 리뷰를 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "리뷰 삭제 성공" });
  } catch (error) {
    console.error("리뷰 삭제 에러:", error);
    res.status(500).json({ message: "리뷰 삭제 실패", error: error.message });
  }
};

module.exports = reviewController;
