const feedbackService = require("../services/feedbackService");

class FeedbackController {
  async getAllFeedbacks() {
    try {
      return await feedbackService.getAllFeedbacks();
    } catch (error) {
      throw error;
    }
  }
  async getFeedbacksGroupedByPoolsForSuperAdmin() {
    try {
        return await feedbackService.getFeedbacksGroupedByPoolsForSuperAdmin();
    } catch (error) {
      throw error;
    }
  }
  async getFeedbacksGroupedByPools({ role, club }) {
    try {
      if (role === "admin") {
        return await feedbackService.getFeedbacksGroupedByPoolsForAdmin(club);
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
    const isSuperAdmin = req.user.club === "sntsecy";
    try {
      // Only allow admin to change status of feedbacks of their club or sntsecy
      const feedback = await feedbackService.getFeedbackById(feedbackId);
      if (!feedback) throw new Error("Feedback not found");
      if (req.user.role === "admin"  && !isSuperAdmin && feedback.club !== req.user.club) {
        throw new Error(
          "Admins can only change status of feedbacks of their club"
        );
      }
      // superadmin can change any
      return await feedbackService.updateFeedbackStatus(feedbackId, status);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FeedbackController();
