const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const Schema = mongoose.Schema;

const GridTile = new Schema({
    isHighlighted: Boolean,
    isEditable: Boolean,
    isError: Boolean,
    isAnimating: Boolean,
    isCorrect: Boolean,
    value: String,
    isCorrect: Boolean,
    answeredBy: Number,
    number: Number,
}, { _id: false });

const GridStateSchema = new Schema({
    entries: [
        [
            GridTile
        ]
    ],
})

GridStateSchema.plugin(updateIfCurrentPlugin, { strategy: 'version' });

module.exports = mongoose.model('GridState', GridStateSchema);