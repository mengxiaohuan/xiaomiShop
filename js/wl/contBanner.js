/*
 *  不好用的
 */
~function anonymous(window) {
    class contBanner {
        constructor(options = {}) {
            // optiongs传递的配置项(解构赋值并且给更多的配置项默认值)
            let {
                ele, // 当前元素
                url, // ajax请求地址
                isArrow = true, // 是否显示箭头
                isFocus = true, // 是否显示焦点
                isAuto = true, // 是否自动播放
                defaultIndex = 0, // 索引
                interval = 3000, // 轮播时间
                speed = 300,   // 轮播速度
                moveEnd
            } = options;

            // 把所有的配置项信息都挂载到实例上(这样以后在原型的任何方法中都可以调取这些属性获取值了)
            ['ele', 'url', 'isArrow', 'isFocus', 'isAuto', 'defaultIndex', 'interval', 'speed', 'moveEnd'].forEach(item => {
                this[item] = eval(item);
            });

            this.container = document.querySelector(ele); // 当前元素
            let _con = this.container;
            this.wrapper = _con.querySelector('.wrapper'); // 轮播项外层
            this.focus = _con.querySelector('.focus'); // 轮播焦外层
            this.arrowLeft = _con.querySelector('.arrowLeft'); // 轮播箭头
            this.arrowRight = _con.querySelector('.arrowRight'); // 轮播箭头
            this.slideList = null; // 轮播项
            this.focusList = null; // 轮播焦点
            this.stepIndex = defaultIndex; // 轮播索引
            this.autoTimer = null; // 轮播定时器

            this.isRun = false;

            // 调取init开启轮播图
            this.init();
        }

        // banner的主入口(在init中规划方法的执行顺序)
        init() {
            let {isAuto, interval} = this;  // 实例上的是否自动播放 轮播时间 当前函数用到这两项的时候 也就代表是this-》实例上的
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
                this.handleFocus();
                this.handleArrow()
            });
        }

        // 获取数据
        queryData() {
            let {url} = this; // 解构的url 指的是实例上的url
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest;
                xhr.open('get', url);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        // 把获取的数据也挂载到实例上
                        this.data = JSON.parse(xhr.responseText);
                        resolve();
                    }
                };
                xhr.send(null);
            })
        }

        // 数据绑定
        bindHTML() {
            // 解构挂载到实例上的数据、轮播外层、焦点外层、轮播项、焦点项
            let {data, wrapper, focus, slideList, focusList} = this;
            let strSlide = ``, // 准备拼接的轮播项
                strFocus = ``; // 准备拼接的焦点项
            data.forEach((item, index) => { // 遍历数据的每一项
                // 解构数据每一项
                let {id, img, title, intro, price} = item;
                strSlide += `<div class="inner slide">
                            <h4>${title}</h4>
                            <p>${intro}</p>
                            <span class="price">${price}</span>
                            <div class="pic">
                                <img src="${img}"/>
                            </div>
                        </div>`
                strFocus += `<li class="${index === 0 ? 'active' : ''}"></li>`;
            });
            wrapper.innerHTML = strSlide;
            focus.innerHTML = strFocus;


            // 获取所有的slide和li
            this.slideList = wrapper.querySelectorAll('.slide');
            this.focusList = focus.querySelectorAll('li');
            wrapper.appendChild(this.slideList[0].cloneNode(true));
            this.slideList = wrapper.querySelectorAll('.slide');
            wrapper.style.width = this.slideList.length * 216 + 'px';
        };

        // 自动轮播
        autoMove() {
            this.stepIndex++;
            if (this.stepIndex >= this.slideList.length) {
                this.wrapper.style.left = '0';
                this.stepIndex = 1;
            }

            // 基于自主封装的animate实现切换动画
            animate(this.wrapper, {
                left: -this.stepIndex * 216
            }, this.speed);
            this.changeFocus();
        }

        // 焦点切换
        changeFocus() {
            let tempIndex = this.stepIndex;
            tempIndex === this.slideList.length - 1 ? tempIndex = 0 : null;
            [].forEach.call(this.focusList, (item, index) => {
                item.className = index === tempIndex ? 'active' : '';
            });
        }

        //焦点切换
        handleFocus() {
            let {focusList, wrapper} = this;

            [].forEach.call(focusList, (item, index) => {
                item.onclick = () => {
                    this.stepIndex = index;
                    animate(wrapper, {
                        left: -this.stepIndex * 216
                    }, this.speed);
                    this.changeFocus();
                };
            });
        };

        //左右按钮点击事件
        handleArrow() {
            let {arrowLeft, arrowRight, wrapper, stepIndex, slideList} = this;

            arrowRight.onclick = () => {
                this.autoMove();
            }

            arrowLeft.onclick = () => {
                this.stepIndex--;
                if (this.stepIndex < 0) {
                    this.wrapper.style.left = -(slideList.length - 1) * 216 + 'px';
                    this.stepIndex = slideList.length - 2;
                }

                // 基于自主封装的animate实现切换动画
                animate(this.wrapper, {
                    left: -this.stepIndex * 216
                }, this.speed);
                this.changeFocus();
            }
        };

    }

    window.contBanner = contBanner;
}(window);