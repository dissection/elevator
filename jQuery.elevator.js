!function($,undefined){
    // 筛选范围
    function  floorscope(_floorList){
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
                _scrollTop > floorOffsetTop && (existClientHeighht = floorScrollTopHeighht -_scrollTop),
                _scrollTop < floorOffsetTop && _scrollTop+_wh > floorOffsetTop && (existClientHeighht = _scrollTop + _wh - floorOffsetTop),

                    !isMaxfloor && existClientHeighht > _wh /3 && (isMaxfloor =  !0,
                            existClientHeighht = 9999),
                    floordata.push({
                        floor: $floor,
                        ch: existClientHeighht
                    })

            }
        }),
            floordata.length > 0 ? (floordata.sort(function(a,b){
                return a.ch < b.ch ? -1 : 1
            }),
                floordata.pop().floor):null

    }
    // 处理 电梯面板 显示消失的函数
    function  elevatorBox(t,b){

    }

    // 触发的 类
    function triggerClass(a ,b, c){
        a.removeClass(c),
            b.addClass(c)
    }

    var Elevator=function(element, options){
        var _this = this, _op;

       /*参数值*/
        _this.init=!0;
        _this.isScrolling =!1;  // 是否正在滚动

        _this.scrolltimer = -1; //实例 触发 滚动  定时器容器
        _this.resizetimer = -1; //实例 触发 浏览器大小改变 定时器容器


        _this.scrollThread= -1;
        _this.


        //插件元素获取
        _this.el = $(element);
        _op=_this.options = $.extend({}, Elevator.DEFAULTS, options || {});

        //获取楼成 列表
        _this.floorList = _this.el.find("." +_op.floorClass);
        // 电梯按钮 面板盒子
        _this.elevatorBox = $("." + _op.elevatorClass);
        // 电梯按钮
        _this.handlers = _this.elevatorBox.find("." + _op.handlerClass);

        _this.install()

        $(window).bind("scroll", function() {
            clearTimeout(_this.scrolltimer)
            _this.scrolltimer = setTimeout(function(){
                clearTimeout(_this.scrolltimer)
                    _this.onScroll()
            },50)
        }),
        $(window).bind("resize", function() {
            clearTimeout(_this.resizetimer)
            _this.resizetimer = setTimeout(function(){
                clearTimeout(_this.resizetimer)
                _this.onResize()
            },50)
        })
    };
    Elevator.DEFAULTS={
        floorClass: "ui-floor",
        elevatorClass: "ui-elevator",
        handlerClass: "ui-handlers",
        selectClass: "hover",
        event: "click",
        space:10,
        delay: 300,
        speed: 1200,
        easing: "swing" ,
        effectSmooth: !0,
        threshold: "auto",
        floorScrollMargin: 0,
        dataIdex:"data-idx",
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
            })

        _this.onScroll();
    };
    Elevator.prototype.onScroll=function(){
        var _this=this,_op=this.options;
        _this.isScrolling || (_this.isScrolling = !0,
        $.isFunction(_this.onStart) && _this.onStart()),
            clearTimeout(_this.scrollThread),
            _this.scrollThread = setTimeout(function(){
                var isShowElevatorBox = !1; // 判断面板 是否显示

            },200)
    };




    // Dropdown plugin definition
    // =====================
    function Plugin(option) {
        return new Elevator(this, option)
    }

    $.fn.elevator = Plugin;
    $.fn.elevator.Constructor = Elevator;
}(jQuery);

