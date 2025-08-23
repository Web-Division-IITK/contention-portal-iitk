const { ProblemStatement } = require("../model/ProblemStatement.js");

class ProblemStatementService {
  async getAllProblemStatements() {
    return await ProblemStatement.find({}).sort({ createdAt: -1 });
  }

  async addProblemStatement({ club, title }) {
    const ps = new ProblemStatement({ club, title });
    await ps.save();
    return ps;
  }

  async getProblemStatementsByClub(club) {
    return await ProblemStatement.find({ club }).sort({ createdAt: -1 });
  }
}

module.exports = new ProblemStatementService();
