const express = require("express");
const router = express.Router();

const installRoutes = require("./install.routes");
const messageRoutes = require("./message.routes");
const authRoutes = require("./auth.routes");

router.use("/api", installRoutes);
router.use("/api", messageRoutes);
router.use("/api", authRoutes);

module.exports = router;
