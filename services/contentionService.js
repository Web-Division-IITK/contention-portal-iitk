const { contention } = require("../model/Contention.js");

class contentionService {
  async getcontentionById(contentionId) {
    return await contention.findById(contentionId);
  }
  async getAllcontentions() {
    return await contention.find({}).sort({ createdAt: -1 });
  }

  async getcontentionsGroupedByPoolsForAdmin(club) {
    // Only contentions of this club
    const contentions = await contention.find({ club }).sort({ createdAt: -1 });
    const groupedcontentions = {};
    contentions.forEach((contention) => {
      if (!groupedcontentions[contention.pool]) {
        groupedcontentions[contention.pool] = [];
      }
      groupedcontentions[contention.pool].push(contention);
    });
    return groupedcontentions;
  }

  async getcontentionsGroupedByPoolsForSuperAdmin() {
    // All contentions
    const contentions = await contention.find({}).sort({ createdAt: -1 });
    const groupedcontentions = {};
    contentions.forEach((contention) => {
      if (!groupedcontentions[contention.pool]) {
        groupedcontentions[contention.pool] = [];
      }
      groupedcontentions[contention.pool].push(contention);
    });
    return groupedcontentions;
  }

  async getcontentionsForUserPool(userPool) {
    // Get contentions submitted by user's pool
    const contentionsByPool = await contention.find({ pool: userPool }).sort({
      createdAt: -1,
    });

    return contentionsByPool;
  }

  async createcontention(contentionData) {
    const newContention = new contention(contentionData);

    await newContention.save();
    return newContention;
  }

  async updatecontentionStatus(contentionId, status) {
    const updatedcontention = await contention.findByIdAndUpdate(
      contentionId,
      { status },
      { new: true }
    );

    if (!updatedcontention) {
      throw new Error("contention not found");
    }

    return updatedcontention;
  }
}

module.exports = new contentionService();
