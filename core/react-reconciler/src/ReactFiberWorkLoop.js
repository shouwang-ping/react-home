/**
 * 1.setState原理 ReactBaseClasses中的this.updater.enqueueSetState ==(会调用)=》  scheduleUpdateOnFiber==》 markUpdateLaneFromFiberToRoot 得到fiber树==》 创建任务队列/依次执行任务（发布订阅）==》 render渲染
 * 2.使用useState会引入ReactFiberHooks文件（使用的useState, useEffect的api在这个文件中）会调用scheduleUpdateOnFiber ==》 workLookSync ==> performUnitOfWork ==> beginWork(得到workInProgress)  =》 swaich 类组件函数组件更新 ==> render
 */


import {beginWork} from './ReactFiberBeginWork';

import { ClassComponent, HostRoot } from "./ReactWorkTags";
// import {NoLane, SyncLane} from './ReactFiberLane';
import {ConcurrentMode,NoMode} from './ReactTypeOfMode';

let workInProgress = null;
var SyncLanePriority = 12;
var NoLanePriority = 0;
let syncQueue=[];
let NoContext = 0;
let BatchedContext = 1;
let executionContext =NoContext;//执行环境，默认值是NoContext0，非批量
export function scheduleUpdateOnFiber(fiber){
    let root = markUpdateLaneFromFiberToRoot(fiber);
    //开始创建一个任务，从根节点开始进行更新
    ensureRootIsScheduled(root);
    //如果当前的执行上下文环境是NoContext(非批量)并且mode不是并发的话
    if (executionContext === NoContext && (fiber.mode & ConcurrentMode) === NoMode) {
        flushSyncCallbackQueue();
    }
}
//ReactDOM.unstable_batchedUpdate
export function batchedUpdates(fn){
    let prevExecutionContext = executionContext;
    executionContext |= BatchedContext;
    fn();//handleClick
    executionContext=prevExecutionContext;//已经重置非批量，也就是同步了
    //setTimeout是在这里执行的
}
function ensureRootIsScheduled(root){
    // let nextLanes = SyncLane;//1
    let newCallbackPriority = SyncLanePriority;//按理说应该等于最高级别赛道的优先级 12
    var existingCallbackPriority = root.callbackPriority;//当前根节点上正在执行的更新任务的优先级
    if (existingCallbackPriority === newCallbackPriority) {
        //也是在并发模式，即使在setTimeout里也是批量的原因
        return;//如果这个新的更新和当前根节点的已经调度的更新相等，那就直接返回，复用上次的更新，不再创建新的更新任务
    }
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
    queueMicrotask(flushSyncCallbackQueue);
    root.callbackPriority=newCallbackPriority;
}
function flushSyncCallbackQueue(){
    syncQueue.forEach(cb=>cb());
    syncQueue.length=0;
}
//其实就把performSyncWorkOnRoot函数添加一个队列里，等待执行
function scheduleSyncCallback(callback){
    syncQueue.push(callback)
}
//这个其实就是我们真正的渲染任务了，比较老的节点和新的节点，得到domdiff结果 更新DOM。都是这个方法里
function performSyncWorkOnRoot(workInProgress){
    let root = workInProgress;
    console.log('开始执行调合任务');
    while(workInProgress){
         if(workInProgress.tag === ClassComponent){
            let inst = workInProgress.stateNode;//获取此fiber对应的类组件的实例
            inst.state = processUpdateQueue(inst,workInProgress);
            inst.render();//得到新状态后，就可以调用render方法得到新的虚拟dom，进行dom diff 更新DOM
         }   
         workInProgress= workInProgress.child;
    }
    commitRoot(root);
}
function commitRoot(root){
    root.callbackPriority=NoLanePriority;
}
//根据老状态和我们更新队列计算新状态
function processUpdateQueue(inst,fiber){
    return fiber.updateQueue.reduce((state,{payload})=>{
        if(typeof payload === 'function'){
            payload = payload(state);
        }
        return {...state,...payload};
    },inst.state);
}

/**
setState 实现方法 
 */
function markUpdateLaneFromFiberToRoot(fiber){
  let parent = fiber.return;
  while(parent){
    fiber = parent;
    parent = parent.return;
  }
  if(fiber.tag === HostRoot){
    return fiber;
  }
  return null;
}

//每一个fiber都是一个工作单元
function performUnitOfWork(unitOfWork){
    let current = unitOfWork.alternate;//更新的时候就有current
    return beginWork(current,unitOfWork);
}
function workLoop(){
    //每个fiber是一个工作单元，每完成一个fiber,会看看有没有剩余时间，如果有接着干下一个，如果没有就
    //退出循环
    while (workInProgress) {
        workInProgress = performUnitOfWork(workInProgress);
    }
}
/**
 * 我们是讲hooks.所以简化一些逻辑
 * 在源码里此处要从当前fiber,向找到根节点再进行更新
 * 老的counterFiber向上找到根节点fiberRoot->然后再一级一级向下执行render再次渲染CounterFiber
 * @param {} fiber 
 */
export function scheduleUpdateOnFiber(oldFiber){//current Fiber
    let newFiber = {
        ...oldFiber,
        alternate:oldFiber
    }//新的CounterFiber开始执行更新
    workInProgress = newFiber;
    workLoop();
}
//正常来说我们需要根节点一下向下构建，Counter

// export function scheduleUpdateOnFiber(fiber){ //setState原理
//   let root = markUpdateLaneFromFiberToRoot(fiber);
//   //开始创建一个任务，从根节点开始进行更新
//   ensureRootIsScheduled(root);
//   //如果当前的执行上下文环境是NoContext(非批量)并且mode不是并发的话
//   if (executionContext === NoContext && (fiber.mode & ConcurrentMode) === NoMode) {
//       flushSyncCallbackQueue();
//   }
// }

export function render(fiber){
    workInProgress = fiber;
    workLoop();
}