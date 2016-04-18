!function($,undefined){
    var Elevator=function(element, options){
        var _this = this, _op,florrArra=[];
        _this.isScroll =!0;
        _this.resizeTimer=null;
        _this.resizeThread=null;
        //_this.scrollTime=null;
        _this.init=!0;
        _this.el = $(element);
        _this.options = $.extend({}, Elevator.DEFAULTS, options || {});
        _this.floorList = _this.el.find("." + _this.options.floorClass);
        _this.elevatorBox = $("." + _this.options.elevatorClass)
        _this.elevatorItemClass = _this.elevatorBox.find("." + _this.options.elevatorItemClass);

        _this.floorLast=_this.floorList.eq(_this.floorList.length-1);
        var _elevatorBoxGap = ($(window).height()- _this.elevatorBox.outerHeight())/2;
        var _floorLastScrollTop=_this.floorLast.offset().top - ( _this.floorLast.outerHeight() - _this.elevatorBox.outerHeight() )-_elevatorBoxGap;
        var _t =_this.el.offset().top+100;
        var _scrollTop;

        _this.bind();

        $(window).bind("scroll", function() {
            _scrollTop = $(this).scrollTop();

            _this.watch(_t ,_scrollTop, _elevatorBoxGap ,_floorLastScrollTop);
            clearTimeout(_this.resizeThread)
            _this.resizeThread=setTimeout(function(){
                if(_this.isScroll){
                    _this.floorList.each(function (a) {
                        if ($(this).offset().top < _scrollTop+ $(window).height()/2 && _scrollTop <= _floorLastScrollTop) {
                            _this.itemclass(a)
                        }else if(_scrollTop > _floorLastScrollTop){
                            _this.itemclass(_this.floorList.length-1)
                        }
                    })
                }

            },200)

        });
    };
    Elevator.DEFAULTS={
        floorClass: "floor",
        elevatorClass: "elevator",
        elevatorItemClass: "elevator-list",
        selectClass: "hover",
        event: "click",
        space:10,
        delay: 300,
        speed: 1200,
        easing: "swing" ,
        effectSmooth: !0,
        threshold: "auto",
        floorScrollMargin: 0,
        onStart: null ,
        onEnd: null ,
        onOut: null,
        onResizeCallback:null
    };
    Elevator.prototype.watch=function(_t ,_scrollTop, _elevatorBoxGap ,_floorLastScrollTop){
        var _this =this;
        if(_t-_scrollTop <=_elevatorBoxGap  && _scrollTop <= _floorLastScrollTop){
            if(_this.init){
                _this.init=!1;
                //console.log( _this.init)
                _this.onResize(_elevatorBoxGap),_this.onScroll()
            }
        }else{
            if(_scrollTop > _floorLastScrollTop){
                _this.bottomScroll()
            }else{
                _this.itemclass(0);
                _this.initScroll()
            }

        }
    };


    Elevator.prototype.bind=function(){
        var _this=this,_op=this.options;
        _this.elevatorItemClass.on("click",function(){
            var i= $(this).index(),_t=    _this.floorList.eq(i).offset().top;

            _this.isScroll=!1
            _this.itemclass(i);
            $("body").stop().animate({ scrollTop:_t },_op.speed, _op.easing,function(){
                _this.isScroll=!0

            })

        })
    };

    // 给当前 电梯 按钮 点亮等
    Elevator.prototype.itemclass=function(a){
        this.elevatorItemClass.removeClass(this.options.selectClass);
        this.elevatorItemClass.eq(a).addClass(this.options.selectClass)
    };

    Elevator.prototype.onScroll=function(){
        var _this=this;
        $(window).bind("resize", function() {
            _this.onResize( $(window).height()/2-_this.elevatorBox.outerHeight()/2);
        });
    };

    Elevator.prototype.initScroll=function(){
        var _this=this,_op=this.options;
        $(window).unbind("resize");
        _this.elevatorBox.css({
            position: "absolute",
            left: _op.left,
            top:0
        });
        _this.init=!0
    };
    Elevator.prototype.bottomScroll=function(){
        var _this=this,_op=this.options;
        //console.log(_this.el.outerHeight()-_this.elevatorBox.outerHeight())
        $(window).unbind("resize");
        _this.elevatorBox.css({
            position: "absolute",
            left: _op.left,
            top:_this.el.parent().outerHeight()-_this.elevatorBox.outerHeight()
        });
        _this.init=!0
    };

    Elevator.prototype.onResize=function(t){
        var _this = this,_op=this.options;
        _this.elevatorBox.css({
            position:"fixed",
            top:t,
            left:_this.el.offset().left-_this.elevatorBox.outerWidth()-10
        });
        clearTimeout(_this.resizeTimer),
            _this.resizeTimer = setTimeout(function() {
                $.isFunction(_op.onResizeCallback) && _op.onResizeCallback.call(_this)
            }, 200)
    };



    // Dropdown plugin definition
    // =====================
    function Plugin(option) {
        return new Elevator(this, option)
    }

    $.fn.elevator = Plugin;
    $.fn.elevator.Constructor = Elevator;
}(jQuery);

