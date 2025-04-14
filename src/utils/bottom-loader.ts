export class BottomLoader {
  private timerList: NodeJS.Timeout[] = [];
  // private readonly waitSeconds:number;
  private readonly scrollHandler: () => void;
  private counter = 0;
  // private runtimeLimit = 10;

  private static isBottom() {
    const { scrollHeight, clientHeight, scrollTop } = document.documentElement;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 1;
    return isNearBottom;
  }

  constructor(callback: Function, waitSeconds = 2, runtimeLimit = 4) {
    if (waitSeconds < 0 || runtimeLimit < 0) {
      throw new Error("waitSeconds and runtimeLimit must be non-negative");
    }

    this.scrollHandler = () => {
      if (!BottomLoader.isBottom()) {
        if (this.timerList.length > 1) {
          this.counter -= this.timerList.length;
        }
        this.clearTimerList();
        return;
      }

      console.log(this.counter);
      if (this.counter > runtimeLimit) {
        return this.cancel();
      }

      if (this.timerList.length > 0) return;

      const timer = setTimeout(() => {
        callback();
        this.counter++;
        this.clearTimerList();
      }, waitSeconds * 1000);

      this.timerList.push(timer);
    };
    this.scrollHandler = this.scrollHandler.bind(this);
    window.addEventListener("scroll", this.scrollHandler);
  }

  clearTimerList() {
    this.timerList.forEach((timer) => clearTimeout(timer));
    this.timerList = [];
  }

  cancel() {
    this.clearTimerList();
    window.removeEventListener("scroll", this.scrollHandler);
  }

  reset() {
    this.counter = 0;
    window.addEventListener("scroll", this.scrollHandler);
  }
}
