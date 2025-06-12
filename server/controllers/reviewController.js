const Review = require('../models/Review');

const ReviewController = {
  async addReview(req, res) {
    try {
      const { product, user, rating, comment } = req.body;
      const review = new Review({ product, user, rating, comment });
      await review.save();
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getProductReviews(req, res) {
    try {
      const { productId } = req.params;
      const reviews = await Review.find({ product: productId }).populate('user');
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUserReviews(req, res) {
    try {
      const { userId } = req.params;
      const reviews = await Review.find({ user: userId }).populate('product');
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ReviewController;
