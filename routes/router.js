const express = require("express");

const {
  addItems,
  getItems,
  getFindData,
  ubahData,
  deleteData,
  getDataCategory,
  getDataProdukwithLimit,
} = require("../controller/baseController");
const multer = require("multer"); // v1.0.5
const { AddItemsAsync, AddProdukAsync } = require("../controller/uploadImages");

const {
  AuthSignUp,
  login,
  getuserLogin,
  logout,
} = require("../controller/Auth/AuthController");
const AddToCart = require("../controller/AddCart");
const {
  addItemToUserOrder,
  createInvoice,
} = require("../controller/CheckoutInvoice");
const {
  getTransaction,
  getTransactionDetail,
  updatePayment,
} = require("../controller/ControllerTransaction.");
const getCart = require("../controller/getCart");
const deleteProduk = require("../controller/deleteImagesProduk");
const getRevenue = require("../controller/revenue");
const getSession = require("../controller/Auth/getSession");

const storage = multer.diskStorage({});
const upload = multer({ storage });

const router = express.Router();
const routerAuth = express.Router();
const routerAddCart = express.Router();
const routerDel = express.Router();
const routerRevenue = express.Router();

routerAuth.get("/getAuth", getuserLogin);
routerAuth.post("/logout", logout);
routerAuth.get("/getSession", getSession);
routerAddCart.post("/addToCart/addItem/:qty", AddToCart);
routerRevenue.get("/getRevenue", getRevenue);

router.post("/:nameTable", addItems);
router.get("/:nameTable", getItems);
router.get("/:nameTable/:columnName/:value", getFindData);
router.post("/:nameTable/:columnNameId/:id", ubahData);
router.delete("/:nameTable/:idColumnName/:id", deleteData);
router.delete("/deleteProdukImage/:Produk_Id", deleteProduk);

router.get("/getsCategory/getData", getDataCategory);
router.get("/limits/getProduk/getData/produk", getDataProdukwithLimit);

router.post("/form/addImageProduk", upload.array("file", 4), AddItemsAsync);
router.post("/form/addProduk", upload.array("file", 1), AddProdukAsync);
router.post("/signup/addUser", AuthSignUp);
router.post("/login/getUser", login);

router.post("/order/addorder", addItemToUserOrder);
router.get("/createInvoice/addorder?", createInvoice);

router.get("/getTransaction/getData", getTransaction);
router.get("/get/getTransactionDetail/getData/:id", getTransactionDetail);

router.get("/listcart/getData", getCart);
router.put("/updatepayment/:OrderID?", updatePayment);

module.exports = {
  routes: router,
  routesAuth: routerAuth,
  routesAddCart: routerAddCart,
  routesDel: routerDel,
  routesRevenue: routerRevenue,
};
