const BaseModels = require("../../models/BaseModels");
const { connection } = require("../../config/db");

// Fungsi untuk menjalankan kueri dengan async/await
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const AuthSignUp = (req, res) => {
  try {
    const dataUser = req.body;
    BaseModels.tambah("userakun", dataUser);
    res.status(200).send("data berhasil di daftarkan");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    // Lakukan kueri ke database dengan async/await
    const rows = await query(`SELECT * FROM userakun WHERE Email = ?`, [Email]);
    if (rows.length === 0) {
      return res.send("Username tidak ditemukan.");
    }

    const user = rows[0];

    // Periksa apakah kata sandi yang diberikan sesuai dengan yang ada di database
    if (user.Password !== Password) {
      return res.send("Kata sandi salah.");
    }
    req.session.user = { username: user.Fullname, userID: user.AkunID };
    res.status(200).json({ message: "berhasil login", user: req.session.user });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getuserLogin = (req, res) => {
  if (req.session.user) {
    // menerima data session user
    res.status(200).json(req.session);
  } else {
    res.status(401).send("unauthorized");
  }
};

const logout = (req, res) => {
  if (req.session.user) {
    // lakukan destroy session
    req.session.destroy(() => {
      res.status(200).send("Berhasil.logout dn data login dihapus");
    });
  } else {
    res.status(401).send("anda belum login");
  }
};

module.exports = {
  AuthSignUp,
  login,
  getuserLogin,
  logout,
};
