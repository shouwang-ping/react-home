import { Component } from "react";
import { createStore, bindActionCreators } from "./redux";

let initState = 0
const ADD = 'ADD'
const JIAN = 'JIAN'
function reducer(state = initState, action) {
    switch (action.type) {
        case ADD:
            return state + 1
        case JIAN:
            return state - 1
        default:
            return state;
    }
}

let store = createStore(reducer)

// ============ 页面触发  原始redux用法
state = {
    num: store.getState()
} 
componentDidMount() { // 需要订阅仓库中的状态变化
    this.unsubscribe = store.subscribe( 
        this.setState({num: store.getState()}) 
    ) 
}
componentWillUnMount() {
    // 不取消订阅有问题
    this.unsubscribe()
}
<p>{this.state.num}</p>
// ADD容易写错
<button onClick={() => store.dispatch({type: 'ADD'})}>点击</button>

// 原始html中用法
function renderDom() {
  Dom.innerHTML = store.getState()   
}
store.subscribe(render) // 或者订阅 // 主要是更新render  渲染出新的state



// =============================改进1，需要写dispatch

let actions = {
     increment() {
        store.dispatch({type: ADD})
     },
     decrement() {
        store.dispatch({type: JIAN})
     }
}
// increment 假如 方法名写错了 会报错
<button onClick={() => actions.increment}>点击</button>


// =============================改进2，不需要写dispatch

let actions = {
    increment(value) {
        return {
           type: ADD,
           payload: value
        }
    },
    decrement() {
        return {
            type: JIAN
        }
    }
}
// 绑定动作创建者
let bindActions = bindActionCreators(actions, store.dispatch)

<button onClick={() => bindActions.increment}>点击</button>

