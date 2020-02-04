const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    userId: Schema.Types.ObjectId,
    playerNumber: Number,
}, { _id: false })

const GameSchema = new Schema({
    name: String,
    gridStateId: Schema.Types.ObjectId,
    crosswordId: Schema.Types.ObjectId,
    createdDate: Date,
    isActive: Boolean,
    players: [PlayerSchema]
})

module.exports = mongoose.model('Game', GameSchema);