// src/config.js
export default {
    danmakuConfig: {
        loop: true,//弹幕循环
        channels: 0,//轨道数量,0则轨道数为容器可容纳最高轨道数
        speeds: 80,//弹幕速度（每秒移动的像素数）
        debounce: 500,//弹幕刷新频率(ms)
        isSuspend: true//是否开启弹幕悬浮暂停
    }
};
