class TimerUtil {
  private static instance: TimerUtil;
  private timer: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): TimerUtil {
    if (!TimerUtil.instance) {
      TimerUtil.instance = new TimerUtil();
    }
    return TimerUtil.instance;
  }

  formatTime(ms: number | null): string {
    if (ms == null) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0",
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  parseTimeToMs(timeStr: string): number {
    const [h, m, s] = timeStr.split(":").map(Number);
    if ([h, m, s].some((n) => Number.isNaN(n))) return 0;
    return ((h ?? 0) * 3600 + (m ?? 0) * 60 + (s ?? 0)) * 1000;
  }

  startTimer(callback: () => void, interval: number) {
    if (this.timer) {
      // console.log("Clearing existing timer");
      clearInterval(this.timer);
    }

    // console.log("Starting timer with interval: ", interval);
    this.timer = setTimeout(callback, interval);
  }
}

const timerUtil = TimerUtil.getInstance();
export default timerUtil;
