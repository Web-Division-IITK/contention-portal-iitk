const feedbackService = require("../services/feedbackService");

class FeedbackController {
  async getAllFeedbacks() {
    try {
      return await feedbackService.getAllFeedbacks();
    } catch (error) {
      throw error;
    }
  }

  async getFeedbacksGroupedByPools(req) {
    try {
      if (req.user.role === "superadmin") {
        return await feedbackService.getFeedbacksGroupedByPoolsForSuperAdmin();
      } else if (req.user.role === "admin") {
        return await feedbackService.getFeedbacksGroupedByPoolsForAdmin(req.user.club);
      } else {
        throw new Error("Not authorized");
      }
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

  async updateFeedbackStatus(req, feedbackId, status) {
    try {
      // Only allow admin to change status of feedbacks of their club
      const feedback = await feedbackService.getFeedbackById(feedbackId);
      if (!feedback) throw new Error("Feedback not found");
      if (req.user.role === "admin" && feedback.club !== req.user.club) {
        throw new Error("Admins can only change status of feedbacks of their club");
      }
      // superadmin can change any
      return await feedbackService.updateFeedbackStatus(feedbackId, status);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FeedbackController();
