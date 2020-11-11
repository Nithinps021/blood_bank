const express = require("express");
const user = express.Router();
const db = require("../database/database");

user.use(express.json());

user.route("/signup").post((req, res) => {
  db.query(
    'INSERT INTO public."User"(dob, email, gender, "phoneNo", username) VALUES ($1,$2,$3,$4,$5)',
    ["1998-11-28", "jdbf", "kwjbd", "ehjwbfhb", "jdfn"]
  ).then((data) => {
    return res.status(200).json(data);
  })
  .catch(err=>{
    return res.status(400).json(err)
  })
})

module.exports = user;
