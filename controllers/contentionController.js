const contentionService = require("../services/contentionService");

class contentionController {
  async getAllcontentions() {
    try {
      return await contentionService.getAllcontentions();
    } catch (error) {
      throw error;
    }
  }
  async getcontentionsGroupedByPoolsForSuperAdmin() {
    try {
        return await contentionService.getcontentionsGroupedByPoolsForSuperAdmin();
    } catch (error) {
      throw error;
    }
  }
  async getcontentionsGroupedByPools({ role, club }) {
    try {
      if (role === "admin") {
        return await contentionService.getcontentionsGroupedByPoolsForAdmin(club);
      } else {
        throw new Error("Not authorized");
      }
    } catch (error) {
      throw error;
    }
  }

  async getcontentionsForUserPool(userPool) {
    try {
      return await contentionService.getcontentionsForUserPool(userPool);
    } catch (error) {
      throw error;
    }
  }

  async createcontention(contentionData) {
    try {
      return await contentionService.createcontention(contentionData);
    } catch (error) {
      throw error;
    }
  }

  async updatecontentionStatus(req, contentionId, status) {
    const isSuperAdmin = req.user.club === "sntsecy";
    try {
      // Only allow admin to change status of contentions of their club or sntsecy
      const contention = await contentionService.getcontentionById(contentionId);
      if (!contention) throw new Error("contention not found");
      if (req.user.role === "admin"  && !isSuperAdmin && contention.club !== req.user.club) {
        throw new Error(
          "Admins can only change status of contentions of their club"
        );
      }
      // superadmin can change any
      return await contentionService.updatecontentionStatus(contentionId, status);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new contentionController();
