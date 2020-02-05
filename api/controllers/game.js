const Game = require('../models/game');
var ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user');

exports.getGame = async (ctx, next) => {
    try {
        //console.log('trying to get game..' + ctx.params.id);
        const game = await Game.findById(ctx.params.id);
        //console.log(game);
        ctx.status = 200; 
        ctx.body = Object.assign(game);
        await next();
    } catch (err) {
        ctx.throw(500, err);
    }
}

exports.getGames = async (ctx, next) => {
    try {
        //console.log('trying to get games..');
        //console.log(ctx.params.id);
        const games = await Game.find({isActive: true});//{userId: new ObjectId(ctx.params.id)});
        ctx.status = 200;
        ctx.body = Object.assign(games);
        await next();
    } catch (err) {
        ctx.throw(500, err);
    }
}

exports.addGame = async (ctx, next) => {
    //console.log(ctx.request.body);
    const date = new Date();
    const game = new Game({
        name: ctx.request.body.name,
        gridStateId: ctx.request.body.gridStateId,
        crosswordId: ctx.request.body.crosswordId,
        createdDate: date,
        isActive: true,
        players: [{
            userId: ctx.request.body.userId,
            playerNumber: 1,
        }]
    });

    try {
        var res = await game.save();
        const userGame = {
            gameId: res._id,
            createdDate: date,
            isActive: true,
            name: ctx.request.body.name
        }
        await User.findByIdAndUpdate(ctx.request.body.userId, {$push: {games: userGame}}, {safe: true, upsert: true})
        ctx.status = 200;
        ctx.body = Object.assign(res);
        await next();
    } catch (err) {
        ctx.throw(500, err);
    }
}

exports.joinGame = async (ctx, next) => {
    try {
        //console.log('joining game from controller..')
        //console.log(ctx.request.body.gameId);
        const game = await Game.findById(ctx.request.body.gameId);

        game.players.forEach(async function(player, index, array) {
            if (player.userId === ctx.request.body.userId) {
                console.log('player has already joined this game');
                ctx.status = 200;
                await next();
            }
        });

        const player = {
            userId: ctx.request.body.userId,
            playerNumber: game.players.length + 1,
        };
        await Game.findOneAndUpdate(ctx.request.body.gameId,
            {
                $push: {players: player} 
            }
        );

        const date = new Date();
        const userGame = {
            gameId: ctx.request.body.gameId,
            name: game.name,
            createdDate: date,
            isActive: true
        }
        const res = await User.findByIdAndUpdate(ctx.request.body.userId, {$push: {games: userGame}}, {safe: true, upsert: true})

        ctx.body = res;
        ctx.status = 200;
        await next();
    } catch (err) {
        ctx.throw(500, err);
    }
}

// exports.deleteGame = async (ctx, next) => {
//     try {
//         console.log('trying to delete game..' + ctx.params.id);
//         const gridState = await GridState.findById(ctx.params.id);
//         ctx.status = 200;
//         ctx.body = Object.assign(gridState);
//         await next();
//     } catch (err) {
//         ctx.throw(500, err);
//     }
// }