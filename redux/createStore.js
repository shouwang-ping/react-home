import isPlainObject from "./utils/isPlainObject";
export default function (reducer, preloadState) {
    if(typeof reducer != 'function') {
        throw new Error('reducer必须是一个函数')
    }
    let currentReducer = reducer // 当前的处理器
    let currentState = preloadState // 当前状态
    let currentListeners = [] // 定义一个数组保存当前的监听函数
    function getState() { // 闭包。返回当前状态
        return currentState
    }
    function dispatch(action) {
        if(!isPlainObject(action)) {
            throw new Error('action必须是一个纯对象111')
        }
        if(action.type == 'undefind') {
            throw new Error('action必须是一个纯对象2222')
        }
        currentState = currentReducer(currentState, action) // 传给reducer 得到新状态
        for(let i=0;i<currentListeners;i++) {
            const listener = currentListeners[i]
            listener()
        }
        return action
    }
    function subscribe(listener) {
        currentListeners.push(listener)
        return function unsubscribe() { // 取消订阅
            const index = currentListeners.indexOf(listener)
            currentListeners.splice(index, 1)
        }
    }
    dispatch({type: '@@INIT'}) // 默认执行一次 防止没有传preloadState
    return {
        getState,
        subscribe,
        dispatch
    }
}