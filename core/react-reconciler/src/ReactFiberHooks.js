import {scheduleUpdateOnFiber} from './ReactFiberWorkLoop';
let ReactCurrentDispatcher = { current: null }
let workInProgressHook = null;//当前的新hook
let currentHook = null;//当前的老hook
let currentlyRenderingFiber;//当前正在使用的fiber
const HookDispatcherOnMount = {//初次挂载时的方法
    useReducer: mountReducer,
    useState:mountState
}
const HookDispatcherOnUpdate = {//更新时的方法
    useReducer: updateReducer,
    useState:updateState
}
function basicStateReducer(state,action){
    return typeof action === 'function'?action(state):action;
}
function updateState(initialState){
    return updateReducer(basicStateReducer,initialState);
}
function mountState(initialState){
    let hook = mountWorkInProgressHook();//获取当前的hook
    hook.memoizedState = initialState;//0
    const queue = (hook.queue = {pending:null,
        lastRenderedReducer:basicStateReducer,
        lastRenderedState:initialState
    });
    const dispatch = dispatchAction.bind(null,currentlyRenderingFiber,queue);
    return [hook.memoizedState,dispatch];
}
function updateReducer(reducer, initialArg){
    let hook = updateWorkInProgressHook();//更新时候也要构建一个新的hook链表
    const queue = hook.queue;//更新队列
    let lastRenderedReducer=queue.lastRenderedReducer;//上一个reducer方法
    let current = currentHook;
    const pendingQueue  = queue.pending;//update的环状链表
    if(pendingQueue!==null){
        //根据老的状态和更新队列里的更新对象计算新的状态
        let first = pendingQueue.next;//第一个更新对象
        let newState = current.memoizedState;//得到老状态
        let update = first;
        do{
            const action = update.action;//action对象{type:'ADD'}
            newState = reducer(newState,action);//要使用update计算新状态
            update = update.next;
        }while(update !== null && update !== first);   
        queue.pending = null;//更新过了可以清空更新环形链表
        hook.memoizedState =  newState;//让新的hook对象的memoizedState等于计算的新状态    
        queue.lastRenderedState = newState;//把新状态也赋值给lastRenderedState一份
    }
    const dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue);
    return [hook.memoizedState, dispatch];
}
function updateWorkInProgressHook(){
    //取到当前新的hook对应的老hook
    let nextCurrentHook;//current老的 workInProgress 新的
    if(currentHook === null){//说明这个是第一个hook
        //从当前的新的Counter的Fiber的alternate属性上可以获取老的fiber
        let current = currentlyRenderingFiber.alternate;//老的CounterFiber
        nextCurrentHook = current.memoizedState;//老的fiber的memoizedState指向老的hook链表的第一个节点
    }else{
        nextCurrentHook=currentHook.next;
    }
    currentHook=nextCurrentHook;
    //创建新的hook对象
    const newHook = {
        memoizedState:currentHook.memoizedState,//使用老状态没有都状态，如何计算新状态
        queue:currentHook.queue,//后续所有的更新都会使用老的queue
        next:null
    }
    if(workInProgressHook === null){//说明这是第一个hook
        currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
    }else{
        workInProgressHook.next = newHook;
        workInProgressHook =  newHook;
    }
    return workInProgressHook;
}
export function useReducer(reducer, initialArg) {
    return ReactCurrentDispatcher.current.useReducer(reducer, initialArg);
}
export function useState(initialState) {
    return ReactCurrentDispatcher.current.useState(initialState);
}
//不同的阶段userReducer有不同的实现
export function renderWithHooks(current, workInProgress, Component) {
    //每当在新渲染一个函数组件fiber的时候
    currentlyRenderingFiber = workInProgress;
    currentlyRenderingFiber.memoizedState=null;//在执行组件方法之前，要清空hook链表 因为你肯定要创建新的hook链表
    if(current!== null){//说明是更新流程
        ReactCurrentDispatcher.current = HookDispatcherOnUpdate;
    }else{
        ReactCurrentDispatcher.current = HookDispatcherOnMount;
    }
    let children = Component();//Counter组件的渲染方法
    currentlyRenderingFiber = null;//渲染结束 后把currentlyRenderingFiber清空
    workInProgressHook = null;
    currentHook = null;
    return children;
}

function mountReducer(reducer, initialArg) {
    //构建hooks单向链表
    let hook = mountWorkInProgressHook();
    hook.memoizedState = initialArg;
    //hook.queue属性指一个queue对象
    const queue = (hook.queue = { pending: null });//更新队列
    //每次绑定都会返一个新的函数 fiber 和queue 每个hook的队列都不一样
    const dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue);
    return [hook.memoizedState, dispatch];
}
function dispatchAction(currentlyRenderingFiber, queue, action) {
    debugger
    const update = { action, next: null };//创建一个update对象
    const pending = queue.pending;
    if (pending === null) {
        update.next = update;//让自己和自己构建成一个循环链表 环状链表
    } else {
        update.next = pending.next;
        pending.next = update;
    }
    queue.pending = update;
    const lastRenderedReducer = queue.lastRenderedReducer;//获取上一个的reducer
    const lastRenderedState = queue.lastRenderedState;//获取上一个state
    //不需要等到再次重新调试到Counter组件计算
    let eagerState = lastRenderedReducer(lastRenderedState,action);
    update.eagerReducer = lastRenderedReducer;
    update.eagerState = eagerState;
    if(Object.is(eagerState,lastRenderedState)){
        return;
    }
    scheduleUpdateOnFiber(currentlyRenderingFiber);
}
function mountWorkInProgressHook() {
    let hook = { //创建一个hook对象
        memoizedState: null,//自己的状态 每种hook的状态都不一样 useMemo.memoizedState=[state,deps]
        queue: null,//自己的更新队列 环形链表 调用更新方法就会把那些参数存到这个环形链表中
        next: null //下一个更新
    }
    //说明这是我们的第一个hook
    if (workInProgressHook === null) {
        //fiber的memoizedState指向第一个hook对象
        currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
    } else {
        workInProgressHook = workInProgressHook.next = hook;
    }
    return workInProgressHook;
}
