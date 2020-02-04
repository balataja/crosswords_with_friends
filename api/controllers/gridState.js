const GridState = require('../models/gridState');

exports.getGridState = async (ctx, next) => {
    try {
        console.log('trying to get gridState..' + ctx.params.id)
        const gridState = await GridState.findOne({_id: ctx.params.id})
        ctx.status = 200;
        ctx.body = Object.assign(gridState);
        await next();
    } catch (err) {
        ctx.throw(500, err);
    }
}

exports.updateIfCurrentGridState = async (ctx, next) => {
    try {
        console.log('trying to update gridState.. '+ ctx.params.id);
        const gridStates = await GridState.findOne({_id: ctx.params.id});
        const gridState = gridStates[0];
        gridState.entries = [];
        ctx.request.body.forEach(function(row, index, array) {
            var newRow = [];
            row.forEach(function(square, index, array) {
                newRow.push(square);
            })
            gridState.entries.push(newRow);
        })

        await gridState.save();
        ctx.status = 200;
        await next();
    } catch (err) {
        // if (err instanceof VersionError) {
        //     ctx.body = gridState;
        //     ctx.status = 200;
        //     await next();
        // } else {
            ctx.throw(500, err);
        // }
    }
}

exports.initializeGridState = async (ctx, next) => {
    try {
        const gridState = new GridState({
            entries: ctx.request.body
        });

        var res = await gridState.save();
        ctx.body = Object.assign(res);
        ctx.status = 200;
        await next();
    } catch (err) {
        ctx.throw(500, err);
    }
}