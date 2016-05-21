!function($,undefined){
    // 筛选范围
    function  floorscope(_this,_floorList){
        var floordata=[];
        var _wh =  $(window).height();
        var _scrollTop = $("body").scrollTop() || $("html").scrollTop();

        var floorOffsetTop = 0;
        var floorHeighht = 0;

        var floorScrollTopHeighht=0;
        var $floor = null;
        var isMaxfloor =!1
        return $.each(_floorList,function(){
            if($floor = $(this),
                floorOffsetTop = $floor.offset().top,
                floorHeighht = $floor.outerHeight(),
                floorScrollTopHeighht = floorOffsetTop + floorHeighht,
                // 在屏幕的 范围内
                floorScrollTopHeighht >  _scrollTop &&  _scrollTop+_wh > floorOffsetTop ){
                var existClientHeighht = 0; // 存在 屏幕中 楼层的 高度

                _scrollTop >= floorOffsetTop && (existClientHeighht = floorScrollTopHeighht -_scrollTop),
                _scrollTop < floorOffsetTop && _scrollTop+_wh > floorOffsetTop && (existClientHeighht = _scrollTop + _wh - floorOffsetTop);

                   /* !isMaxfloor && existClientHeighht > _wh /3 && (isMaxfloor =  !0,
                            existClientHeighht = 9999),*/
                    floordata.push({
                        floor: $floor,
                        ch: existClientHeighht
                    })

            }
        }),
            floordata.length > 0 ? (floordata.sort(function(a,b){
                return a.ch < b.ch ? -1 : 1
            }),//如果 存在屏幕里面的 楼层只有
             floordata.length == 1 && floordata[floordata.length-1].floor.attr(_this.options.dataIdex) == _floorList.length -1 &&  floordata[floordata.length-1].ch < _this.options.onOutMargin ? null : floordata.pop().floor):null

    }
    // 处理 电梯面板 显示消失的函数
    function  elevatorBoxState(b, c){
            var _op = b.options;
        if ("auto" == _op.threshold){
            c ? b.elevatorBox.show() : b.elevatorBox.hide();
        }else if (null  != _op.threshold) {
            var _scrollTop = $("body").scrollTop() || $("html").scrollTop();
            var _threshold = _op.threshold;
            _op.threshold instanceof $ && (_threshold = _op.threshold.offset().top),
                _threshold > _scrollTop ? b.elevatorBox.hide() : b.elevatorBox.show()
        }
    }
    // 触发的 类
    function triggerClass(a ,b, c){
        a.removeClass(c),
            b.addClass(c)
    }
    // 楼层滑动
    function floorSlide(b, c) {
        var $body = $("body,html");
        b.effectSmooth && $body.stop(),
            $body.animate({
                scrollTop: b.top
            }, b.delay, b.easing, function() {
                c && (c(),
                    c = null )
            })
    }
    //返回的对象包装
    /**
     * a: 电梯按钮
     * b: 电梯所在楼层的位置
     * c: 来自哪个楼层
     * d: 当前楼层
     * */

    function pack(a, b, c, d) {
       /* console.log(a)
        console.log(b)
        console.log(c)
        console.log(d)*/
        return {
            handler: a[d],
            floor: b[d],
            from: c || -1,
            to: d
        }
    }
    var Elevator=function(element, options){
        var _this = this, _op;

       /*参数值*/
        _this.init=!0;
        _this.isScrolling =!1;  // 是否正在滚动

        _this.scrolltimer = -1; //实例 触发 滚动  定时器容器
        _this.resizetimer = -1; //实例 触发 浏览器大小改变 定时器容器

        _this.scrollThread = -1;
        _this.resizeThread = -1;

        _this.currentIdx =  -1; //当前 楼层 的 index
        _this.isPlay = !1;

        //插件元素获取
        _this.el = $(element);
        _op=_this.options = $.extend({}, Elevator.DEFAULTS, options || {});
        //传接过度
        //_this.threshold =_op.threshold;
        //获取楼成 列表
        _this.floorList = _this.el.find("." +_op.floorClass);
        // 电梯按钮 面板盒子
        _this.elevatorBox = $("." + _op.elevatorClass);
        // 电梯按钮
        _this.handlers = _this.elevatorBox.find("." + _op.handlerClass);

        _this.install();

        $(window).bind("scroll", function() {

            clearTimeout(_this.scrolltimer);
            _this.scrolltimer = setTimeout(function(){
                clearTimeout(_this.scrolltimer);
                    _this.onScroll()
            },50)
        }),
        $(window).bind("resize", function() {
            clearTimeout(_this.resizetimer);
            _this.resizetimer = setTimeout(function(){
                clearTimeout(_this.resizetimer);
                _this.onResize()
            },50)
        })

        if(_op.event){
            var floorSlideTimer = -1;
            _this.handlers.on(_op.event,function(e){
                var $this = $(this);
                var _idx = $this.attr(_op.dataIdex);
                var $floor = $(_this.floorList).eq(_idx);
                var _currentIdx = _this.currentIdx;
                console.log(_this.currentIdx)
                var floorPack = null;
                clearTimeout(floorSlideTimer),
                    _this.isPlay=!0,
                    _this.currentIdx = _idx,
                    floorPack = pack(_this.handlers, _this.floorList, _currentIdx, _idx),
                    $.isFunction(_op.onStart) && _op.onStart.call(_this , floorPack),
                    _op.selectClass && triggerClass(_this.handlers, $this, _op.selectClass),
                    floorSlide({
                        top: $floor.offset().top + _op.floorScrollMargin,
                        delay: _op.delay,
                        easing: _op.easing,
                        effectSmooth: _op.effectSmooth
                    },function(){
                        $.isFunction(_op.onEnd) && _op.onEnd.call(_this, floorPack),
                            floorSlideTimer = setTimeout(function(){

                                _this.isPlay = !1
                                //console.log(_this.isPlay)
                            },100),
                            _this.elevatorBox.show()
                    }),
                e.preventDefault()
            })
        }
    };
    Elevator.VERSION = '1.0.0';
    Elevator.DEFAULTS={
        floorClass: "ui-floor",
        elevatorClass: "ui-elevator",
        handlerClass: "ui-handlers",
        selectClass: null,
        event: "click",
        delay: 300,
        easing: "swing" ,
        effectSmooth: !0,
        threshold: "auto",
        floorScrollMargin: 0,
        dataIdex:"data-idx",
        onOutMargin:0,    //当离开最后 一个楼层时候
        onStart: null ,   // 电梯启动
        onEnd: null ,     // 电梯到终点
        onOut: null,
        onResizeCallback:null  // 当 可视区 变化
    };

    Elevator.prototype.install=function(){
        var _this=this,_op=this.options;
        _this.floorList.each(function(b){
            $(this).attr(_op.dataIdex,b)
        }),
            _this.handlers.each(function(b){
                $(this).attr(_op.dataIdex,b)
            });

        _this.onScroll();
    };
    Elevator.prototype.onScroll=function(){
        var _this=this,_op=this.options;
        //console.log(_this.isPlay)
        _this.isPlay || ( _this.isScrolling || (_this.isScrolling = !0,
        $.isFunction(_this.onStart) && _this.onStart()),
            clearTimeout(_this.scrollThread),
            _this.scrollThread = setTimeout(function(){
                var isShowElevatorBox = !1; // 判断面板 是否显示
                var floorSatet = floorscope(_this,_this.floorList)
                //console.log(floorSatet)
                floorSatet && (isShowElevatorBox = !0,
                    $.isFunction(_this.onEnd) && _this.onEnd.call(_this,floorSatet)),
                    elevatorBoxState(_this , isShowElevatorBox),
                    isShowElevatorBox || $.isFunction(_this.onOut) && _this.onOut.call(_this),
                    _this.isScrolling = !1
            },200))
    };
    Elevator.prototype.onResize =function(){
        var _this=this,_op=this.options;
        clearTimeout(_this.resizeThread),
            _this.resizeThread = setTimeout(function(){
                $.isFunction(_op.onResizeCallback) && _op.onResizeCallback.call(_this)
            },200)

    };
    //滚动 开始
    Elevator.prototype.onStart=function (){
        var _this=this,_op=this.options;
        $.isFunction(_op.onStart) && _op.onStart.call(_this, pack(_this.handlers, _this.floorList,_this.currentIdx ? _this.currentIdx : -1 ,-1 ))
    };
    //滚动结束
    Elevator.prototype.onEnd=function (d){
        var _this=this,_op=this.options;
        if (d) {
            var _idx = d.attr(_op.dataIdex);
            var idxLast = _this.currentIdx; //上一次的 index
            if (_this.currentIdx = _idx,
                _idx < _this.handlers.length && _idx > -1) {

                var $handler = $(_this.handlers.filter("["+_op.dataIdex+"=" + _idx + "]"));
                if (!$handler || $handler.length < 1)
                    return !1;
                triggerClass(_this.handlers, $handler, _op.selectClass),
                $.isFunction(_op.onEnd) && _op.onEnd.call(_this, pack(_this.handlers, _this.floorList, idxLast, _idx))
            }
        }
    };
    //当 elevatorBox 消失的情况, 已经 离开楼层块的时候 触发
    Elevator.prototype.onOut=function (){
        var _this=this,_op=this.options;

        _op.selectClass && _this.handlers.removeClass(_op.selectClass),
        $.isFunction(_op.onOut) && _op.onOut.call(_this, _this.elevatorBox)
    };

    // Dropdown plugin definition
    // =====================
    function Plugin(option) {
        return new Elevator(this, option)
    }

    $.fn.elevator = Plugin;
    $.fn.elevator.Constructor = Elevator;
}(jQuery);

