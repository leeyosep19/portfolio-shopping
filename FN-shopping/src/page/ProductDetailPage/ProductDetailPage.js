import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Dropdown, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaRegStar } from "react-icons/fa";
import { ColorRing } from "react-loader-spinner";
import { currencyFormat } from "../../utils/number";
import { getProductDetail } from "../../features/product/productSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { addReview, fetchReviews } from "../../features/review/reviewSlice";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { selectedProduct, loading } = useSelector((state) => state.product);
  const reviews = useSelector((state) => state.review.reviews);
  const user = useSelector((state) => state.user.user);
  const [size, setSize] = useState("");
  const { id } = useParams();
  const [sizeError, setSizeError] = useState(false);
  const [rating, setRating] = useState(0); // 별점 상태
  const [reviewText, setReviewText] = useState(""); // 리뷰 텍스트 상태
  const [showReviewModal, setShowReviewModal] = useState(false); // 리뷰 모달 상태
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProductDetail(id)); // 제품 상세 정보 가져오기
    dispatch(fetchReviews(id)); // 리뷰 가져오기
  }, [id, dispatch]);

  const handleReviewSubmit = async () => {
    if (rating === 0 || reviewText.trim() === "") {
      alert("별점과 리뷰를 모두 입력해 주세요.");
      return;
    }

    const review = {
      productId: id,
      userId: user.id,
      rating: rating,
      text: reviewText,
    };

    try {
      await dispatch(addReview({ productId: id, review }));
      dispatch(fetchReviews(id));
    } catch (error) {
      console.error("리뷰 제출 오류:", error);
    }

    const reviewsLength = reviews ? reviews.length : 0;
    if (reviewsLength + 1 >= 5) {
      navigate("/next-page");
    }

    setShowReviewModal(false);
    setRating(0);
    setReviewText("");
  };

  const addItemToCart = () => {
    if (size === "") {
      setSizeError(true);
      return;
    }
    if (!user) {
      navigate("/login");
    }
    dispatch(addToCart({ id, size }));
  };

  const selectSize = (value) => {
    if (sizeError) setSizeError(false);
    setSize(value);
  };

  const handleModalClose = () => {
    setShowReviewModal(false);
    setRating(0);
    setReviewText("");
  };

  if (loading || !selectedProduct)
    return (
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
    );

  return (
    <Container className="product-detail-card">
      <Row>
        <Col sm={6}>
          <img src={selectedProduct.image} className="w-100" alt="image" />
        </Col>
        <Col className="product-info-area" sm={6}>
          <div className="product-info">{selectedProduct.name}</div>
          <div className="product-info">₩ {currencyFormat(selectedProduct.price)}</div>
          <div className="product-info">{selectedProduct.description}</div>

          <Dropdown
            className="drop-down size-drop-down"
            title={size}
            align="start"
            onSelect={(value) => selectSize(value)}
          >
            <Dropdown.Toggle
              className="size-drop-down"
              variant={sizeError ? "outline-danger" : "outline-dark"}
              id="dropdown-basic"
              align="start"
            >
              {size === "" ? "사이즈 선택" : size.toUpperCase()}
            </Dropdown.Toggle>

            <Dropdown.Menu className="size-drop-down">
              {Object.keys(selectedProduct.stock).map((item, index) =>
                selectedProduct.stock[item] > 0 ? (
                  <Dropdown.Item eventKey={item} key={index}>
                    {item.toUpperCase()}
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item eventKey={item} disabled key={index}>
                    {item.toUpperCase()}
                  </Dropdown.Item>
                )
              )}
            </Dropdown.Menu>
          </Dropdown>
          <div className="warning-message">{sizeError && "사이즈를 선택해주세요."}</div>
          <Button variant="dark" className="add-button" onClick={addItemToCart}>
            추가
          </Button>

          <Button variant="outline-dark" className="mt-3" onClick={() => setShowReviewModal(true)}>
            리뷰 작성
          </Button>

          <Modal show={showReviewModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>리뷰 작성</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>별점</Form.Label>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        onClick={() => setRating(i + 1)}
                        style={{ cursor: "pointer", fontSize: "1.5rem" }}
                      >
                        {i < rating ? <FaStar /> : <FaRegStar />}
                      </span>
                    ))}
                  </div>
                </Form.Group>
                <Form.Group>
                  <Form.Label>리뷰</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="리뷰를 작성해주세요."
                  />
                </Form.Group>
                <Button variant="primary" onClick={handleReviewSubmit}>
                  리뷰 제출
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          <div>
          <h4>리뷰</h4>
{Array.isArray(reviews) && reviews.length > 0 ? (
  reviews.map((review, index) => {
    const rating = typeof review.rating === "number" ? review.rating : 0;
    const validRating = Math.min(Math.max(rating, 0), 5);
    return (
      <div key={index}>
        <div>
          {[...Array(validRating)].map((_, i) => (
            <FaStar key={`filled-${index}-${i}`} />
          ))}
          {[...Array(5 - validRating)].map((_, i) => (
            <FaRegStar key={`empty-${index}-${i}`} />
          ))}
        </div>
        <p>{review.text}</p>
      </div>
    );
  })
) : (
  <p>아직 리뷰가 없습니다.</p>
)}

          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
