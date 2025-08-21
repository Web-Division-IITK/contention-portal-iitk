const { Feedback } = require("../model/Feedback.js");

class FeedbackService {
  async getFeedbackById(feedbackId) {
    return await Feedback.findById(feedbackId);
  }
  async getAllFeedbacks() {
    return await Feedback.find({}).sort({ createdAt: -1 });
  }

  async getFeedbacksGroupedByPoolsForAdmin(club) {
    // Only feedbacks of this club
    const feedbacks = await Feedback.find({ club }).sort({ createdAt: -1 });
    const groupedFeedbacks = {};
    feedbacks.forEach((feedback) => {
      if (!groupedFeedbacks[feedback.pool]) {
        groupedFeedbacks[feedback.pool] = [];
      }
      groupedFeedbacks[feedback.pool].push(feedback);
    });
    return groupedFeedbacks;
  }

  async getFeedbacksGroupedByPoolsForSuperAdmin() {
    // All feedbacks
    const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
    const groupedFeedbacks = {};
    feedbacks.forEach((feedback) => {
      if (!groupedFeedbacks[feedback.pool]) {
        groupedFeedbacks[feedback.pool] = [];
      }
      groupedFeedbacks[feedback.pool].push(feedback);
    });
    return groupedFeedbacks;
  }

  async getFeedbacksForUserPool(userPool) {
    // Get feedbacks submitted by user's pool
    const feedbacksByPool = await Feedback.find({ pool: userPool }).sort({
      createdAt: -1,
    });

    // Get feedbacks submitted against user's pool
    const feedbacksAgainstPool = await Feedback.find({
      againstPool: userPool,
    }).sort({ createdAt: -1 });

    return {
      byPool: feedbacksByPool,
      againstPool: feedbacksAgainstPool,
    };
  }

  async createFeedback(feedbackData) {
    const { headline, description, drive, status, pool, againstPool } =
      feedbackData;

    const feedback = new Feedback({
      headline,
      description,
      drive,
      status,
      pool,
      againstPool,
    });

    await feedback.save();
    return feedback;
  }

  async updateFeedbackStatus(feedbackId, status) {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { status },
      { new: true }
    );

    if (!updatedFeedback) {
      throw new Error("Feedback not found");
    }

    return updatedFeedback;
  }
}

module.exports = new FeedbackService();
