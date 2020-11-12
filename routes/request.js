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
    const {solved,request_id,blood_group,units}=req.body
    db.query(UPDATE_REQUEST,[blood_group,units,solved,request_id])
    .then(()=>{
        return res.status(200).json({message:"Updated",updated:true})
    })
    .catch(err=>{
        return res.status(400).json({message:"Not updated",updated:false})
    })
});

module.exports = request;
