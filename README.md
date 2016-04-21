# elevator

## options

### 基本参数

floorClass [`string`]  
    楼层对应的 calss  
    ['default']: "ui-floor"

elevatorClass [`string`]  
    电梯触发面板盒子calss  
    ['default']: "ui-elevator"
    
handlerClass [`string`]  
    电梯触发按钮 calss  
    ['default']: "ui-handlers"
    
selectClass [`string`]  
    选择触发 的 calss  
    ['default']: null
    
event [`string`]  
    触发 事件  
    ['default']: "click"

delay [`number`]  
       每一次 滑动 所需要的时间  
    ['default']: 300
    
easing [`string`]  
       依赖jquery.easing   
    ['default']: "swing"

effectSmooth [`Boolean`]  
       是否 平滑过渡  
    ['default']: !0
    
threshold [`string`]  
    *一般默认,用不到*  
    ['default']: "auto"
    
floorScrollMargin [`number`]  
    每个楼层 offset.top 所加的距离  
    ['default']: "auto"   
    
    
dataIdex [`string`]  
   初始化对应楼层的参数 key  
    ['default']: "data-idx" 
    
 onOutMargin [`number`]  
    当离开楼层 最后一层,所以剩余的 距离 多少时候 赢藏 ，电梯面板  
     ['default']: "data-idx" 
     
### 回调函数
 
 onStart [`function`]  
    电梯启动的时候 
     ['default']: null
     
  onEnd [`function`]  
   电梯到终点的时候
     ['default']: null
      
  onOut [`function`]  
    当离开楼层 区域调用
      ['default']: null
    
onResizeCallback [`function`]  
  每次 改变 浏览器大小 时候 触发 回调
    ['default']: null  
