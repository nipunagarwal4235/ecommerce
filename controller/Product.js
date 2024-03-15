const { Product } = require("../model/Product");

exports.createProduct = async (req, res) => {
  //this is the product we have to get form API body
  const product = new Product(req.body);
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  // TODO : we have to try with multiple category and brands after change in front-end
  let query = Product.find({ deleted: { $ne: true } });
  let totalProductsQuery = Product.find({ deleted: { $ne: true } });

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductsQuery = totalProductsQuery.find({
      category: req.query.category,
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
  }
  //TODO : How to get sort on discounted Price not on Actual price
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

// This line imports the Product model from the file located at "../model/Product". This assumes that there's a file exporting a Product model using something like module.exports = { Product };. In web development, models are typically used to represent data structures, often corresponding to database tables or documents in NoSQL databases.

// This line exports a function named createProduct. In the context of web development, this function is likely to be used as a controller function in a Node.js web server. It handles requests related to creating new products.

// This line creates a new instance of the Product model using the data provided in the request body (req.body). This assumes that the request contains data representing a product in a format that can be used to instantiate a Product object.

// This line calls the save method on the product object. In the context of Mongoose (assuming Product is a Mongoose model), save is used to persist the product object to the database. It takes a callback function as an argument, which will be executed once the save operation completes. The callback function receives two parameters: err, which contains any error that occurred during the save operation, and doc, which contains the saved document.

// This line logs the err and doc objects to the console. This is typically used for debugging purposes to see the result of the save operation and any potential errors.

// This block of code checks if an error occurred during the save operation. If there is an error (err is truthy), it sets the HTTP status code to 400 (Bad Request) and sends the error object as a JSON response. Otherwise, it sets the HTTP status code to 201 (Created) to indicate that the resource was successfully created, and sends the saved document as a JSON response.
// In summary, the provided code is a controller function for creating new products in a web application. It uses a Product model to represent products, saves the product data received from the request body to the database, and responds with either the saved product data or an error message.
