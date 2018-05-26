let utils = (function () {
    //=>获取样式
    let getCss = (ele, attr) => {
        let val = null,
            reg = /^-?\d+(\.\d+)?(px|rem|em)?$/;
        if ('getComputedStyle' in window) {
            val = window.getComputedStyle(ele)[attr];
            if (reg.test(val)) {
                val = parseFloat(val);
            }
        }
        return val;
    };

    //=>设置样式
    let setCss = (ele, attr, value) => {
        if (!isNaN(value)) {
            if (!/^(opacity|zIndex)$/.test(attr)) {
                value += 'px';
            }
        }
        ele['style'][attr] = value;
    };

    //=>批量设置样式
    let setGroupCss = (ele, options) => {
        for (let attr in options) {
            if (options.hasOwnProperty(attr)) {
                setCss(ele, attr, options[attr]);
            }
        }
    };

    //=>合并为一个
    let css = (...arg) => {
        let len = arg.length,
            fn = getCss;
        if (len >= 3) {
            fn = setCss;
        }
        if (len === 2 && typeof arg[1] === 'object') {
            fn = setGroupCss;
        }
        return fn(...arg);
    };

    let each = (obj, callback)=>{
        if('length' in obj){
            for (let i = 0; i < obj.length; i++) {
                let item = obj[i];
                callback && callback.call(item, i, item);
            }
        }else {
            for (let attr in obj) {
                if(!obj.hasOwnProperty(attr)) break;
                let item = obj[attr];
                callback && callback.call(item, attr, item);
            }
        }
    };

    return {css, each}
})();

~(function () {
    let effect = {
        Linear:(t,b,d,c)=> t/d*c+b
    };

    window.animate = (ele, target, duration=1000, callback=new Function())=> {

        if(typeof duration == 'function'){
            callback = duration;
            duration = 1000;
        }

        let begin = {},
            change = {},
            time = 0;
        utils.each(target, attr=>{
            begin[attr] = utils.css(ele, attr);
            change[attr] = target[attr] - begin[attr];
        });

        let timer = setInterval(()=>{

            if(time >= duration){
                clearInterval(timer);

                utils.css(ele, target);

                callback.call(ele);

                return;
            }

            time += 17;

            utils.each(target, attr=>{
                utils.css(ele, attr, effect.Linear(time, begin[attr], duration, change[attr]));
            });

        }, 17);
    };
})();