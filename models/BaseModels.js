const { connection } = require("../config/db");
class BaseModels {
  // create data
  static tambah(tablename, ...objectData) {
    const columns = Object.keys(objectData[0]).join(", ");
    const values = objectData.map((obj) => Object.values(obj));
    const placeholders = values.map(() => "?").join(", ");

    const query = `INSERT INTO ${tablename} (${columns}) VALUES (${placeholders})`;
    const flattenedValues = values.flat();
    const result = connection.query(
      query,
      [flattenedValues],
      (err, rows, fields) => {
        if (err) {
          throw err;
        }
      }
    );
  }
  // get data All async
  static getAll(tablename, callback) {
    const query = `SELECT * FROM ${tablename}`;
    connection.query(query, (err, result, fields) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

  // get data async
  static getFindData(tablename, idColumnName, id, callback) {
    const query = `SELECT * FROM ${tablename} WHERE ${idColumnName} = ?`;
    connection.query(query, id, (err, result, fields) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

  // update Data
  static updateData(tableName, idColumnName, id, updateData, callback) {
    // mendapatkan keys dari object updateData
    const keys = Object.keys(updateData);
    // menentukan kolom di jadikan SET nantinya
    const columnUpdate = keys.filter((key) => key !== idColumnName);
    const setClause = columnUpdate.map((column) => `${column} = ?`).join(", ");
    // ekstrak values
    const valuestoUpdate = columnUpdate.map((column) => updateData[column]);
    valuestoUpdate.push(id);

    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${idColumnName} = ?`;
    connection.query(query, valuestoUpdate, (err, result, fields) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

  // delete Data
  static deleteData(tablename, idColumnName, id, callback) {
    const query = `DELETE FROM ${tablename} WHERE ${idColumnName} = ?`;
    connection.query(query, id, (err, result, fields) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }
}

module.exports = BaseModels;
