const { connection } = require("../config/db");
const BaseModels = require("../models/BaseModels");

addItems = (req, res) => {
  try {
    const data = req.body;
    const tablename = req.params.nameTable;
    BaseModels.tambah(tablename, data);
    res.status(200).send("data berhasil di tambahkan");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// get all data
getItems = (req, res) => {
  try {
    const tablename = req.params.nameTable;
    const result = BaseModels.getAll(tablename, (err, data) => {
      if (err) {
        res.status(400).send("Not Found");
      }
      res.send(data);
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// get find data with id
getFindData = (req, res) => {
  try {
    const params = req.params;
    BaseModels.getFindData(
      params.nameTable,
      params.columnName,
      params.value,
      (err, data) => {
        if (err) {
          res.status(404).send("Not Found");
        }
        res.send(data);
      }
    );
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// update Data
ubahData = (req, res) => {
  try {
    const data = req.body;
    const params = req.params;
    BaseModels.updateData(
      params.nameTable,
      params.columnNameId,
      params.id,
      data,
      (err, data) => {
        if (err) {
          res.status(404).send(err.message);
        }
        res.send(data);
      }
    );
  } catch {
    res.status(400).send(error.message);
  }
};

// Delete Data
deleteData = (req, res) => {
  try {
    const params = req.params;
    BaseModels.deleteData(
      params.nameTable,
      params.idColumnName,
      params.id,
      (err, data) => {
        if (err) {
          res.status(404).send(err.message);
        }
        res.send(data);
      }
    );
  } catch {
    res.status(400).send(error.message);
  }
};

getDataCategory = (req, res) => {
  try {
    const query = `SELECT category_list.ID, MAX(category_list.NAMA_CATEGORY) AS NAMA_CATEGORY, MAX(produk.thumbnail) AS thumbnail 
                   FROM category_list 
                   JOIN produk ON category_list.ID = produk.Category
                   GROUP BY category_list.ID`;
    connection.query(query, (err, result, fields) => {
      if (err) {
        res.status(404).send(err.message);
      } else {
        res.status(200).send(result);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

getDataProdukwithLimit = (req, res) => {
  try {
    const paramsQuery = req.query.limit;
    const query = `SELECT * FROM produk LIMIT ${paramsQuery}`;
    connection.query(query, (err, result, fields) => {
      if (err) {
        res.status(404).send(err.message);
      } else {
        res.status(200).send(result);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  addItems,
  getItems,
  getFindData,
  ubahData,
  deleteData,
  getDataCategory,
  getDataProdukwithLimit,
};
