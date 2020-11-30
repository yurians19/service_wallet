const { Schema, model } = require('mongoose')

const CustomerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    document: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    sessionID: { type: String },
    wallet: {
      balance: { type: Number, default: 0 },
      token: { type: Number },
      amountPay: { type: Number, default: 0 },
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Change the '_id' property name to 'id'
CustomerSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Customers", CustomerSchema);
