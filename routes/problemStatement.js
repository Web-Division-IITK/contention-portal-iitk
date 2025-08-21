const { Router } = require("express");
const problemStatementController = require("../controllers/problemStatementController");
const { authAdmin } = require("../middleware/auth");

const router = Router();

// Protected route to get problem statements of a specific club via URL param
router.get("/:club", authAdmin, problemStatementController.getByClub);

// Protected route to add problem statement (admin/superadmin)
router.post("/add", authAdmin, problemStatementController.add);

module.exports = router;
