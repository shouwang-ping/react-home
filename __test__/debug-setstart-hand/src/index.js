import {NoMode} from './ReactTypeOfMode'
import {ClassComponent,HostRoot} from './ReactWorkTags';
import {Component} from './ReactBaseClasses';
import {batchedUpdates} from './ReactFiberWorkLoop';
class Counter extends Component{
    state = {number:0}
    handleClick = (event)=>{
        this.setState({number:this.state.number+1});
        console.log('setState1',this.state);
        this.setState({number:this.state.number+1});
        console.log('setState2',this.state);
        setTimeout(()=>{
            //batchedUpdates(()=>{
                this.setState({number:this.state.number+1});
                console.log('setTimeout setState1',this.state);
                this.setState({number:this.state.number+1});
                console.log('setTimeout setState2',this.state);
            //});
          
        });
    }
    render(){
        console.log('render',this.state);
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={this.handleClick}>+</button>
            </div>
        )
    }
}

//ReactDOM.render(<Counter/>,document.getElementById('root'));
let counterInstance = new Counter();
//1.先把模式调成异步模式，或者 说并发模式
//2.把模式调用回步
let mode = NoMode;
//根Fiber的mode会影响下面所有的子Fiber
//每个Fiber会有一个updateQueue代表更新队列，源码里是个链表
let rootFiber = {tag:HostRoot,updateQueue:[],mode};
let counterFiber = {tag:ClassComponent,updateQueue:[],mode};
//fiber的stateNode指向类的实例
counterFiber.stateNode = counterInstance;
//_reactInternal指定这个组件实例对应的Fiber
counterInstance._reactInternals = counterFiber;
//rootFiber第一个儿子，或者说大儿子是counterFiber
rootFiber.child = counterFiber;
counterFiber.return = rootFiber;

//合成事件 React17以后其实事件是委托给容器了
document.addEventListener('click',(event)=>{
    let syntheticEvent = {nativeEvent:event};//根据原生事件创建合成事件
    //源码里先通过事件，找到事件源，再通过事件源到到对应处理函数
    batchedUpdates(()=>counterInstance.handleClick(syntheticEvent));
});

/**
 * 开发版还没发布
 * 1.并发模式，setState会合并 0 0  1 1 不管在哪里，更新都会合并 通过更新优先级合并的
 * 
 * 是现在的稳定 版
 * 1.同步模式下 如果用了batchedUpdates就会批量更新，不用就是同步更新
 * 为什么在事件函数或者生命周期函数中是批量的呢  是因为batchedUpdates
 */