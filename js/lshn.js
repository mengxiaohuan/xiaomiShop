let falshRender = (function () {
    let goodsWrapper = document.querySelector('.goodsWrapper'),
        goodsList = null,
        goodsData = null,
        promptBox = document.getElementById('prompt'),
        timeTitle = document.getElementById('timeTitle'),
        // timeBox=document.querySelector('.timeBox'),
        // hourBox=timeBox.getElementsByClassName('.hourBox'),
        // minuteBox=timeBox.getElementsByClassName('.minuteBox'),
        // secondBox=timeBox.getElementsByClassName('.minuteBox'),
        hourBox = document.querySelector('.hour'),
        minuteBox = document.querySelector('.minute'),
        secondBox = document.querySelector('.second'),
        xmControl = document.querySelector('.xmControl'),
        xmLeft=document.querySelector('.xmLeft'),
        xmRight=document.querySelector('.xmRight');


    // getData
    let getData = function getData() {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('get', '../json/flash.json', false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    goodsData = JSON.parse(xhr.responseText);
                    resolve(goodsData);
                }
            };
            xhr.send(null);
        })
    };
    //bindHTML
    let bindHTML = function bindHTML(goodsData) {
        let str = ``;
        goodsData.forEach((item, index) => {
            let {img, title, desc, price, delPrice} = item;
            str += `<li class="goods1">
                    <img src="${img}" alt="">
                    <h3 class="${title}">${title}</h3>
                    <p class="${desc}">${desc}</p>
                    <p class="${price}"><span>${price}</span><span>元</span>&nbsp;  <del>${delPrice}元</del></p></li>`;

        });
        goodsWrapper.innerHTML = str;
        goodsList = goodsWrapper.querySelectorAll('li');
    };
    //countTime
    let countTime = function countTime() {
        let targetTime = new Date('2018/6/22  22:00:00'),
            nowTime = new Date();
        lastTime = targetTime - nowTime;
        //为场次添加title
        let _targetTime = targetTime,
            _hour = _targetTime.getHours(),
            _minute = _targetTime.getMinutes();

        //格式化时间
        _hour < 10 ? _hour = '0' + _hour : null;
        _minute < 10 ? _minute = '0' + _minute : null;

        timeTitle.innerHTML = _hour + ":" + _minute + "场";

        //如果剩余时间小于0，则说明 此时以到到达抢购时间
        if (lastTime <= 0) {
            //清除定时器，提示“请开始抢购！”
            promptBox.innerHTML = '可以开始抢购啦！';
            clearInterval(timer);
            return;
        }
        //否则，进行倒计时。计算出hour,minute,second
        let hour = Math.floor(lastTime / (1000 * 60 * 60));
        lastTime = lastTime - hour * 60 * 60 * 1000;
        let minute = Math.floor(lastTime / (1000 * 60));
        lastTime = lastTime - minute * 60 * 1000;
        let second = Math.floor(lastTime / 1000);
        //格式化数据
        hour < 10 ? hour = '0' + hour : null;
        minute < 10 ? minute = '0' + minute : null;
        second < 10 ? second = '0' + second : null;
        //插入页面
        hourBox.innerHTML = hour;
        minuteBox.innerHTML = minute;
        secondBox.innerHTML = second;
    };
    //handleArrow
    let handleArrow = function handleArrow() {
        let curL=utils.css(goodsWrapper,'left');
        //向左移动
        xmRight.onclick = function () {
             curL -= utils.css(goodsWrapper,'width')/2;
             if(curL<=-(utils.css(goodsWrapper,'width')/2)){
                 curL=-utils.css(goodsWrapper,'width')/2;
                 utils.css(goodsWrapper,{'left':curL});
             }
             utils.css(goodsWrapper,{'left':curL});
             console.log(curL);
            // console.log(wrapperLength);
            // index --;
            // if (index <0) {
            //     //说明此时已经超出边界了
            //     index=0;
            //     goodsWrapper.style.left=0+'px';
            //     return;
            // }
            // console.log(-goodsBoxWidth*4*index);
            // // goodsWrapper.style.left=-(goodsBoxWidth*4*index)+'px';
            // utils.css('goodsWrapper','left',-(goodsBoxWidth*4*index));
            // animate(goodsWrapper, {left: -(goodsBoxWidth*4*index)}, speed);
        };
        //向右移动
        xmLeft.onclick = function () {
            curL+=utils.css(goodsWrapper,'width')/2;

            if(curL>=0){
                curL=0;
                // curL=utils.css(goodsWrapper,'width')/2;
                utils.css(goodsWrapper,{'left':curL})
            }
            utils.css(goodsWrapper,{'left':curL});
            console.log(curL);
            // console.log(wrapperLength);
            // index++;
            // if(index>wrapperLength/4){
            //     //如果大于wrapperLength，则说明在向左移动4个goodsBoxWidth的时候，到达边界了。
            //     index = wrapperLength/4;
            //     goodsWrapper.style.left=-(wrapperLength/4-index)*goodsBoxWidth+'px';
            //     return;
            // }
            // console.log(goodsBoxWidth * index);
            // // goodsWrapper.style.left=-(goodsBoxWidth*4*index)+'px';
            // utils.css('goodsWrapper','left',-(goodsBoxWidth*4*index));
            // animate(goodsWrapper, {left: -(goodsBoxWidth*4*index)}, speed);
        }
    };

    return {
        init: function init() {
            let promise = getData();
            promise.then(
                bindHTML,
                timer = setInterval(countTime, 1000)
            ).then(
                handleArrow
            )
        }
    }
})();

falshRender.init();