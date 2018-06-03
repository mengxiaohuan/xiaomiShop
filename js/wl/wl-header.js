;(function () {
    "use strict";
    //hasClass
    let hasClass = (ele, str) => ele.className.trim().split(/\s+/).indexOf(str) >= 0;

    // addClass
    let addClass = (ele, str) => {
        let isExit = hasClass(ele, str);
        if (isExit) return;
        ele.className += ` ${str}`;
    };

    // removeClass
    let removeClass = (ele, str) => {
        let isExit = hasClass(ele, str);
        if (!isExit) return;
        let ary = ele.className.trim().split(/\s+/);
        ary = ary.filter(item => item !== str);
        ele.className = ary.join(' ');
    };


    // 头部购物车
    let shopCart = (function () {
        // 获取元素
        let shop = document.querySelector('.shopping-cart'),
            shopCont = shop.querySelector('.shopping-cart .cont'),
            loaDing = shop.querySelector('.shopping-cart .loading'),
            shopHover = document.querySelector('.wl-header .shopping-cart a');

        let shopList = function () {
            shopHover.addEventListener('mouseover', function () {
                let timer = setTimeout(() => {
                    loaDing.style.display = 'none';
                    shopCont.style.visibility = 'visible';
                    shopCont.style.opacity = 1;
                    clearInterval(timer);
                    timer = null;
                }, 1000);
            })
        }

        return {
            init: function () {
                shopList();
            }
        }
    })();
    shopCart.init();

    // 搜索框功能
    let searchIput = (function () {
        // 获取元素
        let searchWrap = document.querySelector('.search-input'),
            searchIput = searchWrap.querySelector('.search-input input[type=search]'),
            searchBtn = searchWrap.querySelector('.search-input .search-btn'),
            recommend = searchWrap.querySelector('.search-input .recommend'),
            dropDown = searchWrap.querySelector('.drop-down'),
            data = null;

        let queryData = function () {
            return new Promise((resolve, reject) => {
                searchIput.addEventListener('click', function () {
                    let searchText = this.value;
                    addClass(this, 'pull');
                    addClass(searchBtn, 'pull');
                    addClass(recommend, 'pull');
                    addClass(dropDown, 'pull');
                    let xhr = new XMLHttpRequest;
                    xhr.open('GET', '../json/search.json');
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            data = JSON.parse(xhr.responseText);
                            resolve(data);
                        }
                        if (xhr.status !== 200) {
                            reject('报错了吧！');
                        }
                    };
                    xhr.send(null);
                });
            });
        }

        // 绑定数据
        let bindHTML = function (data) {
            let liStr = ``;
            for (let i = 0; i < data.length; i++) {
                let item = data[i],
                    {title, num} = item;
                liStr += `<li>
                        <a href="javascript:void(0)">
                            <p>${title}</p>
                            <span>约有${num}件</span>
                        </a>
                    </li>`;
            }
            dropDown.innerHTML = liStr;
        }

        // 恢复默认样式
        let backStyle = function () {
            document.body.addEventListener('click', function (ev) {
                if (ev.target === searchIput) return;
                removeClass(searchIput, 'pull');
                removeClass(searchBtn, 'pull');
                removeClass(recommend, 'pull');
                removeClass(dropDown, 'pull');
                searchIput.value = '';
            });
        }

        // 切换输入框value
        let inputVal = function () {
            let oLis = document.querySelectorAll('.drop-down li')
            for (let i = 0; i < oLis.length; i++) {
                let childText = oLis[i].children[0].firstElementChild.innerHTML;
                oLis[i].onclick = function (ev) {
                    ev = ev || window.event;
                    ev.stopPropagation ? ev.stopPropagation() : ev.cancelBubble = true;
                    removeClass(searchIput, 'pull');
                    removeClass(searchBtn, 'pull');
                    addClass(recommend, 'pull');
                    removeClass(dropDown, 'pull');
                    searchIput.value = ev.target.innerHTML;
                };
            }
        }

        return {
            init: function () {
                queryData();
                let promise = queryData();
                promise.then(bindHTML).then(() => {
                    backStyle();
                    inputVal();
                });
            }
        }

    })();
    searchIput.init();

    // 头部菜单
    let headerNav = (function () {
        // 获取元素
        let navLis = document.querySelector('.wl-header .header-nav .nav'),
            navItem = navLis.querySelectorAll('li.item'),
            navDown = document.querySelector('.wl-header .nav-down'),
            navDownCont = navDown.querySelector('ul'),
            data = null;

        // 获取数据
        let queryData = function () {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest;
                xhr.open('get', '../json/headerNav.json');
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        data = JSON.parse(xhr.responseText);
                        resolve(data);
                    }
                    if (xhr.status !== 200) {
                        reject('失败了吧！');
                    }
                }
                xhr.send(null);
            });
        }

        // 拼接字符
        let queryHTML = function ({id, pic, title, price}) {
            return `<li>
                <div>
                    <a href="javascript:void(0)">
                        <img src="${pic}"/>
                    </a>
                </div>
                <h6>${title}</h6>
                <span class="price">${price}元</span>
            </li>`
        }

        // 绑定悬停显示隐藏
        let navHover = function (data) {
            // 小米手机数据
            let miuiPhoneStr = '';
            for (let i = 0; i < data.miuiPhone.length; i++) {
                let item = data.miuiPhone[i];
                miuiPhoneStr += queryHTML(item);
            }

            // 红米手机数据
            let redMiuiPhoneStr = '';
            for (let i = 0; i < data.redMiuiPhone.length; i++) {
                let item = data.redMiuiPhone[i];
                redMiuiPhoneStr += queryHTML(item);
            }

            // 电视数据
            let televisionStr = '';
            for (let i = 0; i < data.television.length; i++) {
                let item = data.television[i];
                televisionStr += queryHTML(item);
            }

            // 笔记本数据
            let notebookStr = '';
            for (let i = 0; i < data.notebook.length; i++) {
                let item = data.notebook[i];
                notebookStr += queryHTML(item);
            }

            // 盒子数据
            let boxStr = '';
            for (let i = 0; i < data.box.length; i++) {
                let item = data.box[i];
                boxStr += queryHTML(item);
            }

            // 新品数据
            let newStr = '';
            for (let i = 0; i < data.new.length; i++) {
                let item = data.new[i];
                newStr += queryHTML(item);
            }

            // 路由器数据
            let routerStr = '';
            for (let i = 0; i < data.router.length; i++) {
                let item = data.router[i];
                routerStr += queryHTML(item);
            }

            // 智能硬件数据
            let hardwareStr = '';
            for (let i = 0; i < data.hardware.length; i++) {
                let item = data.hardware[i];
                hardwareStr += queryHTML(item);
            }

            for (let i = 0; i < navItem.length; i++) {
                let item = navItem[i];
                item.addEventListener('mouseover', function (ev) {
                    ev = ev || window.event;
                    ev.stopPropagation ? ev.stopPropagation() : ev.cancelBubble = true;
                    addClass(navDown, 'pull');
                    i === 0 ? navDownCont.innerHTML = miuiPhoneStr : null;
                    i === 1 ? navDownCont.innerHTML = redMiuiPhoneStr : null;
                    i === 2 ? navDownCont.innerHTML = televisionStr : null;
                    i === 3 ? navDownCont.innerHTML = notebookStr : null;
                    i === 4 ? navDownCont.innerHTML = boxStr : null;
                    i === 5 ? navDownCont.innerHTML = newStr : null;
                    i === 6 ? navDownCont.innerHTML = routerStr : null;
                    i === 7 ? navDownCont.innerHTML = hardwareStr : null;
                })
            }
            document.body.addEventListener('mouseover', function () {
                removeClass(navDown, 'pull');
            })

            navDown.addEventListener('mouseover', function (ev) {
                ev = ev || window.event;
                ev.stopPropagation ? ev.stopPropagation() : ev.cancelBubble = true;
                addClass(navDown, 'pull');
            })
        }

        return {
            inti: function () {
                let promise = queryData();
                promise.then(navHover);
            }
        }
    })();
    headerNav.inti();

})();