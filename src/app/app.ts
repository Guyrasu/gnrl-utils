import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // 1. Import the plugin

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {
  protected readonly finishDate = signal(new Date());



  private tempo(theDate: string) {
    // Check if the string contains common time unit letters (s, m, h, d, w, y) case-insensitive
    const timeUnitRegex = /[smhdwy]/i;

    if (timeUnitRegex.test(theDate)) {
      console.log("It has a time unit letter!");

      // Example: You could parse it here or clean it up
      // const unit = value.match(/[smhdwy]/i)?.[0];
      // const number = parseInt(value, 10);
    } else {
      console.log("No time unit letter found. Assuming default (like minutes or milliseconds).");
    }

    dayjs.extend(relativeTime); // 2. Use it

    console.log(dayjs().to(dayjs(theDate))); // "36 years ago"
  }
}
