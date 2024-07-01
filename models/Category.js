const { Schema, model } = require('mongoose')
const User = require('./User')
const Post = require('./Post')

const categorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        maxlength: 50,
        required: true,
        unique: true
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
}, {
    timestamps: true
})

const Category = model('Category', categorySchema)
module.exports = Category
