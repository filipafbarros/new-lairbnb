const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A property needs a name"],
    unique: true,
    trim: true,
    maxlength: [60, "A property must have less or equal than 60 characters"],
    minlength: [10, "A property must have more of equal than 10 characters"],
  },
});

// const PropertySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "A property needs a name"],
//     unique: true,
//     trim: true,
//     maxlength: [60, "A property must have less or equal than 60 characters"],
//     minlength: [10, "A property must have more of equal than 10 characters"],
//   },
//   slug: String,
//   maxGuests: {
//     type: Number,
//     required: [true, "A property must have a max number of guests"],
//   },
//   ratingsAverage: {
//     type: Number,
//     default: 4.5,
//     min: [1, "Rating must be above 1.0"],
//     max: [5, "Rating must be below 5.0"],
//     set: (val) => Math.round(val * 10) / 10,
//   },
//   ratingsQuantity: {
//     type: Number,
//     default: 0,
//   },
//   description: { type: String, required: true },
//   location: { type: String, required: true },
//   price: { type: Number, required: [true, "A property must have a price"] },
//   amenities: [String],
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   images: [String],
//   createdAt: { type: Date, default: Date.now(), select: false },
// });

const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;
