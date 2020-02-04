import _ from 'lodash';
import { APP_NAMESPACE } from '../../util/redux-constants';
import { put, post, get, del } from '../../util/http-utils';
import { handleError } from '../../util/store-utils';

const GRIDSTATE_ENDPOINT_BASE = 'gridState';
const typeBase = `${APP_NAMESPACE}/${GRIDSTATE_ENDPOINT_BASE}/`;

// Constants
export const GET_GRIDSTATE = `${typeBase}GET_GRIDSTATE`;
export const UPDATE_IF_CURRENT_GRIDSTATE = `${typeBase}UPDATE_IF_CURRENT_GRIDSTATE`;
export const INITIALIZE_GRIDSTATE = `${typeBase}INITIALIZE_GRIDSTATE`;

// Actions

export const getGridState = (id) => async (dispatch) => {
    try {
        console.log('getting grid state from module..')
        if (id == undefined)
        {
            console.log('gridState id cannot be undefined..');
        } else {
            const response = await get(dispatch, GET_GRIDSTATE, `${GRIDSTATE_ENDPOINT_BASE}/get-gridstate/${id}`, true);
            return Promise.resolve(response);
        }
    } catch (err) {
        await handleError(dispatch, err, GET_GRIDSTATE);
    }
}

export const updateIfCurrentGridState = (gridObj) => async (dispatch) => {
    console.log('updating grid state from module..');
    try {
        const response = await post(dispatch, UPDATE_IF_CURRENT_GRIDSTATE, `${GRIDSTATE_ENDPOINT_BASE}/update-if-current-gridstate/${gridObj.id}`, gridObj.grid, true);
        return Promise.resolve(response);
    } catch (err) {
        await handleError(dispatch, err, UPDATE_IF_CURRENT_GRIDSTATE);
    }
}

export const initializeGridState = (grid) => async (dispatch) => {
    try {
        console.log('initializing grid state..')
        const response = await post(dispatch, INITIALIZE_GRIDSTATE, `${GRIDSTATE_ENDPOINT_BASE}/initialize-gridstate`, grid, true);
        console.log('from initialize module: ' + response);
        //return Promise.resolve(response);
        return response;
    } catch (err) {
        await handleError(dispatch, err, INITIALIZE_GRIDSTATE);
    }
}