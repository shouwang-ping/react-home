/**
 * 会调用 renderWithHooks hooks原理 计算新状态
 */
import {FunctionComponent, HostComponent, IndeterminateComponent} from './ReactWorkTags';
import {renderWithHooks} from './ReactFiberHooks';
/**
 * 到底更还是初次渲染
 * @param {*} current 上一个fiber 初次挂载 的时候null
 * @param {*} workInProgress 这一次正在构建中的fiber
 */
export function beginWork(current,workInProgress){
  if(current){//说明是更新新
    switch(workInProgress.tag){
      case FunctionComponent://函数组件
          return updateFunctionComponent(
              current,
              workInProgress,
              workInProgress.type //Counter组件
          )
       default:
           break;   
    }
  }else{
    switch(workInProgress.tag){
      case IndeterminateComponent://函数组件
          return mountIndeterminateComponent(
              current,
              workInProgress,
              workInProgress.type //Counter组件
          )
       default:
           break;   
    }
  }
}
function updateFunctionComponent(current,workInProgress,Component){
  //value就是Counter组件函数的返回值
  let newChildren = renderWithHooks(
    current,
    workInProgress,
    Component
  );
  console.log('Component children',newChildren);
  window.counter = newChildren;
  //根据儿子的或者说上面返回的虚拟DOm，构建Fiber子树
  reconcileChildren(current,workInProgress,newChildren);
  return workInProgress.child;
}
function mountIndeterminateComponent(current,workInProgress,Component){
    //value就是Counter组件函数的返回值
    let children = renderWithHooks(
        current,
        workInProgress,
        Component
     );
    console.log('children',children);
    window.counter = children;
    workInProgress.tag = FunctionComponent;
    //根据儿子的或者说上面返回的虚拟DOm，构建Fiber子树
    reconcileChildren(current,workInProgress,children);
    return workInProgress.child;
}
/**
 * 就是根据组件返回的虚拟DOM构建建子Fiber链条的过程
 * Counter这个Fiber也是在reconcileChildren里创建的
 * @param {*} current 
 * @param {*} workInProgress 
 * @param {*} children 
 */
function reconcileChildren(current,returnFiber,nextChildren){
  let childFiber = {
    tag: HostComponent,
    type: nextChildren.type
  };
  returnFiber.child = childFiber;
}