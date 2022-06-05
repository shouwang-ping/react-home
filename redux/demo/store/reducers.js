import * as types from './action-types'
let initState = 0
export default function reducer(state = initState, action) {
    switch (action.type) {
        case types.INCREMENT:
            return state + 1
        case types.DECREMENT:
            return state - 1
        default:
            return state;
    }
}