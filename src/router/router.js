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

router.post("/admin/addData", auth, upload.single("image"), controller.addDataPost);
router.post("/addsection", auth, upload.array("image", 5), controller.addSectionPost);
router.post("/login", controller.loginPost);
router.post("/contact", controller.contactPost);
router.post("/admin/update", auth, controller.updateUser);
router.delete("/admin/deletePost/:postId", auth, controller.deletePost);
router.put("/admin/updatePost/:id", auth, controller.updatePost);
router.post("/admin/logout", auth, controller.logout);
// router.get("/admin/detailed/:id", auth, controller.detailed);
router.get("/admin/more/:id", auth, controller.morePage);



module.exports = router;
