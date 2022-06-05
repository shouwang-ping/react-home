let counterInstance = new Counter();
counterInstance._reactInternals = counterFiber;
// 为了恢复 暂停把每个虚拟Dom变成一个fiber节点
// 每个虚拟Dom节点内部表示为一个fiber
// fiber结构   reconciler/ReactInternalTypes.js 文件
let counterFiber = {
    
    // $$type,
    mode, // 模式
    tag,
    type,
    key,
    ref,
    memoizedState,
    stateNode: counterInstance,
    updateQueue: [],
    child,
    return: "rootFiber",
    alternate: null, // 上一个
    sibling,
    lanes,
    childLanes,
    nextEffect: Fiber,
    firstEffect: Fiber,
    lastEffect: Fiber,
}

// react/src/ReactElement.js
// createElement(type, config, children)  ==> ReactElement
let ReactElement = {
    const element = {
        $$typeof: REACT_ELEMENT_TYPE,
        type: type,
        key: key,
        ref: ref,
        props: props,
        _owner: owner,
        _store,
        _self,
        _source
    };

    return element
}

import {SyncLane} from './../../react-reconciler/src/ReactFiberLane';
import {scheduleUpdateOnFiber} from './../../react-reconciler/src/ReactFiberWorkLoop'
let classComponentUpdater = {
    //把新状态入队，第1参数是组件实例，第2个参数是新状态
    enqueueSetState(inst,payload){
        let fiber = get(inst);
        let eventTime = requestEventTime();
        var lane = requestUpdateLane(fiber);//计算本次更新优先级 1
        //eventTime计算超时时间 lane计算任务优先级
        let update = createUpdate(eventTime,lane);//创建新的更新对象
        update.payload =  payload;//{number:1}
        enqueueUpdate(fiber,update);
        scheduleUpdateOnFiber(fiber);
    }
}
function enqueueUpdate(fiber,update){
    fiber.updateQueue.push(update);//源码里链表
}
function createUpdate(eventTime,lane){
    return {eventTime,lane};
}
function requestUpdateLane(fiber){
    //这个地方应该按当前的事件的优先级来计算分配哪个宽道
  return SyncLane;
}
//任务是有优先级的，优先级高的会打断优先级低的。
// 1低任务加一超时时间 2
function requestEventTime(){
    return performance.now();//程序从启动到现在的时间，是用来计算任务的过期的
}
function get(inst){ 
    return inst._reactInternals;
}
export class Component{
    constructor(){
        this.updater = classComponentUpdater;
    }
    setState(partialState){
        //调用此组件更新器的enqueueSetState入队新状态方法，参数 组件的实例和新状态
        this.updater.enqueueSetState(this,partialState);
    }
}
