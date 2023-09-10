import { Component, OnDestroy } from '@angular/core';
import periodData from '../assets/period.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'période';
  periodData = periodData;
  currentPeriod: any;
  currentTime: Date = new Date();
  remainingMinutes!: number;
  remainingSeconds!: number;
  progress!: number;
  interval: any;
  cssClass: string = 'item-period';

  ngOnInit() {
    this.updateValues();
    this.interval = setInterval(() => {
      this.updateValues();
    }, 1000);
  }

  updateValues() {
    this.currentTime = new Date();
    this.setPeriod();
    if (this.currentPeriod) {
      const startTime = this.parseTime(this.currentPeriod.start);
      const endTime = this.parseTime(this.currentPeriod.end);
      const timeDifference = endTime.getTime() - this.currentTime.getTime();

      const timeRemainingInSeconds = Math.max(0, Math.floor(timeDifference / 1000));
      this.remainingMinutes = Math.floor(timeRemainingInSeconds / 60);
      this.remainingSeconds = timeRemainingInSeconds % 60;

      const totalTime = endTime.getTime() - startTime.getTime();
      const elapsedTime = this.currentTime.getTime() - startTime.getTime();
      this.progress = (elapsedTime / totalTime) * 100;
    }
  }

  parseTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const time = new Date();
    time.setHours(hours, minutes, 0);
    return time;
  }

  setPeriod() {
    const currentDayOfWeek = this.currentTime.getDay();

    if (currentDayOfWeek === 0 || currentDayOfWeek === 6) {
      this.currentPeriod = null;
      return;
    }

    for (let i = 0; i < this.periodData.length; i++) {
      const currentPeriod = this.periodData[i];

      const startTime = this.parseTime(currentPeriod.start);
      const endTime = this.parseTime(currentPeriod.end);

      if (startTime <= this.currentTime && this.currentTime <= endTime) {
        this.currentPeriod = currentPeriod;
        this.cssClass = 'item-period';
        if (currentPeriod.period == 'pause' || currentPeriod.period == 'Bientôt ...') {
          this.cssClass = 'item-pause';
        }
        return;
      }

    }

    this.currentPeriod = null;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
