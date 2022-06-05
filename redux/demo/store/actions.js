import * as types from './action-types'
export default actions = {
    increment() {
       store.dispatch({type: types.INCREMENT})
    },
    decrement() {
       store.dispatch({type: types.DECREMENT})
    }
}