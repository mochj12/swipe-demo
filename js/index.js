(function($) {
    /*页面组件开始*/
    var page1 = new swiper.page({
        class: 'page1',
        init: function() {
            console.log('page1 init');
        },
        begin: function() {
            console.log('page1 render');
        }
    });
    var page2 = new swiper.page({
        class: 'page2',
        init: function() {
            console.log('page2 init');
        },
        begin: function() {
            console.log('page2 render');
        }
    });
    var page3 = new swiper.page({
        class: 'page3',
        init: function() {
            console.log('page3 init');
        },
        begin: function() {
            console.log('page3 render');
        }
    });
    var page4 = new swiper.page({
        class: 'page4',
        init: function() {
            console.log('page4 init');
        },
        begin: function() {
            console.log('page4 render');
        }

    });
    var page5 = new swiper.page({
        class: 'page5',
        init: function() {
            console.log('page5 init');
        },
        begin: function() {
            console.log('page5 render');
        }
    });
    var page6 = new swiper.page({
        class: 'page6',
        init: function() { console.log('page6 init'); },
        begin: function() { console.log('page6 render'); }
    });

    var pageArray = [page1, page2, page3, page4, page5, page6];

    // page控制器实例
    var pageController = new swiper.pageControler({
        container: 'container',
        pages: pageArray,
        acitveClass: 'active',
        duration: '.5s'
    });

    (function() {
        // 加载中
        var loadingCount = 0;
        var $pageloading = document.querySelector('.pageloading');
        // 懒加载
        var $imgs = document.querySelectorAll('.lazy');
        var $per = document.querySelector('#loading');
        var n = $imgs.length;
        var total = n;
        var per = Math.floor(100 / total);
        var now = 0;
        var m = 0;
        for (var i = 0; i < n; i++) {
            lazyLoad($imgs[i], lazyLoadCallBack);
        }

        // 懒加载
        function lazyLoad($img, callback) {
            var img = new Image();
            var url = $img.getAttribute('data-src');
            img.src = url;
            img.onload = function() {
                $img.setAttribute('src', url);
                callback();
                img.onload = null;
            };
            img.src = url;
        }

        // 懒加载callback
        function lazyLoadCallBack() {
            now += per;
            m++;
            $per.innerHTML = now + '%';
            if (m == total) {
                $per.innerHTML = '100%';
                $pageloading.style.cssText = 'display:none;';
                pageController.init();
            }
        }
    })();
})(Zepto);
