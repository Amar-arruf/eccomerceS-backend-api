const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const Routes = require("./routes/router");
const session = require("express-session");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: "https://ecommerce-sarung.vercel.app", // Atur origin sesuai domain Next.js
  credentials: true, // Izinkan pengiriman cookie
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.secret_session,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  })
);

app.get("/", function (req, res) {
  res.send("selamat Datang di API Backend Server ecommerce");
});

// routes /api
app.use("/api", Routes.routes);
app.use("/api/auth", Routes.routesAuth);
app.use("/api/cart", Routes.routesAddCart);
app.use("/api/revenue", Routes.routesRevenue);

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listning on PORT", PORT);
});
