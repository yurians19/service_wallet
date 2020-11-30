const Customer = require('../models/wallet')
const { v4: uuidv4 } = require('uuid')
const nodemailer = require('nodemailer')
const emailContent = require('../views/email')
const walletCtrl = {};
require('dotenv').config()

walletCtrl.createCustomer = async (req, res) => {
  try {
    const { first_name, last_name, document, email, phone_number } = req.body
    if (typeof first_name !=  'string' ||
        typeof last_name !=  'string' ||
        typeof document !=  'string' ||
        typeof email !=  'string' ||
        typeof phone_number !=  'string'
        ) {
      return res.status(409).send({ message: "Content cannot be empty" });
    }

    const Customer = new Customer({
      firstName: first_name,
      lastName: last_name,
      document: document,
      email: email,
      phoneNumber: phone_number,
    });

    await Customer.save();
    return res.send({ message: "customer saved successfully" });
  } catch (error) {
    if (error.code == 11000) {
      res.status(400).send({ message: "customer exists" });
    }
    res.status(500).send({message: "Something went wrong creating the customer"});
  }
};

walletCtrl.setBalance = async (req, res) => {
  const { document, balance: balanceEntry, phone_number } = req.body
  // validate fields
  if (typeof balanceEntry !=  'number' ||
      typeof document !=  'string' ||
      typeof phone_number !=  'string'
      ) {
    return res.status(409).send({ message: "Content cannot be empty" });
  }

  const filter = { document, phoneNumber: phone_number};
  try {
    const customer = await Customer.findOne(filter);
    if (!customer) {
      res.status(404).send({message: `Customer does not exists`});
    }
    const { wallet } = customer
    const { wallet: { balance } } = customer
    wallet.balance = balance + balanceEntry
    await Customer.updateOne(filter, { wallet }, {useFindAndModify: false});
    res.send({ message: "Balance added successfully" });
  } catch (error) {
    res.status(500).send({
      message: `Error updating Customer with document ${error}`,
    });
  }
};

walletCtrl.payPurchase = async (req, res) => {

    const { email, amount_pay } = req.body
    if (typeof email !=  'string' && typeof amount_pay !=  'number') {
      return res.status(409).send({ message: "Content cannot be empty" });
    }

    const token = Math.floor(100000 + Math.random() * 900000)
    const sessionID = uuidv4()

    try {
      const customer = await Customer.findOne({ email });
      if (!customer) {
        res.status(404).send({message: `Customer not found`});
      }
      const { wallet: { balance }} = customer
      if (amount_pay > balance) {
        res.status(409).send({message: `Sorry, insufficient balance`});
      }

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
      });
      await transporter.sendMail({
        from: '"Fred Foo 👻" <yurians19@gmail.com>',
        to: email,
        subject: "Confirm pay",
        text: "Please click this link for you Confirm pay",
        html: emailContent(`${req.app.locals.serverURL}/api/wallet/confirm_pay`, token, sessionID),
      });

      const update = { sessionID, wallet: { balance, token, amountPay: amount_pay} };
      await Customer.updateOne({email}, update, {useFindAndModify: false});
      res.send({ message: "It has been sent an email to confirm the purchase" });
    } catch (error) {
      res.status(500).send({
        message: `Error Customer with email ${email} ${error}`
      });
    }
};

walletCtrl.getBalance = async (req, res) => {
  const { document, phone_number } = req.query;

  try {
    const customer = await Customer.findOne({ document, phoneNumber: phone_number});
    if (!customer) {
      res.status(404).send({message: `Customer does not exists`});
    }
    const { wallet: {balance}} = customer
    return res.json({balance});
  } catch (error) {
    res.status(500).json({ message: "Error retrieving customer with document: " + document });
  }
};


walletCtrl.confirmPay = async (req, res) => {
  const { token: tokenEntry, sessionID } = req.body;

  try {
    const customer = await Customer.findOne({ sessionID });
    if (!customer) {
      res.status(404).send({message: `Customer not found`});
    }
    const { wallet: { token, amountPay, balance }} = customer
    if (tokenEntry != token) {
      res.render('pay',{ title: "Error", message: `Sorry token invalid` });
    }
    if (amountPay > balance) {
      res.render('pay',{ title: "Error", message: `Sorry, insufficient balance` });
    }
    const newBalance = balance - amountPay
    const update = { wallet: { token:'', balance: newBalance, amountPay:0 } };
    const updateCustomer = await Customer.updateOne({sessionID}, update, {useFindAndModify: false});
    if (updateCustomer) {
      res.render('pay',{ title: "Successfully", message: `Successfully confirm you pay` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving confirm pay: "});
  }
};

module.exports = walletCtrl;

