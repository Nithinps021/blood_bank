const express = require("express");
const user = express.Router();
const db = require("../database/database");

const INSERT_USER =
  'INSERT INTO public."User"(dob, email, gender, "phoneNo", username) VALUES ($1,$2,$3,$4,$5)';
const INSERT_LOGIN =
  'INSERT INTO public."Login"(username, password) VALUES ($1, $2);';
const INSERT_BLOOD_GROUP =
  'INSERT INTO public."BloodGroups"(username, blood,"lastDate") VALUES ($1,$2,$3);';
const CHECK_USER =
  'SELECT username,password FROM public."Login" WHERE username=$1 and password=$2';
const USER_DETAILS =
  'SELECT email,gender,"phoneNo" from public."User" WHERE username=$1';
const BLOOD_DETAILS =
  'SELECT blood,"lastDate" from public."BloodGroups" where username=$1';
const UPDATE_DETAILS=
  'UPDATE public."User" SET  email=$1, "phoneNo"=$2 WHERE username=$3'

user.use(express.json());

user.route("/signup").post((req, res) => {
  const {
    username,
    dob,
    email,
    gender,
    phoneNo,
    password,
    blood,
    lastDate,
  } = req.body;
  db.query(INSERT_USER, [dob, email, gender, phoneNo, username])
    .then(() => {
      return db.query(INSERT_LOGIN, [username, password]);
    })
    .then(() => {
      return db.query(INSERT_BLOOD_GROUP, [username, blood, lastDate]);
    })
    .then(() => {
      return res
        .status(200)
        .json({ username, dob, blood, lastDate, login: true });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

user.route("/login").post((req, res) => {
  const { username, password } = req.body;
  db.query(CHECK_USER, [username, password])
    .then((data) => {
      if (data.rows.length == 0) {
        throw new Error("Invalid username or password");
      }
      return res.status(200).json({ username, login: true });
    })
    .catch((err) => {
      if (err.message)
        return res.status(401).json({ message: err.message, login: false });
      else return res.status(400).json(err);
    });
});

user.route("/details").post((req, res) => {
  const { username } = req.body;
  let details = {};
  db.query(USER_DETAILS, [username])
  .then((data) => {
    details = { ...data.rows[0] };
    console.log(details)
  })
  .then(() => {
    return db.query(BLOOD_DETAILS, [username]);
  })
  .then((data) => {
    return res.status(200).json({ ...details, ...data.rows[0] });
  })
  .catch((err) => {
    return res.status(200).json(err);
  });
});


user.route('/update').post((req,res)=>{
  const {phoneNo,email,username}=req.body
  db.query(UPDATE_DETAILS,[email,phoneNo,username])
  .then((data)=>{
    return res.status(200).json({updated:true})
  })
  .catch(err=>{
    return res.status(400).json({message:"Something went wrong",updated:false,err})
  })
})

module.exports = user;
