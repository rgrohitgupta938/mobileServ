const express = require("express");
const app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  next();
});

const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  password: "RgrohitG@938",
  database: "postgres",
  port: 5432,
  host: "db.ybwkusxubwtotgyapcob.supabase.co",
  ssl: { rejectUnauthorized: false },
});
const port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}`));
client.connect(function (err) {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database!");
  }
});
app.get("/svr/mobile", function (req, res) {
  const sql = "SELECT * FROM mobile";
  client.query(sql, function (err, result) {
    if (err) {
      console.error("Error fetching Mobile:", err);
      res.status(500).send("An error occurred while fetching Mobile.");
    } else {
      res.send(result.rows);
    }
  });
});

app.get("/svr/mobile/:id", function (req, res) {
  const id = +req.params.id;
  const sql = "SELECT * FROM mobile WHERE id = $1";
  client.query(sql, [id], function (err, result) {
    if (err) {
      console.error("Error fetching mobile:", err);
      res.status(500).send("An error occurred while fetching Mobile.");
    } else {
      res.send(result.rows);
    }
  });
});
app.get("/svr/mobile/RAM/:ram", function (req, res) {
  let ram = req.params.ram;
  console.log(ram);
  let sql = `select * from mobile where ram = $1`;
  client.query(sql, [ram], function (err, result) {
    if (err) res.status(404).send(err);
    else {
      res.send(result.rows);
    }
  });
});
app.get("/svr/mobile/ROM/:rom", function (req, res) {
  let rom = req.params.rom;
  console.log(rom);
  let sql = `select * from mobile where rom = $1`;
  client.query(sql, [rom], function (err, result) {
    if (err) res.status(404).send(err);
    else {
      res.send(result.rows);
    }
  });
});
app.get("/svr/mobile/brand/:brand", function (req, res) {
  let brand = req.params.brand;
  console.log(brand);
  let sql = "select * from mobile where brand = $1";
  client.query(sql, [brand], function (err, result) {
    if (err) res.status(404).send(err);
    else {
      res.send(result.rows);
    }
  });
});
app.get("/svr/mobile/OS/:os", function (req, res) {
  let os = req.params.os;
  console.log(os);
  let sql = "select * from mobile where os = $1";
  client.query(sql, [os], function (err, result) {
    if (err) res.status(404).send(err);
    else {
      res.send(result.rows);
    }
  });
});
app.get("/svr/resetData", function (req, res) {
  const deleteQuery = "DELETE FROM mobile";
  client.query(deleteQuery, function (err, deleteResult) {
    if (err) {
      console.error("Error while deleting data:", err);
      res.status(500).send("An error occurred while deleting data.");
    } else {
      const { mobiles } = require("./mobileData");
      const insertQuery =
        "INSERT INTO mobile (name, price, brand, ram, rom, os) VALUES ";
      const values = mobiles.map(
        (p) =>
          `('${p.name}', ${p.price}, '${p.brand}', '${p.RAM}', '${p.ROM}', '${p.OS}')`
      );
      const fullQuery = insertQuery + values.join(",");
      client.query(fullQuery, function (err, insertResult) {
        if (err) {
          console.error("Error while resetting data:", err);
          res.status(500).send("An error occurred while resetting data.");
        } else {
          res.send(
            "Successfully reset data. Affected rows: " + insertResult.rowCount
          );
        }
      });
    }
  });
});

app.post("/svr/mobile", function (req, res, next) {
  console.log("Request Body:", req.body);
  let { name, price, brand, ram, rom, os } = req.body;
  const insertQuery =
    "INSERT INTO mobile (name, price, brand, ram, rom,os) VALUES ($1, $2, $3, $4, $5, $6)";
  const values = [name, price, brand, ram, rom, os];
  client.query(insertQuery, values, function (err, result) {
    if (err) {
      console.error("Error while inserting data:", err);
      res.status(500).send("An error occurred while inserting data.");
    } else {
      console.log(result);
      res.send(`${result.rowCount} insertion Successful`);
    }
  });
});
app.put("/svr/mobile/:id", function (req, res) {
  const id = +req.params.id;
  let { name, price, brand, ram, rom, os } = req.body;
  if (id) {
    const selectQuery = "SELECT * FROM mobile WHERE id = $1";
    client.query(selectQuery, [id], function (err, result) {
      if (err) {
        res.status(404).send(err);
      } else {
        if (result.rows.length === 0) {
          res.status(404).send("Employee with the given ID not found.");
        } else {
          const updateQuery =
            "UPDATE mobile SET name=$1, price=$2, brand=$3, ram=$4, rom=$5 ,os=$6 WHERE id=$7";
          const values = [name, price, brand, ram, rom, os, id];

          client.query(updateQuery, values, function (err, result) {
            if (err) {
              console.error("Error while updating data:", err);
              res.status(500).send("An error occurred while updating data.");
            } else {
              console.log(result);
              res.send(`${result.rowCount} Updated Successful`);
            }
          });
        }
      }
    });
  }
});

app.delete("/svr/mobile/del/:id", function (req, res) {
  const id = +req.params.id;
  console.log(id);
  if (id) {
    const deleteQuery = "DELETE FROM mobile WHERE id = $1";
    client.query(deleteQuery, [id], function (err, result) {
      if (err) {
        res.status(404).send("Error while deleting employee.");
      } else {
        res.send(
          "Successfully deleted employee. Affected rows: " + result.rowCount
        );
      }
    });
  } else {
    res.status(400).send("Invalid employee ID.");
  }
});
