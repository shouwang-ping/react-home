

import {beginWork} from './ReactFiberBeginWork';
let workInProgress = null;
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

export function render(fiber){
    workInProgress = fiber;
    workLoop();
}