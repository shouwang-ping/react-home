function bindActionCreator(actionCreator, dispatch) {
    return function() {
        return  dispatch(actionCreator.apply(this, arguments)) // 需要用arguments把原来有的参数传过去
    }
}

export default function bindActionCreators(actionCreators, dispatch) {
    if(typeof actionCreators =='function') { // actionCreators 外面可以直接传入一个函数的时候 actions.increment
        return bindActionCreator(actionCreators, dispatch)
    }
    const bindActionCreators = {}
    for(const key in actionCreators) {
        // 重写对象的属性
        bindActionCreators[key] = bindActionCreator(actionCreators[key], dispatch)
    }
    return bindActionCreators 
}