
我觉得多接触就好了
没学过就不建议听了
这是17.0的版本吗
和16.13有点子差别a
嗯 新版本才有lane优先级的概念
0最高
啥事 lane /  和 fiber 啥关系
lane是fiber一个优先级属性

优先级高的先执行 可以打算底的  和fiber扯不上关系吧
打起精神认真听
为啥事件优先级是数字大的高 赛道是数字小的优先级高？
规定的
打起精神认真听，事关能否进大厂
eventTime 超时时间 有啥用？
超时了 说明任务就要优先执行了
防止有任务一直执行不到
起码有个超时时间
哦哦 厉害
小乌龟好厉害
是 对对对解释的比较有道理
嘤嘤嘤
嘻嘻嘻
为什么我不知道
雅蠛蝶
该发言可能违规，仅老师可见
return
return
有点跟不上了，要好好消化一下
自古评论出大神
return是个属性吗是的
是个单词
return是父节点
return是啥
懵
fiber上的属性
等一波录屏
fiber在react中是链表形式存在的 return指向的是当前节点的父节点
权重

怎么算出来的快过期?
eventTime  1000ms
超时时间可是2000ms
更新是在1000ms的时候开始的，那么会在 3000ms后过期
如果组件嵌套很深，最深的那个组件调用setState的话那根组件的render方法会被执行么？
会
会的
都是从root开始渲染的
我刚写了个demo 并不会
应该是看state所属于的组件，作为更新根看
都是从root 开始计算   渲染不是
我居然听懂了
执行过的优先级至为多少来着
发布订阅模式和观察者模式在react用到的多吗
果然听不懂哈哈哈有回放吗。得慢慢消化，讲的是真棒
还是没听懂为什么setTimeout管不了，怎么判断setState是否在setTimeout里面（即怎么判断是否要同步模式）
settimeout 在微任务中 可能有特殊的处理
毕竟白嫖课   大部分 就是听个思想
没有时间细化 理解老师
合成事件还没处理
为啥是异步 可不是一两步那么简单 要知道什么流程才能理解
要知道很多流程
batchUpadta还没jiang讲呢
是的
有点watcher的感觉 只不过react是放在root vue是组件实例上 flashQueen
老师说的意思是第二次setState其实没有改变state？
直接return了
优先级和赛道再说一下
先setState num=1 ，接着setState num=2. 第二次还是会跳过？ 结果是1吗
是不是17才有赛道lane的概念
不是return了吗
最后打印是啥
fiber里面更新没有diff吗 有的
为什么还是队列里有2个任务？
第二次优先级一样 不是return了吗？为什么还是队列里有2个任务？
队列不是最后才执行吗咋还是0
赛道和优先级可以再说一下吗
不应该最后是2吗？
00 12
小丑是我
哈哈
还没讲完
nb
微任务队列咋整的，模拟的吗
刚看写了个
queueMicrotsk
直接写就识别吗
不一样了 原来是batchUpdate这个布尔值 现在是batchContext
isBatchingUpdate
batchContext
这个是在哪里被复制的  执行上下文，在合成事件的时候变更的嘛
没区分 是否在回调里

=是什么意思
或等
666
这个思路那感觉还是和原来的 batchUpdate有点类似 原理是一样的
shide1
!=是啥
他是方法了，然后怎么区分是批量
来
let a -0;
a|=1;
a =1;
=是什么意思
=是赋值
或等
问到知识盲区了  没用过
代码能分享吗？
还是没听懂为什么setTimeout管不了，怎么判断setState是否在setTimeout里面（即怎么判断是否要同步模式）


workloop 逻辑能在梳理一遍吗
能分享下代码和教程文档吗
setTimeout就已经出了 执行上下文环境了 归为NoContext了
嵌套很深的组件 最里层的组件调用setState方法，父组件的 render会执行么
然后不就同步更新state了
发布订阅模式  在react当中 应用广吗
合成事件不就是么
父组件的render不会执行  源码里是通过  fiber节点找到root节点   都是以前的缓存  domdiff完了 会找到对应的修改进行  render
第二次优先级一样不是return了吗？为什么还是队列里有2个任务？return就不会执行下面的代码 就没办法放进去updateQueueBA
update方法怎么看出是批量
我觉得你们关注的是老师讲的 思路原理思想
update方法怎么看出是批量


老师react当中发布订阅模式应用广 吗 redux

这个课有点难度
老师react当中发布订阅模式应用广 吗
lerna 多包依赖发布版本号变更如何处理~老师
优先级相同的时候，还加到队列么？不加了
A依赖B  B改了东西发布了， A里面的引入B的版本号只能手动改嘛
23行代码执行几次
lane和优先级
小白:lane和优先级




老师 这个同步异步 更新state 是react正式版就有吧
concurrent mode 那个 和这个无关吧？
老师在放一下微信
hooks内部也会调用setState吗
update中23行代码执行几次
蹲了这么久 没有解答我的问题0.0
老师这个同步异步更新state是react正式版就有吧


如果不用settimout 更新state 用promise更新state
去珠峰应聘吧  哈哈
架构课课时时多长时间？