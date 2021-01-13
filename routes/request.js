const express = require("express");
const request = express.Router();
const db = require("../database/database");

request.use(express.json());

const INSERT_INTO_BLOOD_REQUEST =
  'INSERT INTO public."BloodRequest"(blood_group, units, "userId", date_of_request)VALUES ($1, $2, $3, $4);';
const SELECT_BLOOD_REQUEST =
  'SELECT request_id, blood_group, units, "userId", solved, date_of_request FROM public."BloodRequest" WHERE "userId"=$1 and solved=$2;';
const UPDATE_REQUEST =
  'UPDATE public."BloodRequest" SET blood_group=$1, units=$2, solved=$3 WHERE request_id=$4;';
const CANCEL_REQUEST =
  'UPDATE public."BloodRequest" SET solved=$1 WHERE request_id=$2;';
const COLLECT_USER_INFO =
  'SELECT dob, email, gender, "phoneNo",selected,public."User".username FROM public."User" inner join public."DonorsWilling" on public."User".username=public."DonorsWilling".username where request_id=$1;';
const SELECT_DONOR =
  'UPDATE public."DonorsWilling" SET  selected=true WHERE username=$1 and request_id=$2;';
const DESELECT_DONOR =
  'UPDATE public."DonorsWilling" SET  selected=false WHERE username=$1 and request_id=$2;';

request.route("/").post((req, res) => {
  const { username: userId, units, blood_group, date_of_request } = req.body;
  db.query(INSERT_INTO_BLOOD_REQUEST, [
    blood_group,
    units,
    userId,
    date_of_request,
  ])
    .then(() => {
      return db.query(SELECT_BLOOD_REQUEST, [userId, false]);
    })
    .then((data) => {
      return res.status(200).json(data.rows);
    })
    .catch((err) => {
      return res.status(400).json({ message: "Someting went wrong", err: err });
    });
});

request.route("/notresolved/:username").get((req, res) => {
  const { username } = req.params;
  console.log(req.query);
  db.query(SELECT_BLOOD_REQUEST, [username, false])
    .then((data) => {
      return res.status(200).json(data.rows);
    })
    .catch((err) => {
      return res.status(500).json({ message: "something went wrong", err });
    });
});

request.route("/resolved/:username").get((req, res) => {
  const { username } = req.params;
  console.log(req.query);
  db.query(SELECT_BLOOD_REQUEST, [username, true])
    .then((data) => {
      return res.status(200).json(data.rows);
    })
    .catch((err) => {
      return res.status(500).json({ message: "something went wrong", err });
    });
});

request.route("/update").post((req, res) => {
  const { solved, request_id, blood_group, units } = req.body;
  db.query(UPDATE_REQUEST, [blood_group, units, solved, request_id])
    .then(() => {
      return res.status(200).json({ message: "Updated", updated: true });
    })
    .catch((err) => {
      return res.status(400).json({ message: "Not updated", updated: false });
    });
});
request.route("/delete_request").post((req, res) => {
  const { request_id } = req.body;
  db.query(CANCEL_REQUEST, [true, request_id])
    .then((data) => {
      return res.status(200).json({ removed: true, data });
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ message: "something went wrong", removed: false });
    });
});
request.route("/donors_details").post((req, res) => {
  const { request_id } = req.body;
  db.query(COLLECT_USER_INFO, [request_id])
    .then((data) => {
      return res.status(200).json(data.rows);
    })
    .catch((err) => {
      return res.status(400).json({ message: "Someting went wrong", err });
    });
});
request.route("/select").post((req, res) => {
  const { username, request_id } = req.body;
  db.query(SELECT_DONOR, [username, request_id])
    .then((data) => {
      return res.status(200).json({ seleted: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ message: "something went wrong", err });
    });
});
request.route("/deselect").post((req, res) => {
  const { username, request_id } = req.body;
  db.query(DESELECT_DONOR, [username, request_id])
    .then((data) => {
      return res.status(200).json({ deseleted: true, data });
    })
    .catch((err) => {
      return res.status(400).json({ message: "something went wrong", err });
    });
});

module.exports = request;
