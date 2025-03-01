export default class Device{
    static getWidth(){
        return window.innerWidth;
    }
    static getHeight(){
        return window.innerHeight;
    }
    
    static isDesktop(){
        return !this.isPhone();
    }
    
    static isPhone(){
        const userAgent = navigator.userAgent || navigator.vendor;
        const phoneRegex = /iPhone|iPod|Android.*Mobile|BlackBerry|IEMobile|Opera Mini/i;
        return phoneRegex.test(userAgent);
    }

}