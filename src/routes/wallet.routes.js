const tasksCtrl = require("../controllers/wallet.controller");
const {Router} = require("express");

const router = Router();

router.post("/customer/signup", tasksCtrl.createCustomer);

router.put("/wallet/set_balance", tasksCtrl.setBalance);

router.post("/wallet/pay_purchase", tasksCtrl.payPurchase);

router.post("/wallet/confirm_pay", tasksCtrl.confirmPay);

router.get("/wallet/get_balance", tasksCtrl.getBalance);

module.exports = router;
