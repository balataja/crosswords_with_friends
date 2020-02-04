import _ from 'lodash';
import { APP_NAMESPACE } from '../../util/redux-constants';
import { put, post, get, del } from '../../util/http-utils';
import { handleError } from '../../util/store-utils';

const GRIDSTATE_ENDPOINT_BASE = 'game';
const typeBase = `${APP_NAMESPACE}/${GRIDSTATE_ENDPOINT_BASE}/`;

// Constants
export const GET_GAME = `${typeBase}GET_GAME`;
export const GET_GAMES = `${typeBase}GET_GAMES`;
export const ADD_GAME = `${typeBase}ADD_GAME`;
export const JOIN_GAME = `${typeBase}JOIN_GAME`;

// Actions
export const getGame = (gameId) => async (dispatch) => {
    try {
        // if (gameId == undefined)
        // {
        //     console.log('gridState id cannot be undefined..');
        // } else {
            const response = await get(dispatch, GET_GAME, `${GRIDSTATE_ENDPOINT_BASE}/get-game/${gameId}`, true);
            return Promise.resolve(response);
        //}
    } catch (err) {
        await handleError(dispatch, err, GET_GAME);
    }
}

export const getGames = (userId) => async (dispatch) => {
    try {
        const response = await get(dispatch, GET_GAMES, `${GRIDSTATE_ENDPOINT_BASE}/get-games/${userId}`, true);
        return Promise.resolve(response);
    } catch (err) {
        await handleError(dispatch, err, GET_GAMES);
    }
}

export const addGame = (game) => async (dispatch) => {
    try {
        const response = await post(dispatch, ADD_GAME, `${GRIDSTATE_ENDPOINT_BASE}/add-game`, game, true);
        return Promise.resolve(response);
    } catch (err) {
        await handleError(dispatch, err, ADD_GAME);
    }
}

export const joinGame = (player) => async (dispatch) => {
    try {
        const response = await post(dispatch, JOIN_GAME, `${GRIDSTATE_ENDPOINT_BASE}/join-game`, player, true);
        return Promise.resolve(response);
    } catch (err) {
        await handleError(dispatch, err, JOIN_GAME);
    }
}