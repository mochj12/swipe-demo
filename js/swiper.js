(function($, window) {
    var plat = (function() {
        var res = {},
            ua = navigator.userAgent,
            mobileReg = /android|webos|ip(hone|ad|od)|opera (mini|mobi|tablet)|iemobile|windows.+(phone|touch)|mobile|fennec|kindle (Fire)|Silk|maemo|blackberry|playbook|bb10\; (touch|kbd)|Symbian(OS)|Ubuntu Touch/i,
            iosReg = /ip(hone|ad|od)/i;
        if (!ua) {
            ua = "";
        }
        ua = ua.toLowerCase();
        res.isAndroid = ua.indexOf("android") > -1;
        res.isIos = iosReg.test(ua);
        res.isWeixin = ua.indexOf("micromessenger") > -1;
        res.isWeibo = ua.indexOf("weibo") > -1;
        res.isMobile = mobileReg.test(ua) || res.isNull;
        res.isPc = !res.isMobile;
        return res;
    }());

    function Page(opt) {
        this.class = opt.class;
        this.init = opt.init || function() {};
        this.begin = opt.begin || function() {};
        this.init();
    }

    Page.prototype.render = function() {
        var self = this;
        setTimeout(function() {
            $('.' + self.class).addClass('active');
        }, 500);
        this.begin();
    }

    Page.prototype.clear = function() {
        $('.' + this.class).removeClass('active');
    }

    //添加transtionEnd事件前缀
    var endEvent = 'transitionEnd';
    var aniEndEvent = 'animationEnd';
    if (typeof document.body.style.webkitTransition === 'string') {
        endEvent = 'webkitTransitionEnd';
        aniEndEvent = 'webkitAnimationEnd';
    }

    //禁止原生滚动事件
    $('body').on('touchmove', function(e) {
        e.preventDefault();
    });

    $(window).on('scroll', function(event) {
        event.preventDefault();
    });

    // 获取页面高度
    function getClient() {
        var range = {};
        if (!plat.isWeixin) {
            range.vHeight = window.innerHeight || document.documentElement.clientHeight;
            range.vWidth = window.innerWidth || document.documentElement.clientWidth;
        } else {
            range.vHeight = document.documentElement.clientHeight || window.innerHeight;
            range.vWidth = document.documentElement.clientWidth || window.innerWidth;
        }
        return range;
    }

    function PageControler(opt) {
        this.container = opt.container || 'container';
        this.pages = opt.pages || [];
        this.acitveClass = opt.acitveClass || 'cur';
        this.duration = opt.duration || '1s';

        var that = this;

        var controller = {
            container: document.querySelector('.' + that.container),
            width: getClient().vWidth,
            height: getClient().vHeight,
            index: 0,
            totalPageNum: that.pages.length,
            startPoi: { x: 0, y: 0 },
            isAnimate: false,
            _speed: 0.3,
            activePage: null,
            $page: document.querySelector('.' + that.pages[0].class),
            init: function() {
                var self = this;

                $('.' + that.container).css({ 'height': self.height, 'width': self.width });
                if (!that.pages.length) {
                    return false; }

                self.bindEvent();
                that.pages[0].render();
                self.addPageClass(0);
                for (var i = 0; i < that.pages.length; i++) {
                    if (i > 0) {
                        $('.' + that.pages[i].class).css('-webkit-transform', 'translate3d(0,' + self.height + 'px, 0)');
                    } else {
                        $('.' + that.pages[i].class).css('-webkit-transform', 'translate3d(0, 0px, 0)');
                    }
                }
                return self;
            },
            bindEvent: function() {
                var self = this;

                self.container.addEventListener('touchstart', touchstartHandle, false);

                var changedY = 0,
                    changedX = 0,
                    startTime,
                    endTime,
                    delTime,
                    speed,
                    sin;

                function touchstartHandle(event) {
                    if (self.isAnimate) {
                        return false; }
                    self.startPoi.x = event.targetTouches[0].pageX;
                    self.startPoi.y = event.targetTouches[0].pageY;

                    startTime = new Date().getTime();

                    self.container.addEventListener('touchmove', touchemoveHandle, false);
                    self.container.addEventListener('touchend', touchendHandle, false);
                }

                function touchemoveHandle(event) {
                    if (self.isAnimate) {
                        return false; }
                    if (event.targetTouches.length > 1) {
                        return false; }
                    var curX = event.targetTouches[0].pageX;
                    var curY = event.targetTouches[0].pageY;

                    changedX = curX - self.startPoi.x;
                    changedY = curY - self.startPoi.y;

                    sin = changedY / Math.sqrt(changedY * changedY + changedX * changedX);

                    if (sin > Math.sin(Math.PI / 6)) {
                        if (self.index == 0) {
                            $('.page-active').css(self.setStyle(changedY, 1));
                            $('.page-next').css(self.setStyle(self.height + changedY, 1));
                        } else if (self.index < self.totalPageNum) {
                            $('.page-active').css(self.setStyle(changedY, 1));
                            $('.page-pre').css(self.setStyle(-self.height + changedY, 1));
                        }
                    }

                    if (sin < -Math.sin(-Math.PI / 6)) {
                        if (self.index == 0) {
                            $('.page-active').css(self.setStyle(changedY, 1));
                            $('.page-next').css(self.setStyle(self.height + changedY, 1));
                        } else if (self.index < self.totalPageNum) {
                            $('.page-active').css(self.setStyle(changedY, 1));
                            $('.page-next').css(self.setStyle(self.height + changedY, 1));
                            $('.page-prev').css(self.setStyle(-self.height - changedY, 1));
                        }
                    }
                }

                function touchendHandle(event) {
                    if (self.isAnimate) {
                        return false; }

                    endTime = new Date().getTime();
                    delTime = endTime - startTime;
                    speed = changedY / delTime;
                    self.isAnimate = true;

                    if (changedY == 0) {
                        self.isAnimate = false;
                        return false;
                    }
                    $('.page-active').one(endEvent, function(event) {
                        event.preventDefault();
                        /* Act on the event */
                        self.isAnimate = false;
                        changedY = 0;
                        changedX = 0;
                    });

                    if (changedY > self.height / 4 || speed > self._speed) {
                        if (self.index == 0) {
                            $('.page-active').css(self.setStyle(0));
                            $('.page-next').css(self.setStyle(self.height));
                            return false;
                        }
                        $('.page-active').css(self.setStyle(self.height));
                        $('.page-pre').css(self.setStyle(0));
                        self.prev();
                    } else if (changedY < -self.height / 4 || speed < -self._speed) {
                        if (self.index == self.totalPageNum - 1) {
                            $('.page-active').css(self.setStyle(0));
                            $('.page-pre').css(self.setStyle(-self.height));
                            return false;
                        }
                        $('.page-active').css(self.setStyle(-self.height));
                        $('.page-next').css(self.setStyle(0));
                        self.next();
                    } else {
                        if (changedY > 0) {
                            $('.page-active').css(self.setStyle(0));
                            $('.page-next').css(self.setStyle(self.height));
                            $('.page-pre').css(self.setStyle(-self.height));
                        } else {
                            $('.page-active').css(self.setStyle(0));
                            $('.page-next').css(self.setStyle(self.height));
                            $('.page-pre').css(self.setStyle(-self.height));
                        }
                    }
                    self.container.removeEventListener('touchmove');
                    self.container.removeEventListener('touchend');
                }

                $(window).on('resize', function(event) {
                    event.preventDefault();
                    /* Act on the event */
                    self.setLayout();
                });
            },
            setStyle: function(distance, judgenum) {
                if (judgenum == 1) {
                    return {
                        '-webkit-transform': 'translate3d(0,' + distance + 'px,0)',
                        '-webkit-transition': 'none'
                    }
                } else {
                    return {
                        '-webkit-transform': 'translate3d(0,' + distance + 'px,0)',
                        '-webkit-transition': '-webkit-transform ' + that.duration + ' ease-out'
                    }
                }
            },
            setLayout: function() {
                var self = this;

                self.width = getClient().vWidth;
                self.height = getClient().vHeight;
                $('.' + that.container).css({ 'height': self.height, 'width': self.width });
                var reg = /translate3d\(0px\,\s*((-\d+)|(\d+))/;
                $('.page').each(function(index, el) {
                    var translateHeight = $(el).css('-webkit-transform').match(reg)[1];
                    if (translateHeight > 0) {
                        $(el).css('-webkit-transform', 'translate3d(0,' + self.height + 'px,0)')
                    } else if (translateHeight < 0) {
                        $(el).css('-webkit-transform', 'translate3d(0,' + -self.height + 'px,0)')
                    }
                });
            },
            next: function() {
                var self = this;
                self.removePageClass();
                that.pages[self.index].clear();
                self.index++;
                self.addPageClass(self.index);

                that.pages[self.index].render();
            },
            prev: function() {
                var self = this;
                self.removePageClass();
                that.pages[self.index].clear();
                self.index--;
                self.addPageClass(self.index);
                that.pages[self.index].render();
            },
            addPageClass: function(index) {
                var self = this;
                if (self.index == 0) {
                    $('.' + that.pages[index].class).addClass('page-active');
                    $('.' + that.pages[index + 1].class).addClass('page-next');
                } else if (self.index < self.totalPageNum - 1) {
                    $('.' + that.pages[index - 1].class).addClass('page-pre');
                    $('.' + that.pages[index].class).addClass('page-active');
                    $('.' + that.pages[index + 1].class).addClass('page-next');
                } else {
                    $('.' + that.pages[index - 1].class).addClass('page-pre');
                    $('.' + that.pages[index].class).addClass('page-active');
                }
            },
            removePageClass: function(index) {
                $('.page-pre').removeClass('page-pre');
                $('.page-active').removeClass('page-active');
                $('.page-next').removeClass('page-next');
            }
        };

        return controller;
    }

    window.swiper = {
        page: Page,
        pageControler: PageControler
    }
})(Zepto,window);
