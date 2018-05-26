~(function () {

    //phone
    let phoneRender = function () {

        let $phone = $('.phone'),
            $leftA = $phone.find('.box-bd>.row>.left>a'),
            $phoneBox = $phone.find('.box-bd>.row>.right>ul');

        let queryData = function () {
            return new Promise(resolve => {
                $.ajax({
                    url: '../json/phone.json',
                    method:'get',
                    dataType:'json',
                    async:true,
                    success:resolve
                });
            });
        };

        let bindHTML = function (data) {
            if(typeof data == 'undefined') return;

            $.each(data, (index, item)=>{

                let {imgUrl, title, desc, newprice, oldprice=null, flag=null} = item;

                if(index == 0){
                    //第一张大图
                    $leftA.html(`<img src="${imgUrl}" alt="">`);
                    return;
                }

                flag = flag ? `<div class="flag f12">${flag}</div>` : '';
                oldprice = oldprice ? `<span class="del">${oldprice}元</span>` : '';

                let str = `<li class="brick-item">
                            ${flag}
                            <a href="javascript:;">
                                <img src="${imgUrl}" alt="">
                            </a>
                            <div class="f14 title">${title}</div>
                            <div class="f12 desc">${desc}</div>
                            <div class="f14 price">
                                <span>${newprice}元</span>
                                ${oldprice}
                            </div>
                        </li>`;
                $(str).appendTo($phoneBox);

            });

        };

        return {
            init:function () {
                let promise = queryData();
                promise.then(data=>{
                    bindHTML(data);
                });
            }
        }
    };

    phoneRender().init();


    //homeelec
    let homeelecRender = function () {

        let $homeelec = $('.homeelec'),
            $leftBox = $homeelec.find('.box-bd>.row>.left>ul'),
            $rightBox = $homeelec.find('.box-bd>.row>.right');

        let queryData = function () {

            return new Promise(resolve => {

                $.ajax({
                    url:'../json/homeelec.json',
                    method:'get',
                    dataType:'json',
                    async:true,
                    success:resolve
                });

            });
        };

        let bindHTML = function (data) {

            if(typeof data == 'undefined') return;

            $.each(data, (index, item)=> {

                let {imgUrl: leftUrl, hot = {}, movies = {}, computer = {}, furniture = {}} = item;

                //左侧两个图
                if (index <= 1) {

                    $(`<li class="brick-item">
                            <a href="javascript:;" class="clearfix">
                                <img src="${leftUrl}" alt="">
                            </a>
                        </li>`).appendTo($leftBox);

                    return;
                }

                //右侧
                if (index == 2) bind(hot);
                if (index == 3) bind(movies);
                if (index == 4) bind(computer);
                if (index == 5) bind(furniture);

            });
        };

        let bind = function (data) {

            let str = '<div class=\'dataBox\'><ul class="clearfix">';

            $.each(data, (i, cur)=>{

                let {imgUrl,
                    title,
                    desc,
                    newprice,
                    oldprice,
                    flag,
                    review='电视收到了，用了一段时间了，感觉挺好的，画质不错，性...',
                    author='来自于 Amy 的评价'
                } = cur;

                flag = flag ? `<div class="flag f12">${flag}</div>` : '';
                oldprice = oldprice ? `<span class="del">${oldprice}元</span>` : '';

                //最后一个json => 跟之前的class不一样
                if(i == data.length-1){
                    str += `<li class="brick-item brick-item-s">
                            <div class="title f14">
                                <span>${title}</span>
                                <div class="price">
                                    <span>${newprice}元</span>
                                </div>
                            </div>
                            <a href="javascript:;">
                                <img src="${imgUrl}" alt="">
                            </a>

                        </li>`;
                    return;
                }

                //除最后一个之外的
                str += `<li class="brick-item brick-item-m">
                            ${flag}
                            <a href="javascript:;">
                                <img src="${imgUrl}" alt="">
                            </a>
                            <div class="f14 title">${title}</div>
                            <div class="f12 desc">${desc}</div>
                            <div class="f14 price">
                                <span>${newprice}元</span>
                                ${oldprice}
                            </div>
                            <div class="review-wrapper">
                                <a href="javascript:;">
                                    <span class="review">${review}</span>
                                    <span class="author">${author}</span>
                                </a>
                            </div>
                        </li>`;

            });

            str += `<li class="brick-item brick-item-s">
                            <div class="title">
                                <span class="f18">浏览更多</span>
                                <span class="f12">家电</span>
                            </div>
                            <a href="javascript:;">
                                <i class="icon iconfont icon-youjiantou nomal"></i>
                            </a>

                        </li>`;

            str += '</ul></div>';
            console.log(str);

            $(str).appendTo($rightBox);
        };

        let changeTab = function () {

            new TabPlugin($homeelec[0], {
                customPageClass: 'more',
                customContentClass: 'dataBox',
                changeEnd: function (curLi, curCon, index, lastIndex) {

                }
            });
        };

        return {
            init: function () {
                let promise = queryData();

                promise.then(data=>{
                    bindHTML(data);
                }).then(()=>{
                    //tab
                    changeTab();
                });

            }
        }
    };

    homeelecRender().init();


    //smart
    let smartRender = function () {

        let $smart = $('.smart'),
            $leftBox = $smart.find('.box-bd>.row>.left>ul'),
            $rightBox = $smart.find('.box-bd>.row>.right');

        let queryData = function () {

            return new Promise(resolve => {

                $.ajax({
                    url:'../json/smart.json',
                    method:'get',
                    dataType:'json',
                    async:true,
                    success:resolve
                });

            });
        };

        let bindHTML = function (data) {

            if(typeof data == 'undefined') return;

            $.each(data, (index, item)=> {

                let {
                    imgUrl: leftUrl,
                    hot = {},
                    travel = {},
                    health = {},
                    coldplay = {},
                    router={}
                } = item;

                //左侧两个图
                if (index <= 1) {

                    $(`<li class="brick-item">
                            <a href="javascript:;" class="clearfix">
                                <img src="${leftUrl}" alt="">
                            </a>
                        </li>`).appendTo($leftBox);

                    return;
                }

                //右侧
                if (index == 2) bind(hot);
                if (index == 3) bind(travel);
                if (index == 4) bind(health);
                if (index == 5) bind(coldplay);
                if (index == 6) bind(router);
                console.log(hot);
                console.log(travel);
                console.log(health);
                console.log(coldplay);
                console.log(router);

            });
        };

        let bind = function (data) {

            let str = '<div class=\'dataBox\'><ul class="clearfix">';

            $.each(data, (i, cur)=>{

                let {imgUrl,
                    title,
                    desc,
                    newprice,
                    oldprice,
                    flag,
                    review='电视收到了，用了一段时间了，感觉挺好的，画质不错，性...',
                    author='来自于 Amy 的评价'
                } = cur;

                flag = flag ? `<div class="flag f12">${flag}</div>` : '';
                oldprice = oldprice ? `<span class="del">${oldprice}元</span>` : '';

                //最后一个json => 跟之前的class不一样
                if(i == data.length-1){
                    str += `<li class="brick-item brick-item-s">
                            <div class="title f14">
                                <span>${title}</span>
                                <div class="price">
                                    <span>${newprice}元</span>
                                </div>
                            </div>
                            <a href="javascript:;">
                                <img src="${imgUrl}" alt="">
                            </a>

                        </li>`;
                    return;
                }

                //除最后一个之外的
                str += `<li class="brick-item brick-item-m">
                            ${flag}
                            <a href="javascript:;">
                                <img src="${imgUrl}" alt="">
                            </a>
                            <div class="f14 title">${title}</div>
                            <div class="f12 desc">${desc}</div>
                            <div class="f14 price">
                                <span>${newprice}元</span>
                                ${oldprice}
                            </div>
                            <div class="review-wrapper">
                                <a href="javascript:;">
                                    <span class="review">${review}</span>
                                    <span class="author">${author}</span>
                                </a>
                            </div>
                        </li>`;

            });

            str += `<li class="brick-item brick-item-s">
                            <div class="title">
                                <span class="f18">浏览更多</span>
                                <span class="f12">家电</span>
                            </div>
                            <a href="javascript:;">
                                <i class="icon iconfont icon-youjiantou nomal"></i>
                            </a>

                        </li>`;

            str += '</ul></div>';

            $(str).appendTo($rightBox);
        };

        let changeTab = function () {

            new TabPlugin($smart[0], {
                customPageClass: 'more',
                customContentClass: 'dataBox',
                changeEnd: function (curLi, curCon, index, lastIndex) {

                }
            });
        };

        return {
            init: function () {
                let promise = queryData();

                promise.then(data=>{
                    bindHTML(data);
                }).then(()=>{
                    //tab
                    changeTab();
                });

            }
        }

    };

    smartRender().init();


})();