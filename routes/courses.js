const express = require("express")
const router = express.Router()
// const mongoose = require('mongoose');
const Course = require('../models/courseModel')

// get all couses
router.get('/', async (req,res)=>{
    Course.find().skip(parseInt(req.query.offset)).limit(parseInt(req.query.limit)).exec().then( async rs => {
        if(rs.length > 0) {
            const count = await Course.countDocuments();
            return res.send({data:rs,count:count}).status(200);    
        }
        res.send({message:"No data available"}).status(404);           
    })
    .catch(err=>{
        res.send({message:"No data available"}).status(404);    
    })
});

//get one course with /:id
router.get('/:id',(req,res)=>{
    Course.findById(req.params.id)
        .exec()
        .then(doc=>{
            if(doc){
                return res.status(200).send(doc);
            }
            return res.status(404).send({message:'Course not found'})
        })
        .catch(err=> {
            return res.status(404).send({message:'Course not found'})
        })      
});

//add a new course
router.post('/',(req,res)=> {
    req.checkBody("name", "Name Cannot be Blank").notEmpty();
    var errors = req.validationErrors();
    if (errors){
        return res.status(400).send({success: false, error: errors});
    }
    const course = new Course({
        // _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        hours:req.body.hours,
        handledBy:req.body.handledBy,
        category:req.body.category,
        rating:req.body.rating
    })
    course.save().then(rs=>{
        res.status(200).send(rs);
    })
    .catch(er=>{
        res.status(400).send(er);
    })
});

//update a course with /:id
router.put('/:id',(req,res)=>{
    const updateOps= {};
    for ( const key in req.body ) {
        updateOps[key] = req.body[key]
    }
    Course.update({_id:req.params.id},{
        $set:updateOps
    }).exec().then(rs=>{
        res.send(rs).status(200)
    }).catch(er=>{
        res.send({message:'Course not Found'},er).status(400)
    })
});

//delete a course /:id
router.delete('/:id', (req,res) => {
    Course.remove({_id:req.params.id}).exec().then(rs=>{
        res.send(rs).status(200)
    })
    .catch(er=>{
        res.send(er).status(400)
    })
});

//search course
router.get('/search/:key',(req,res)=>{
    Course.find({"name": {$regex: new RegExp(req.params.key)}}).skip(parseInt(req.query.offset)).limit(parseInt(req.query.limit)).exec()
        .then(async doc=>{
            if(doc.length){
                const count = await Course.countDocuments();                
                return res.status(200).send({data:doc,count:count});
            }
            return res.status(404).send({message:'Course not found'})
        })
        .catch(err=> {
            return res.status(404).send({message:'Course not found'})
        })      
});

module.exports = router;
