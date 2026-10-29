import { Component, signal, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription} from 'rxjs';
import { RouterOutlet } from '@angular/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // 1. Import the plugin
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  finishDate = signal<string>('');

  private inputSubject = new Subject<string>();
  private subscription!: Subscription;





  private tempo(theDate: string) {

    const shorthandRegex = /^[+-]?\d+[smhdwy]$/i;

    if (shorthandRegex.test(theDate)) {
      console.log("Valid shorthand duration string!");
      
      // Extract the parts if you want to use them:
      const unit = theDate.slice(-1).toLowerCase() as 's' | 'm' | 'h' | 'd' | 'w' | 'y'; // Gets the last character (e.g., 'm')
      const amount = parseInt(theDate, 10); // Gets the number (e.g., 1 or -5)
      
      // Now you can safely use it with Day.js:
      const futureDate = dayjs().add(amount, unit);
      this.finishDate.set(this.calculateRelativeTime(theDate) || '');
      return;

    } else {
      console.log("Invalid format.");
    }
    // Check if it's a valid standard date/time
    const isDateValid = dayjs(theDate).isValid();
  
    if (isDateValid) {
      console.log("This is a valid date/time!");
      dayjs.extend(relativeTime); // 2. Use it

      this.finishDate.set(this.getPreciseTimeAgo(theDate));
      console.log(dayjs().to(dayjs(theDate))); // "36 years ago"
    } else {
      console.log("Not a valid standard date.");
    }
  }




  calculateRelativeTime(input: string): string | null {
    // Trim whitespace and validate format: optional + or -, followed by digits, ending with a unit letter (s, m, h, d, w, y)
    const cleaned = input.trim();
    const regex = /^([+-]?)(\d+)([smhdwy])$/i;
    
    const match = cleaned.match(regex);
    if (!match) {
      return null; // Invalid format (e.g. doesn't match "+5d")
    }

    const [, sign, amountStr, unitChar] = match;
    let amount = parseInt(amountStr, 10);
    
    // If there's a minus sign, make the amount negative
    if (sign === '-') {
      amount = -amount;
    }
    // (If sign is '+' or empty, amount stays positive)

    // Map shorthand letters to Day.js unit names
    const unitMap: { [key: string]: string } = {
      s: 'second',
      m: 'minute',
      h: 'hour',
      d: 'day',
      w: 'week',
      y: 'year'
    };

    const unit = unitMap[unitChar.toLowerCase()];

    // Calculate the new date starting from "now"
    const resultDate = dayjs().add(amount, unit as any);

    // Return formatted date string (or resultDate.toISOString() / relative time)
    return resultDate.format('YYYY-MM-DD HH:mm:ss');
  }


  getPreciseTimeAgo(targetDate: string | Date): string {
    const now = dayjs();
    let target = dayjs(targetDate);
    
    // Determine if it's past or future
    const isPast = target.isBefore(now);
    if (!isPast) {
      // Swap if you want to measure "from now until future"
      // For simplicity, let's look at absolute difference
    }

    // Calculate years, months, days step-by-step
    const years = now.diff(target, 'year');
    target = target.add(years, 'year');

    const months = now.diff(target, 'month');
    target = target.add(months, 'month');

    const days = now.diff(target, 'day');

    // Build the readable string parts
    const parts: string[] = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    if (days > 0 || parts.length === 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);

    // Join them nicely with commas and "and"
    let result = '';
    if (parts.length === 1) {
      result = parts[0];
    } else if (parts.length === 2) {
      result = `${parts[0]} and ${parts[1]}`;
    } else {
      result = `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
    }

    return `${result} ago`;
  }


    ngOnInit() {
    // Wait for 600ms of inactivity after the last edit before running tempo()
    this.subscription = this.inputSubject.pipe(
      debounceTime(600)
    ).subscribe((value) => {
      this.tempo(value);
    });
  }

  onInput(value: string) {
    // Push every keystroke into the subject stream
    this.inputSubject.next(value);
  }


  ngOnDestroy() {
    // Clean up subscription to prevent memory leaks
    this.subscription.unsubscribe();
  }

}
