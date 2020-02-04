import _ from 'lodash';
import { APP_NAMESPACE } from '../../util/redux-constants';
import { put, post, get, del } from '../../util/http-utils';

const CROSSWORD_ENDPOINT_BASE = 'crossword';
const typeBase = `${APP_NAMESPACE}/${CROSSWORD_ENDPOINT_BASE}/`;

// Constants
export const GET_CROSSWORD = `${typeBase}GET_CROSSWORD`;
export const GET_CROSSWORDS = `${typeBase}GET_CROSSWORDS`;

// Actions

/**
 * getCrossword  - Fetches crossword from API, given id
 *
 * @param {String} id User's id for lookup
 * @returns {Promise}
 */
export const getCrossword = (id) => async (dispatch) => {
  try {
    const response = await get(dispatch, GET_CROSSWORD, `${CROSSWORD_ENDPOINT_BASE}/get-crossword/${id}`, true);
    return Promise.resolve(response);
  } catch (err) {
    await handleError(dispatch, err, GET_CROSSWORD);
  }
};

/**
 * getCrosswords  - Fetches crosswords from API
 *
 * @returns {Promise}
 */
export const getCrosswords = () => async (dispatch) => {
  try {
    const response = await get(dispatch, GET_CROSSWORDS, `${CROSSWORD_ENDPOINT_BASE}/get-crosswords`, true);
    return Promise.resolve(response);
  } catch (err) {
    await handleError(dispatch, err, GET_CROSSWORDS);
  }
};