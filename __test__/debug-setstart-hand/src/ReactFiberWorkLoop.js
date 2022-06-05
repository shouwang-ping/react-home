import { ClassComponent, HostRoot } from "./ReactWorkTags";
// import {NoLane, SyncLane} from './ReactFiberLane';
import {ConcurrentMode,NoMode} from './ReactTypeOfMode';
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