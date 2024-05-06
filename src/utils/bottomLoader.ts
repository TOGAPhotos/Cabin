export class BottomLoader {
    private timerList= <number[]>[];
    private readonly waitSeconds:number;
    private readonly scrollHandler:()=>void;

    private static isBottom(){
        let totalHeight = document.documentElement.scrollHeight
        let visibleHeight = document.documentElement.clientHeight
        let scrollPosition = window.scrollY || document.documentElement.scrollTop
        return scrollPosition + visibleHeight >= totalHeight - 1
    }

    constructor(callback: Function,waitSeconds: number = 2) {
        this.waitSeconds = waitSeconds;
        this.timerList = []

        this.scrollHandler = ()=> {
            if (BottomLoader.isBottom()) {
                this.timerList.push(setTimeout(callback, this.waitSeconds * 1000))
            } else {
                this.timerList.forEach(timer => clearTimeout(timer))
                this.timerList = []
            }
        }
        this.scrollHandler = this.scrollHandler.bind(this)
        window.addEventListener('scroll', this.scrollHandler)
    }

    cancel(){
        console.log('cancel')
        window.removeEventListener('scroll',this.scrollHandler)
    }

    reset(){
        window.addEventListener('scroll', this.scrollHandler)
    }

}