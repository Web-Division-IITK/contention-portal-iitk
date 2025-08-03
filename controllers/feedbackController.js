const feedbackService = require("../services/feedbackService");

class FeedbackController {
  async getAllFeedbacks() {
    try {
      return await feedbackService.getAllFeedbacks();
    } catch (error) {
      throw error;
    }
  }

  async getFeedbacksGroupedByPools() {
    try {
      return await feedbackService.getFeedbacksGroupedByPools();
    } catch (error) {
      throw error;
    }
  }

  async getFeedbacksForUserPool(userPool) {
    try {
      return await feedbackService.getFeedbacksForUserPool(userPool);
    } catch (error) {
      throw error;
    }
  }

  async createFeedback(feedbackData) {
    try {
      return await feedbackService.createFeedback(feedbackData);
    } catch (error) {
      throw error;
    }
  }

  async updateFeedbackStatus(feedbackId, status) {
    try {
      return await feedbackService.updateFeedbackStatus(feedbackId, status);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FeedbackController();
