const cloudinary = require("../config/cloudinary");
const { connection } = require("../config/db");
const queryAsync = require("../provider/queryAsync");

async function deleteImageCloud(urlsImage) {
  try {
    const deletePromises = urlsImage.map((url_Image) => {
      // mendapatkan filename dari urls
      const filename = url_Image.split("/").pop();
      // mendapatkan public_Id
      const public_Id = filename.split(".").slice(0, 1).join("");
      return cloudinary.uploader.destroy(`produkImage/${public_Id}`);
    });

    const result = await Promise.all(deletePromises);
    console.log("Ok");
    return result;
  } catch (error) {
    return `Terjadi kesalahan saat mengunggah gambar: ${error}`;
  }
}

const getItemsProdukImage = async (produkId) => {
  try {
    const query = `SELECT url_image FROM produkimage WHERE ProdukId= ?`;
    const res = await queryAsync(query, [produkId]);
    return res;
  } catch (error) {
    console.log("gagal mendapatakan urls Produk Image", error);
  }
};

const deleteItemsImageProduk = async (produkId) => {
  try {
    // dapatkan item
    const res = await getItemsProdukImage(produkId);
    // dapatkan data dari getItemsProdukImage dan kirim sebagai array
    const urlImageArr = res.map((obj) => obj.url_image);
    const resdelCloud = await deleteImageCloud(urlImageArr);

    const deleteProdukImage = urlImageArr.map(() => {
      const query = `DELETE FROM produkimage WHERE ProdukId=?`;
      return queryAsync(query, produkId);
    });
    const resDeleted = await Promise.all(deleteProdukImage);

    console.log(resDeleted);
    return resDeleted;
  } catch (error) {
    console.log("gagal menghapus item Produk Image", error);
  }
};

const deleteProduk = async (req, res) => {
  const ProdukId = req.params.Produk_Id;
  try {
    // delete data produkimage terlebih dahulu
    const resultDeletedItemImageProduk = await deleteItemsImageProduk(ProdukId);
    // hapus image thumbnail di cloud
    const queryGetThumbnail = `SELECT thumbnail FROM produk WHERE Produk_ID =?`;
    const getThumbnail = await queryAsync(queryGetThumbnail, [ProdukId]);
    const getThumnailArr = getThumbnail.map((obj) => obj.thumbnail);
    const deleteThumnailCloud = await deleteImageCloud(getThumnailArr);

    const query = `DELETE FROM produk WHERE Produk_ID=?`;
    const result = await queryAsync(query, [ProdukId]);
    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = deleteProduk;
