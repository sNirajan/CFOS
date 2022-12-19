const express = require("express");
const nunjucks = require("nunjucks");
const session = require("express-session");
const { SESSION, DB } = require("./config/config.js");
const { Order, seedOrder } = require("./models/orderModel");
const { MenuItem, seedMenuItem } = require("./models/menuItemModel");
const { RestrictRoute } = require("./middlewares/auth");

const port = 3000;
const app = express();

const indexRoute = require("./routes/index");
const employeeRoutes = require("./routes/employee");
const cafeRoutes = require("./routes/cafe");
const menuItemRoutes = require("./routes/menuItem");
const instafoodRoutes = require("./routes/instafood");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");
const { default: mongoose } = require("mongoose");

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  noCache: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));
app.use(session({ secret: SESSION.secret }));

app.use("/", indexRoute);
app.use("/employee", employeeRoutes);
app.use("/cafe", cafeRoutes);
app.use("/menuItem", menuItemRoutes);
app.use("/instafood", instafoodRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);

app.get("/order/tracker/:orderId", async (req, res) => {
  res.set({
    "Connection": "keep-alive",
    "Content-type": "text/event-stream"
  });
  await mongoose.connect(DB.uri);
  Order.watch().on("change", change => {
    if(change.operationType == "update" && change.documentKey._id == req.params.orderId) {
      res.write("event: " + req.params.orderId + "\ndata: " + change.updateDescription.updatedFields.status + "\n\n");
    }
  });
});

app.get("/cafe/orderRetriever/:cafeId", async (req, res) => {
  res.set({
    "Connection": "keep-alive",
    "Content-type": "text/event-stream"
  });
  await mongoose.connect(DB.uri);
  Order.watch().on("change", change => {
    if(change.operationType == "insert" && change.fullDocument.cafeId == req.params.cafeId) {
      res.write("event: " + req.params.cafeId + "\ndata: NEW_ORDER_FOUND\n\n");
    }
  });
});

app.use((req, res) => {
  res.status(404).sendFile(__dirname + "/public/404.html");
});


app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).sendFile(__dirname + "/public/500.html");
});

app.listen(port, () => {
  console.log("App listening on http://localhost:" + port);
});
