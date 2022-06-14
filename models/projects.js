const { model, Schema } = require('mongoose');

const Projects = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = model("Projects", Projects);