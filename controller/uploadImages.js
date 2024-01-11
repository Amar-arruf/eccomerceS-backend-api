const cloudinary = require("../config/cloudinary");
const { connection } = require("../config/db");
const generateRandomId = require("../provider/generateRandomId");
const queryAsync = require("../provider/queryAsync");

async function uploadImages(imagePaths) {
  try {
    const uploadPromises = imagePaths.map((imagePath) => {
      const fileName = imagePath.split("\\").pop(); // Mengambil nama file dari path
      const public_id = fileName.split(".").slice(0, 1).join("."); // Menghilangkan ekstensi dari nama file
      return cloudinary.uploader.upload(imagePath, {
        folder: `produkImage/`,
        public_id,
      });
    });

    const results = await Promise.all(uploadPromises);

    return results;
  } catch (error) {
    return `Terjadi kesalahan saat mengunggah gambar: ${error}`;
  }
}

// digunakan di route

const AddItemsAsync = async (req, res) => {
  try {
    const imagePaths = req.files.map((file) => file.path);
    const params = req.body;
    // res.send(req.files);
    const result = await uploadImages(imagePaths);

    // jika result bukan array
    if (!Array.isArray(result)) {
      return res.status(400).send(result);
    }

    // menambahkan  jika image  lebih dari satu
    const itemsQuery = imagePaths.map((item, index) => {
      const query =
        "INSERT INTO produkimage (IDImageProduk,ProdukId, url_image) VALUES (?,?,?)";
      return queryAsync(query, [
        "IMG" + generateRandomId(4),
        params.ProdukId,
        result[index].url,
      ]);
    });

    const getItem = Promise.all(itemsQuery);
    getItem
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(400).send(err);
      });

    // connection.query(
    //   `INSERT INTO produkimage (IDImageProduk,ProdukId, url_image) VALUES (?,?,?)`,
    //   [params.IDImageProduk, params.ProdukId, result[0].url],
    //   (err, results, fields) => {
    //     if (err) {
    //       res.status(400).send(err.message);
    //     } else {
    //       res.status(200).send("berhasil ditambahkan");
    //     }
    //   }
    // );
  } catch (error) {
    res.status(404).send(error);
  }
};

const AddProdukAsync = async (req, res) => {
  try {
    // upload ke cloudinary
    const GetFilePath = req.files.map((file) => file.path);
    const result = await uploadImages(GetFilePath);

    // jika result bukan array
    if (!Array.isArray(result)) {
      return res.status(400).send(result);
    }
    // tambahkan ke database
    const query = `INSERT INTO produk (Produk_ID,Category,Nama_Produk,Deskripsi_Produk,Harga,Stock, thumbnail, uploader) VALUES (?,?,?,?,?,?,?,?)`;

    const getQueryRes = queryAsync(query, [
      "S" + generateRandomId(3),
      Number(req.body.category),
      req.body.produkname,
      req.body.deskripsi,
      req.body.produkharga,
      Number(req.body.stock),
      result[0].url,
      Number(1231134),
    ])
      .then((results) => {
        res.send(result);
      })
      .catch((err) => res.status(400).send(err));
  } catch (error) {
    res.status(404).send(error);
  }
};

module.exports = {
  AddItemsAsync,
  AddProdukAsync,
};
