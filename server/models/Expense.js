const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/expenses', { useNewUrlParser: true })

const Schema = mongoose.Schema

const expenseSchema = new Schema({
    name: String,
    amount: Number,
    date: Date,
    group: String
})

const Expense = mongoose.model("expenses", expenseSchema)
module.exports = Expense