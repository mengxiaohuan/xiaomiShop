~function anonymous(window) {
    class LightBox {
        constructor(container, options = {}) {

            // 初始化配置项
            let _default = {
                url: null,
                eventType: 'click'
            };

            // 把options传递进来的信息值覆盖_default，此时_default中存储的就是最新值
            for (let attr in options) {
                if (!options.hasOwnProperty(attr)) break;
                _default[attr] = options[attr];
            }

            for (let attr in _default) {
                if (!_default.hasOwnProperty(attr)) break
                this[attr] = _default[attr];
            }

            this.container = document.querySelector(container);
            this.Mask = document.querySelector('.wl-mask');
            this.poPup = document.querySelector('.wl-popup');
            this.Close = this.poPup.querySelector('.close');
            this.Play = this.poPup.querySelector('.play');

            this.init();
        }

        // LightBox的主入口
        init() {
            let promise = this.queryDada();
            promise.then(() => {
                this.bindHTML();
                this.toggle();
                //this.play();
            });
            /*this.container[`on${this.eventType}`] = function (ev) {
                ev = ev || window.event;
                let target = ev.target,
                    targetName = target.tagName;
                ev.stopPropagation ? ev.stopPropagation() : ev.cancelBubble = true;

                if (targetName === 'IMG') {
                    target = target.parentNode;
                    targetName = target.tagName;
                }

                if (targetName === 'DIV' && target.className === 'box') {
                    _self.mask();
                    _self.popup();
                }
            }
            this.container.children.forEach.call()

            _self.Close.onclick = function () {
                _self.close();
            }*/
        }

        hasClass(ele, str) {
            return ele.className.trim().split(/ +/g).indexOf(str) >= 0;
        }

        addClass(ele, str) {
            if (this.hasClass(ele, str)) return;
            ele.className += ` ${str}`;
        }

        removeClass(ele, str) {
            if (!this.hasClass(ele, str)) return;
            ele.className = ele.className.trim().split(/ +/g).filter(item => item !== str).join(' ');
        }

        // 获取数据
        queryDada() {
            let {url} = this;
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest;
                xhr.open('get', url);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        //=>把获取的数据也挂载到实例上了
                        this.data = JSON.parse(xhr.responseText);
                        resolve();
                    }
                };
                xhr.send(null);
            })
        }

        // 数据绑定
        bindHTML() {
            let {data} = this,
                videoStr = ``;
            data.video.forEach(item => {
                let {id, pic, title, intro} = item;
                videoStr += `<li>
                                <div class="box">
                                    <img src="${pic}"/>
                                    <span>
                                        <i class="icon iconfont icon-bofang"></i>
                                    </span>
                                </div>
                                <h6>${title}</h6>
                                <span>${intro}</span>
                            </li>`;
            });
            this.container.innerHTML = videoStr;
        }

        // 字符拼接
        queryHTML({id, pic, title, video}) {
            return `<h6>
                        ${title}
                        <a href="javascript:void(0)" class="close">
                            <i class="icon iconfont icon-guanbi"></i>
                        </a>
                    </h6>
                    <div class="video-wrap">
                        <video src="${video}"
                               poster="${pic}" controls></video>
                    </div>
                    <a href="javascript:void(0)" class="play">
                        <i class="icon iconfont icon-bofang"></i>
                    </a>`
        }

        // 控制弹框显示隐藏 & 播放
        toggle() {
            let _self = this,
                childs = [...this.container.children];

            childs.forEach((item, index) => {
                item[`on${this.eventType}`] = function (ev) {
                    ev = ev || window.event;
                    ev.stopPropagation ? ev.stopPropagation() : ev.cancelBubble = true;

                    /*if (targetName === 'IMG') {
                        target = target.parentNode;
                        targetName = target.tagName;
                    }

                    if (targetName === 'DIV' && target.className === 'box') {
                        _self.mask();
                        _self.popup();
                    }*/
                    _self.mask();
                    _self.popup();

                    index === 0 ? _self.poPup.innerHTML = '' + _self.queryHTML(_self.data.videoPopup[0]) : null;
                    index === 1 ? _self.poPup.innerHTML = '' + _self.queryHTML(_self.data.videoPopup[1]) : null;
                    index === 2 ? _self.poPup.innerHTML = '' + _self.queryHTML(_self.data.videoPopup[2]) : null;
                    index === 3 ? _self.poPup.innerHTML = '' + _self.queryHTML(_self.data.videoPopup[3]) : null;
                }
                /*this.container.addEventListener(`${this.eventType}`,function (ev) {
                    ev = ev || window.event;
                    let target = ev.target,
                        targetName = target.tagName;
                    ev.stopPropagation ? ev.stopPropagation() : ev.cancelBubble = true;

                    if (targetName === 'IMG') {
                        target = target.parentNode;
                        targetName = target.tagName;
                    }

                    if (targetName === 'DIV' && target.className === 'box') {
                        _self.mask();
                        _self.popup();
                    }
                    _self.mask();
                    _self.popup();

                    index === 0 ? _self.poPup.innerHTML = '' + _self.queryHTML(_self.data.videoPopup[0]) : null;
                })*/
            });

            /*_self.Close.onclick = function () {
                _self.close();
            }*/
            this.poPup.addEventListener('click', function (ev) {
                ev = ev || window.event;
                let target = ev.target,
                    targetName = target.tagName;
                ev.stopPropagation ? ev.stopPropagation() : ev.cancelBubble = true;

                if (targetName === 'I') {
                    target = target.parentNode;
                    targetName = target.tagName;
                }

                if (targetName === 'A' && target.className === 'close') {
                    _self.close();
                }

                if (targetName === 'A' && target.className === 'play') {
                    console.log(1)
                }

            })
        }

        // 视频播放
        play(){
            this.Play.onclick=function () {
                console.log(1)
            }
        }

        // 蒙层
        mask() {
            this.Mask.style.display = 'block';
        }

        // 弹窗
        popup() {
            this.addClass(this.poPup, 'show');
        }

        // 关闭按钮
        close() {
            this.Mask.style.display = 'none';
            this.removeClass(this.poPup, 'show');
        }
    }

    window.LightBox = LightBox;
}(window);