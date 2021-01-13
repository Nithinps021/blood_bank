const express = require("express");
const { compile } = require("morgan");
const { all, use } = require("../app");
const { query } = require("../database/database");
const db = require("../database/database");

const SELECT_REQUEST =
  'SELECT request_id, blood_group, units, "userId", solved, date_of_request FROM public."BloodRequest" where blood_group=$1 and request_id not in ( SELECT request_id FROM public."DonorsWilling");';
const INSERT_WILLING =
  'INSERT INTO public."DonorsWilling"( username, request_id) VALUES ($1,$2);';
const DELETE_WILLING =
  'DELETE FROM public."DonorsWilling" WHERE username=$1 and request_id=$2;';
const PAST_DONATIONS =
  'SELECT request_id, blood_group, units, "userId", solved, date_of_request FROM public."BloodRequest" where solved=true and request_id in (select request_id FROM public."DonorsWilling" where username=$1 and selected=true);';
const donor = express.Router();
donor.use(express.json());

donor.route("/not_fullfilled").post((req, res) => {
  const { blood_group, username } = req.body;
  db.query(SELECT_REQUEST, [blood_group])
    .then((data1) => {
      let finalData = data1.rows.filter(
        (e) => e.userId.trim() != username.trim()
      );
      return res.status(200).json(finalData);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "Something went wrong", err });
    });
});
donor.route("/willing").post((req, res) => {
  const { username, request_id } = req.body;
  db.query(INSERT_WILLING, [username, request_id])
    .then((data) => {
      return res.status(200).json({ added: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ message: "Not added", added: false, err });
    });
});
donor.route("/not_willing").post((req, res) => {
  const { username, request_id } = req.body;
  db.query(DELETE_WILLING, [username, request_id])
    .then((data) => {
      return res.status(200).json({ removed: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ removed: false, err });
    });
});

donor.route("/past_donations").post((req, res) => {
  const { username } = req.body;
  db.query(PAST_DONATIONS, [username])
    .then((data) => {
      return res.status(200).json(data.rows);
    })
    .catch((err) => {
      return res.status(400).json({ message: "Someting went wrong", err });
    });
});

module.exports = donor;
