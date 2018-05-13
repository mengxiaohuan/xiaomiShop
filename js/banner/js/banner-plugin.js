/**
 * 封装插件
 *
 *  1.每一次调用插件都是独立的，互不影响的
 *  2.一些常用的方法还要是共用的
 */

// new Banner({
//     ele: '#container',//操作哪个容器（选择器）
//     // data:[],//需要绑定的数据
//     url: '',//获取数据的api地址（插件内部帮我们获取数据）
//     isArrow: true,//是否支持左右切换
//     isFocus:true,//是否支持焦点切换
//     isAuto: true,//是否支持自动切换
//     defaultIndex: 0,//默认展示第几张
//     interval:3000,//多久切换一次
//     speed:200,//切换速度
//     moveEnd:()=>{},//切换完成后处理的事情
// });
//
// Banner.fn.extend({xxx:()=>{}})


~(function () {

    class Banner {
        constructor(options = {}) {
            //options传递的配置项

            //解构赋值并且给更多的配置项设置默认值
            let {
                ele,//操作的元素
                wrapper = 'wrapper',//轮播图盒子的class
                focus = 'focus',//焦点的class
                arrowLeft = 'arrowLeft',//左箭头的class
                arrowRight = 'arrowRight',//右箭头的class
                slide = 'slide',//每个轮播图的class
                url,//数据地址
                width = 1000,//盒子宽度
                height = 300,//盒子高度
                isArrow = true,//是否左右切换
                isFocus = true,//是否焦点切换
                isAuto = true,//是否自动切换
                isMouse = true,//鼠标放上是否停止切换
                defaultIndex = 0,//默认展示第几张
                interval = 3000,//多久切换一次
                speed = 200,//切换速度
                direction = 'horizontal',//水平(horizontal)或垂直(vertical)
                effect = 'silde',//普通切换(slide),淡入(fade）
                moveEnd
            } = options;

            //把所有的配置项信息都挂载到实例上（这样以后再原型的任何方法中都可以调取这些属性获取值了）
            ['ele', 'wrapper', 'focus', 'arrowLeft', 'arrowRight', 'slide', 'url', 'width', 'height', 'isArrow', 'isFocus', 'isAuto', 'isMouse', 'defaultIndex', 'interval', 'speed', 'direction', 'effect', 'moveEnd'].forEach(item => {

                this[item] = eval(item);

            });

            //获取需要的元素，挂载到实例上
            this.container = document.querySelector(ele);
            let _con = this.container;

            this.wrapper = _con.querySelector(`.${wrapper}`);
            this.focus = _con.querySelector(`.${focus}`);
            this.arrowLeft = _con.querySelector(`.${arrowLeft}`);
            this.arrowRight = _con.querySelector(`.${arrowRight}`);
            this.slideList = null;
            this.focusList = null;
            this.stepIndex = this.defaultIndex;//当前展示块的索引（步长）
            this.autoTimer = null;//自动轮播的定时器

            this.isRun = false;

            //调取init，开启轮播图
            this.init();

        }

        //Banner的入口（在init中规划方法的执行顺序）
        init() {

            let {isAuto, interval, isFocus, isArrow, isMouse} = this;

            let promise = this.queryData();
            promise.then(() => {
                this.bindHTML();
            }).then(() => {
                if (isAuto) {
                    this.autoTimer = setInterval(() => {
                        this.autoMove();
                    }, interval);
                }
            }).then(() => {
                if (isMouse) {
                    this.handleContainer();
                }
                if (isFocus) {
                    this.handleFocus();
                }
                if (isArrow) {
                    this.handleArrow();
                }
            });
        }

        //获取数据
        queryData() {
            let {url} = this;

            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open("get", url);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        this.data = JSON.parse(xhr.responseText);
                        resolve();
                    }
                };
                xhr.send(null);
            });
        }

        //数据绑定
        bindHTML() {

            let {data, width, height, direction, slide, effect} = this;

            let strSlide = ``,
                strFocus = ``;

            data.forEach((item, index) => {

                let {img, desc} = item;

                strSlide += `<div class="${slide}"><img src="${img}" alt="${desc}"></div>`;
                strFocus += `<li class="${index == 0 ? 'active' : ''}"></li>`;
            });

            this.wrapper.innerHTML = strSlide;
            this.focus.innerHTML = strFocus;

            this.slideList = this.wrapper.querySelectorAll(`.${slide}`);
            this.focusList = this.focus.querySelectorAll('li');

            //设置css
            utils.css(this.container, {width: width, height: height});

            if (effect == 'slide') {

                this.wrapper.appendChild(this.slideList[0].cloneNode(true));
                this.slideList = this.wrapper.querySelectorAll(`.${slide}`);

                if (direction == 'horizontal') {
                    utils.css(this.wrapper, 'width', this.slideList.length * width);
                } else if (direction == 'vertical') {
                    utils.css(this.focus, {
                        transform: 'rotate(90deg)',
                        top: '50%',
                        left: width - utils.css(this.focus, 'width') - 8
                    });

                    utils.css(this.arrowLeft, {
                        transform: 'rotate(90deg)',
                        top: 0,
                        left: '50%',
                        marginLeft: '-14px',
                        marginTop: '-8px'
                    });

                    utils.css(this.arrowRight, {
                        transform: 'rotate(90deg)',
                        top: height - 15,
                        left: '50%',
                        marginLeft: '-14px',
                        marginBottom: '-8px'
                    });

                }
                utils.each(this.slideList, (index, item) => {
                    utils.css(item, 'width', width);
                    if (direction == 'horizontal') {
                        utils.css(item, 'float', 'left');
                    }
                });
            } else if (effect == 'fade') {
                utils.each(this.slideList, (index, item) => {

                    if (index == 0) {
                        utils.css(item, {
                            width: width,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 1,
                            opacity: 1,
                        });
                    } else {
                        utils.css(item, {
                            width: width,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 0,
                            opacity: 0,
                        });
                    }
                });
            }


        }

        //各方向运动
        animateMove() {

            let {wrapper, width, height, speed, direction, effect, slideList} = this;

            if (effect == 'slide') {

                if (direction == 'horizontal') {

                    animate(wrapper, {
                        left: -this.stepIndex * width
                    }, speed, ()=>{
                        this.isRun = false;
                    });

                } else if (direction == 'vertical') {

                    animate(wrapper, {
                        top: -this.stepIndex * height
                    }, speed, ()=>{
                        this.isRun = false;
                    });

                }

            } else if (effect == 'fade') {

                let cur = slideList[this.stepIndex];

                utils.css(cur, 'zIndex', 1);
                utils.each(slideList, (index, item) => {
                    index == this.stepIndex ? null : utils.css(item, 'zIndex', 0);
                });

                animate(cur, {
                    opacity: 1
                }, speed, () => {
                    utils.each(slideList, (index, item) => {
                        index == this.stepIndex ? null : utils.css(item, 'opacity', 0);
                    });

                    this.isRun = false;
                });

            }

        }

        //轮播图运动
        autoMove() {

            let {wrapper, direction, effect} = this;

            this.stepIndex++;

            if (effect == 'slide') {

                if (this.stepIndex >= this.slideList.length) {
                    //说明再往后切换就没有了，当前展示的是克隆的第一张
                    if (direction == 'horizontal') {
                        utils.css(wrapper, 'left', 0);
                    } else if (direction == 'vertical') {
                        utils.css(wrapper, 'top', 0);
                    }

                    this.stepIndex = 1;
                }

            } else if (effect == 'fade') {

                if (this.stepIndex >= this.slideList.length) {
                    this.stepIndex = 0;
                }
            }

            //基于自己封装的animate实现切换动画
            this.animateMove();

            this.changeFocus();
        };

        //切换焦点
        changeFocus() {

            let {stepIndex, slideList, effect} = this;

            let tempIndex = stepIndex;

            if (effect == 'slide') {
                tempIndex == slideList.length - 1 ? tempIndex = 0 : null;
            }

            utils.each(this.focusList, (index, item) => {
                index == tempIndex ? item.className = 'active' : item.className = '';
            });

        };

        //鼠标移入、移出
        handleContainer() {

            let {container, interval, isArrow, isAuto} = this;

            container.onmouseenter = () => {

                clearInterval(this.autoTimer);

                if (isArrow) {
                    this.arrowLeft.style.display = this.arrowRight.style.display = 'block';
                }
            };
            container.onmouseleave = () => {

                if (isAuto) {
                    this.autoTimer = setInterval(() => {
                        this.autoMove();
                    }, interval);
                }

                if (isArrow) {
                    this.arrowLeft.style.display = this.arrowRight.style.display = 'none';
                }
            };
        };

        //焦点切换
        handleFocus() {

            let {focusList, effect} = this;

            [].forEach.call(focusList, (item, index) => {
                item.onclick = () => {

                    if(this.isRun) return;

                    this.isRun = true;

                    if (index == this.stepIndex) return;

                    this.stepIndex = index;//点击的是谁，就让stepIndex运动到哪里

                    this.animateMove();

                    this.changeFocus();
                }
            });
        };

        //左右按钮点击事件
        handleArrow() {

            let {arrowRight, arrowLeft, wrapper, slideList, width, height, direction, effect} = this;

            arrowRight.onclick = () => {

                if(this.isRun) return;

                this.isRun = true;

                this.autoMove();

            };//点击右按钮和执行轮播是一样的

            arrowLeft.onclick = () => {

                if(this.isRun) return;

                this.isRun = true;

                this.stepIndex--;

                if (effect == 'slide') {
                    if (this.stepIndex < 0) {
                        if (direction == 'horizontal') {
                            utils.css(wrapper, 'left', -(slideList.length - 1) * width);
                        } else if (direction == 'vertical') {
                            utils.css(wrapper, 'top', -(slideList.length - 1) * height);
                        }

                        this.stepIndex = slideList.length - 2;
                    }
                } else if (effect == 'fade') {
                    if (this.stepIndex < 0) {
                        this.stepIndex = slideList.length - 1;
                    }
                }

                this.animateMove();

                this.changeFocus();
            }
        };

    }

    window.Banner = Banner;
})();
