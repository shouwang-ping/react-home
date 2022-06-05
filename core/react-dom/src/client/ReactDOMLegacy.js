import {
    findHostInstanceWithNoPortals,
    updateContainer,
    unbatchedUpdates,
    getPublicRootInstance,
    findHostInstance,
    findHostInstanceWithWarning,
  } from './react-reconciler/src/ReactFiberReconciler';
// line 175
/**
 * 可以做初次渲染和更新 diff 协调
 */
function legacyRenderSubtreeIntoContainer(
    parentComponent,
    children,
    container,
    forceHydrate,
    callback,
  ) {

    let root = (container._reactRootContainer);
    let fiberRoot;
    if (!root) {
      // Initial mount
      root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
        container,
        forceHydrate,
      );
      fiberRoot = root._internalRoot;
      if (typeof callback === 'function') {
        const originalCallback = callback;
        callback = function() {
          const instance = getPublicRootInstance(fiberRoot);
          originalCallback.call(instance);
        };
      }
      // Initial mount should not be batched.  初次渲染非批量更新 保证更新效率与用户体验  对应 ：this.setState(异步) 是批量更新
      unbatchedUpdates(() => {
        updateContainer(children, fiberRoot, parentComponent, callback);
      });
    } else {
      fiberRoot = root._internalRoot;
      if (typeof callback === 'function') {
        const originalCallback = callback;
        callback = function() {
          const instance = getPublicRootInstance(fiberRoot);
          originalCallback.call(instance);
        };
      }
      // Update  做协调虚拟Dom节点  找出最小的需要更新的真实dom的量 
      updateContainer(children, fiberRoot, parentComponent, callback);
    }
    return getPublicRootInstance(fiberRoot);
  }

// line 287
/**
 * legacy: 遗产  之后可能会更新（移除）这个方法
 */
export function render(
    element,
    container,
    callback
  ) {
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback,
    );
  }