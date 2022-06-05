
import {SyncLane} from './ReactFiberLane';
import {scheduleUpdateOnFiber} from './ReactFiberWorkLoop'
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
    //这个地方应该按当前的事件的优先级来计算分配哪个赛道
    // 四种事件 
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