import { Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-resting-days',
  styleUrl: './resting-days.css',
  templateUrl: './resting-days.html',
})
export class RestingDays {
  private readonly targetDate = new Date('2026-04-27');
  finishDate = signal<string>(this.mountDate(this.targetDate));




  constructor() {

  }

  public calcDaysUntil(): void {
    const now = new Date();
    const diff = this.targetDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    console.log(days);
  }

  private mountDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  private unmountDate(date: string): Date {
    return new Date(date);
  }
}
