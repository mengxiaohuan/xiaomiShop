//BANNER
let bannerSlide = function () {
    new Banner({
        ele: '#banner',
        wrapper: 'ban-con',//轮播图盒子的class
        focus: 'point-row',//焦点的class
        arrowLeft: 'arrow-lt',//左箭头的class
        arrowRight: 'arrow-rt',//右箭头的class
        slide: 'sub-int',//每个轮播图的class
        url: '../json/banner.json',
        width: 1226,
        height: 460,
        // isAuto:false,
        // isArrow: true,
        isFocus: true,
        // isMouse: true,
        // defaultIndex:0,
        interval: 2000,
        speed: 1000,
        direction: 'horizontal',//水平(horizontal)或垂直(vertical)
        effect: 'fade',//普通切换(slide),淡入(fade）
    });
}();
//NAV
let navCategoryRender = function navCategoryRender() {
    let $slideShow = $(".slide-show"),
        $navShow = $(".navShow"),
        $navList = $navShow.find("li"),
        $navArea = $(".navArea");
    //GET NAV
    let getNav = function getNav() {
        return new Promise(resolve => {
            $.ajax({
                url: '../json/menu.json',
                method: "get",
                dataType: 'json',
                async: false,
                success: resolve
            })
        })
    };
    //BIND NAV
    let bindNav = function bindNav(navData) {
        let str = ``;
        navData.forEach(item => {
            let {id, kinds} = item;
            str += `<li><a href="javascript:;"></a><span class="txt" >${kinds}</span><i class="icon iconfont icon-jiantouarrow487 nomal arrow-w"></i></li>`;
        });
        $navShow.append(str);
        return navData;
    };
    let navDetailBox = function navDetailBox(navData) {
        let $navBox = $(".navBox"),
            $navArea = $navBox.find(".navArea");
        $(document).on("mouseover", function (ev) {
            let target = ev.target,
                tag = target.tagName,
                $parents = $(target).parents(),
                $targetText = $(target).parent("li").text();
            let flag = $parents.filter(".navBox").length > 0 ? true : false;
            if (tag === 'A' || tag === 'LI' && flag) {
                $navShow.find("li").removeClass("hover");
                $(target).parents("li").addClass("hover");
                navDetail(navData, $targetText);
                // $navArea.html($targetText);
                $navArea.css("display", "block");
                return;
            }
            $navArea.css("display", "none");
            $navShow.find("li").removeClass("hover");
        });
        $navArea.on("mouseover", function (ev) {
            ev.stopPropagation();
        });
        return navData;
    };
    let navDetail = function navDetail(navData, navIndex) {
        navData.forEach((item, index) => {
            let {kinds, details, id} = item;
            if (navIndex === item["kinds"]) {
                $navArea.html("");
                let subColumn = ``, strLi = ``;
                details.forEach((subItem, subIndex) => {
                    if (subIndex === 23) return;
                    let {imgUrl, name} = subItem;
                    if (subIndex % 6 === 0) {
                        $navArea.append(subColumn);
                        subColumn = ` `;
                        strLi = ``;
                    }
                    strLi += `<li><a href=""><img src="https://i1.mifile.cn/f/i/g/2015/cn-index/${imgUrl}"/><span class="tc">${name}</span></a></li>`;
                    subColumn = `<ul class="sub-column">${strLi}</ul>`;
                    if (subIndex === details.length - 1) {
                        $navArea.append(subColumn);
                        return;
                    }
                });
            }
        });
    };
    return {
        init: function () {
            let navPromise = getNav();
            navPromise.then(bindNav).then(navDetailBox);
        }
    }
}();
navCategoryRender.init();
