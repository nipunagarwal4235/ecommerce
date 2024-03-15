const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: {
    type: Number,
    min: [1, "wrong min price"],
    max: [10000, "wrong max price"],
  },
  discountPercentage: {
    type: Number,
    min: [1, "wrong min discount"],
    max: [99, "wrong max discount"],
  },
  rating: {
    type: Number,
    min: [0, "wrong min rating"],
    max: [5, "wrong max price"],
    default: 0,
  },
  stock: { type: Number, min: [0, "wrong min stock"], default: 0 },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], required: true },
  deleted: { type: Boolean, default: false },
});

const virtual = productSchema.virtual("id");
virtual.get(function () {
  return this._id;
});

productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Product = mongoose.model("Product", productSchema);

// Importing Mongoose: The first line const mongoose = require('mongoose'); imports the Mongoose library, which is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward schema-based solution to model your application data.
// const {Schema} = mongoose;

// Destructuring Schema: The line const { Schema } = mongoose; uses destructuring to extract the Schema object from the mongoose module. The Schema object is used to define the structure of documents in MongoDB.

// Defining Schema: The productSchema variable is declared using the Schema constructor from Mongoose. Inside it, you define the structure of your documents. Each field corresponds to a property that will be stored in your MongoDB documents. In this schema:

// title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images, and deleted are all fields of the document.
// Each field has a specified type (String, Number, Boolean) and can have additional constraints like required, min, max, and unique.

// Defining Virtual Property: The virtual method is used to create a virtual property called id. Virtual properties are properties that are not stored in MongoDB but computed dynamically. In this case, the id virtual property maps to the _id field of the document.

// Setting toJSON Options: The set method is used to set options for transforming the document before it's converted to JSON. Here:

// virtuals: true ensures that virtual properties are included in the JSON representation of the document.
// versionKey: false ensures that the version key (__v) is not included in the JSON output.
// transform is a function that modifies the JSON representation of the document. In this case, it removes the _id field from the JSON output.

// Exporting Model: Finally, the schema is used to create a Mongoose model called Product using mongoose.model(). This model is exported so that it can be used in other parts of the application to interact with the MongoDB database.

// In summary, this code sets up a Mongoose schema for a product, defines its structure and constraints, creates a virtual property for the document's ID, and exports a Mongoose model for the product schema. This allows you to perform CRUD (Create, Read, Update, Delete) operations on products in your MongoDB database using Mongoose methods.
