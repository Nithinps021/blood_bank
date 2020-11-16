const express=require('express')
const db=require('../database/database')


const SELECT_REQUEST='SELECT request_id, blood_group, units, "userId", solved, date_of_request FROM public."BloodRequest" WHERE blood_group= $1 AND  solved=false '

const donor=express.Router()
donor.use(express.json())

donor.route('/required').post((req,res)=>{
    const {blood_group}=req.body
    db.query(SELECT_REQUEST,[blood_group])
    .then(data=>{
        return res.status(200).json(data.rows)
    })
    .catch(err=>{
        return res.status(400).json({message:"Something went wrong"})
    })
})



