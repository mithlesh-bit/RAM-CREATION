const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const auth = require("../middleware/auth");
const upload = require("../multer");

router.get("/", controller.index);
router.get("/photos/:id", controller.photos);
router.get("/admin/addData", auth, controller.addData);
router.get("/addsection", auth, controller.addSection);
router.get("/login", controller.login);
router.get("/admin", auth, controller.admin);
router.get("/admin/api/more/:id", auth, controller.more);
router.get("/admin/more/:id", auth, controller.morePage);
// router.get("/admin/edit/:id", auth, controller.editImage);

router.post(
  "/admin/addData",
  auth,
  upload.single("image"),
  controller.addDataPost
);

router.post("/login", controller.loginPost);
router.post("/contact", controller.contactPost);
router.post("/admin/update", auth, controller.updateUser);
router.delete("/admin/deletePost/:postId", auth, controller.deletePost);
router.put("/admin/updatePost/:id", auth, controller.updatePost);
router.post("/admin/logout", auth, controller.logout);
router.post(
  "/admin/addData/moredata",
  auth,
  upload.array("fileInput", 5), // For multiple files, up to 5 for example
  controller.morePagePost
);
router.delete("/admin/deleteImage/:id", auth, controller.deleteImage);

module.exports = router;
