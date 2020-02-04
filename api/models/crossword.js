const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//= ===============================
// Crossword Schema
//= ===============================
const CrosswordSchema = new Schema({
    id: String,
    name: String,
    date: Date,
    entries: [
        {
            //_id: mongoose.Schema.Types.ObjectId,
            id: String,
            number: Number,
            humanNumber: String,
            clue: String,
            direction: String,
            length: Number,
            group: [
                String
            ],
            position: {
                x: Number,
                y: Number
            },
            separatorLocations: {
                type: Schema.Types.Mixed, default: {}
            },
            solution: String//,
            //answeredBy: Number
        }
    ],
    //solutionAvailable: Boolean,
    dimensions: {
        cols: Number,
        rows: Number
    }
}, { minimize: false });

module.exports = mongoose.model('Crossword', CrosswordSchema);
