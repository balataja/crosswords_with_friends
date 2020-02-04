import { getGridState, updateIfCurrentGridState } from '../../../../../redux/modules/gridState';

const saveGridState = (id, grid) => async (dispatch) => {
    /* Take only the entries from the grid. Other state information like what
         cells are highlighted ought not to be persisted. */
    try {
      console.log('saving gridState module..');
      const response = await updateIfCurrentGridState(id, grid);
      return Promise.resolve(response);
    } catch (e) {
      return false;
    }
  };
  
  const getGridState = id => async (dispatch) => {
      console.log('calling gridState module..');
      var response = await getGridState(id);
      return Promise.resolve(response);
  }
  
  export { saveGridState, getGridState };
  