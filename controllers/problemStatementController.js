// ...removed misplaced duplicate getByClub outside the class...
const problemStatementService = require("../services/problemStatementService");
const { clubs } = require("../config/general");

class ProblemStatementController {
  async getAll(req, res) {
    try {
      const result = await problemStatementService.getAllProblemStatements();
      res.status(200).json({ status: true, data: result });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  async add(req, res) {
    try {
      const { club, title } = req.body;
      if (!club || !title) {
        return res
          .status(400)
          .json({ status: false, message: "club and title required" });
      }
      // Only superadmin can add to any club, admin only to their club
      if (req.user.role === "admin" && req.user.club !== club) {
        return res
          .status(403)
          .json({
            status: false,
            message: "Admins can only add to their own club",
          });
      }
      if (req.user.role === "admin" && !clubs.includes(club)) {
        return res.status(400).json({ status: false, message: "Invalid club" });
      }
      const result = await problemStatementService.addProblemStatement({
        club,
        title,
      });
      res.status(201).json({ status: true, data: result });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }

  // Get problem statements by club (for admin/superadmin) via URL param
  async getByClub(req, res) {
    try {
      const club = req.params.club;
      if (!club) {
        return res
          .status(400)
          .json({ status: false, message: "Club not specified" });
      }
      const result = await problemStatementService.getProblemStatementsByClub(
        club
      );
      res.status(200).json({ status: true, data: result });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }
}

module.exports = new ProblemStatementController();
