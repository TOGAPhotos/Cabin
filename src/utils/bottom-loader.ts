export class BottomLoader {
    private timerList: number[] = [];
    // private readonly waitSeconds:number;
    private readonly scrollHandler:()=>void;
    private counter = 0;
    // private runtimeLimit = 10;


    private static isBottom(){
        const {scrollHeight, clientHeight, scrollTop} = document.documentElement
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 1;
        return isNearBottom;
    }

    constructor(callback: Function, waitSeconds = 2, runtimeLimit = 4){
        
        if (waitSeconds < 0 || runtimeLimit < 0) {
            throw new Error('waitSeconds and runtimeLimit must be non-negative');
        }
        
        this.scrollHandler = () => {

            // if limit is 0 then it will run infinitely
            if(runtimeLimit > 0) this.counter++
            if(this.counter > runtimeLimit){
                return this.cancel()
            }

            if (! BottomLoader.isBottom()) {
                this.timerList.forEach(timer => clearTimeout(timer))
                this.timerList = []
                return;
            }
            if(this.timerList.length > 0) return;
            this.timerList.push(setTimeout(callback, waitSeconds * 1000))
        }
        this.scrollHandler = this.scrollHandler.bind(this)
        window.addEventListener('scroll', this.scrollHandler)
    }

    cancel(){
        console.log('cancel')
        this.timerList.forEach(timer => clearTimeout(timer))
        this.timerList = []
        window.removeEventListener('scroll', this.scrollHandler)
    }

    reset(){
        this.counter = 0;
        window.addEventListener('scroll', this.scrollHandler)
    }

}