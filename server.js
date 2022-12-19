const express = require("express");
const nunjucks = require("nunjucks");
const session = require("express-session");
const expressWs = require("express-ws");
const { SESSION } = require("./config/config.js");
const { Order } = require("./models/orderModel");
const { RestrictRoute } = require("./middlewares/auth");

const port = 3000;
const app = express();
const ws = expressWs(app);

const indexRoute = require("./routes/index");
const employeeRoutes = require("./routes/employee");
const cafeRoutes = require("./routes/cafe");
const menuItemRoutes = require("./routes/menuItem");
const instafoodRoutes = require("./routes/instafood");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");

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

const orderUpdateWatch = Order.watch()
orderUpdateWatch.on('change', change => {
  console.log(change);
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
