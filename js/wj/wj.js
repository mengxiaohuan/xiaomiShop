/**
 * Created by 王将 on 2018/5/20.
 */
/*
/*
let bannerRender=(function () {
    let header=document.querySelector('.wj-header'),
        headerList=header.querySelectorAll('li'),
        container=document.querySelector('.wj-container'),
        licon = container.querySelector('.wj-licon'),
        liconList = null;
    let data=null;
    let queryData=function queryData() {
             let xhr=new XMLHttpRequest;
             xhr.open('GET','../json/package.json',false);
             xhr.onreadystatechange=()=> {
                 if (xhr.readyState === 4 && xhr.status === 200) {
                     data = JSON.parse(xhr.responseText);
                 }
             };
             xhr.send(null);
    };
     let bindData=function bindData(data) {
        let str=``;
       let productdata= [].slice.call(data);
        productdata.forEach((item,index)=>{
      let {pic,title,price}=item;
          str+=`<li>
                    <div><a href=""><img src="${pic}" alt=""></a></div>
                    <h3><a href="">${title}</a></h3>
                    <p class="wj-ptop">${title}</p>
                    <p class="wj-pdop">${title}</p>
                    <div class="wj-yincang"><a href=""><span class="wj-span1">${title}</span>
                        <span class="wj-span2">${title}</span>
                    </a></div>
                </li>`
        });
        licon.innerHTML=str;
        liconList=licon.querySelectorAll('li');
        /!*utils.css(licon,'width',liconList.length*956);*!/
    };


     let swiperInit=function () {
         let swiper=new Swiper('.wj-lipic',{
             loop:true,
         })
     };

 /*  let stepIndex=0,
      autoTimer=null,
       interval=3000;*/
/*   let autoMove=function () {
   animate(licon,{
       left:-stepIndex*956
   },200)
   };*/


/*    return {
        init:function () {
  queryData();
  bindData(data);
swiperInit();
/!*bannerLicon();*!/
        }
    }
})();
bannerRender.init();*!/*/

let banner = (function () {
    let $wrapper = $('.wrapper'),
        $leftBox = $wrapper.find('.wj-container>.wj-pic'),
        $rightBox = $wrapper.find('.wj-container>.wj-lipic>.wj-licon');
    let queryData = function () {
        return new Promise(resolve => {
            $.ajax({
                url: '../json/tsconfig.json',
                method: "GET",
                dataType: 'json',
                success: resolve
            });
        });
    };
    let bindHTML = function (data) {
        $.each(data, (index, item) => {
            let {imgUrl: leftUrl, hot = {}, len = {}, pic = {}, pon = {}} = item;
            if (index <= 1) {
                $(`<li><a href=""><img src="${leftUrl}" alt=""></a></li>`).appendTo($leftBox);
                return;
            }
            if (index == 2) bind(hot);
            if (index == 3) bind(len);
            if (index == 4) bind(pic);
            if (index == 5) bind(pon);
        })
    };
    let bind = function (data) {
        let str = '<div class=\'dataBox\'><ul class="clearfix">';
        $.each(data, (i, cur) => {
            let {
                imgUrl,
                title,
                newprice
            } = cur;
            /*oldprice=oldprice?``*/
            if (i == data.length - 1) {
                str += `<li class="last">
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
            str += `<li class="active">
                    <div><a href=""><img src="${imgUrl}" alt=""></a></div>
                    <h3><a href="">${title} </a></h3>
                    <p class="wj-ptop">${newprice}元</p>
                    <p class="wj-pdop">225人评价</p>
                    <div class="wj-yincang"><a href=""><span class="wj-span1">还不错，就是底部未包括</span>
                        <span class="wj-span2">来自于20人的评价</span>
                    </a></div>
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
        // console.log(str);
        $(str).appendTo($rightBox);
    };

    let changeTab = function () {

        new TabPlugin($wrapper[0], {
            customPageClass: 'wj-right',
            customContentClass: 'dataBox',
            changeEnd: function (curLi, curCon, index, lastIndex) {

            }
        })
    };


    return {
        init: function () {
            let promise = queryData();
            promise.then(data => {
                bindHTML(data)
            }).then(() => {
                changeTab();
            })
        }
    }
})();
banner.init();






























