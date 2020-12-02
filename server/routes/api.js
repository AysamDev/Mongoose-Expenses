const express = require('express')
const moment = require('moment')
const router = express.Router()


router.use(express.json())
router.use(express.urlencoded({ extended: false }))
const data = require('../../expenses.json')
const Expense = require('../models/Expense')
// for(let exp of data)
// {
//     let a = new Expense({
//         name: exp.item,
//         amount: exp.amount,
//         date: exp.date,
//         group: exp.group
//     })
//     a.save()
// }

router.get('/expenses/:date1?/:date2?', function (req, res) {
    let date1 =  req.params.date1 || false
    let date2 = req.params.date2 || false
    if(date1 && date2)
    {
        console.log("hey")
         Expense.find({ 
            $and:[{date:{$gte: date1}},{date:{$lte: date2}}]
         }
            ,function(err,allData)
        {
            res.send(allData)
        })
           
    }
    else if(date1)
    {
        Expense.find({
            $and:[{date:{$gte: date1}},{date:{$lte: moment().format("LLLL")}}]
        }
        ,function(err,allData)
        {
            res.send(allData)
        }) 
    }
    else
    {
        const a = Expense.find({}).sort({date: 1})
        a.then(function(allData)
        {
            res.send(allData)
        })
    }
  
})

router.get('/expenses/:group/:total?', function (req, res) {
    const myGroup = req.params.group
    const b = req.params.total 
    if(b)
    {
            Expense.aggregate([{$match: {group: myGroup}},
                {
                $group: {
                    _id: "total",
                    total: { $sum: "$amount" }
                }
                  }],
            function(err,total)
            {
                res.send(total)
            })
    }
    else
    {
        const a = Expense.find({group: myGroup})
        a.then(function(allData)
        {
            res.send(allData)
        })
    }

})

router.put('/expenses/:group1/:group2', function (req, res) {
    Expense.findOneAndUpdate({group: req.params.group1}, 
     {
        group: req.params.group2
    }).exec(function(err,result)
    {
        res.send(`the item ${result.name} group was changed to group ${req.params.group2}`)
    })
})

router.post('/expenses',function(req,res)
{
    console.log(req.body.date)
    const e = new Expense(
        {
            name: req.body.name,
            amount: req.body.amount,
            date: req.body.date ? moment(req.body.date,"LLLL").format() : moment(new Date(),"LLLL").format(),
            group: req.body.group
        }

    )
    console.log(`${e.amount} was spent on ${e.name}`)
    e.save()
    res.send("The item was saved successfully to the database")
})


module.exports = router