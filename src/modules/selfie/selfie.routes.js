const express = require("express");
const router = express.Router();
const service = require("./selfie.service");
const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");
const upload = require("../../middlewares/upload.middleware");

// 🔥 CREATE WITH IMAGE UPLOAD
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const image_url = req.file.path;

    const data = await service.createSelfie({
      user_id: req.body.user_id,
      salon_id: req.body.salon_id,
      image_url
    });

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔥 SALON VALIDATION
router.put("/validate/:id", auth, async (req, res) => {
  const data = await service.validateSelfie(req.params.id);
  res.json(data);
});

// 🔥 ADMIN APPROVE
router.put("/approve/:id", auth, role(["ADMIN"]), async (req, res) => {
  const data = await service.approveSelfie(req.params.id);
  res.json(data);
});

// 🔥 REJECT
router.put("/reject/:id", auth, role(["ADMIN"]), async (req, res) => {
  const data = await service.rejectSelfie(req.params.id);
  res.json(data);
});

// 🔥 GET ALL
router.get("/", auth, async (req, res) => {
  const data = await service.getSelfies();
  res.json(data);
});

module.exports = router;