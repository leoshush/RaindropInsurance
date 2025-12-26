import { Component, OnInit } from '@angular/core';
import { Booking } from '../booking/booking';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingModel } from '../../model/bookingModel';


@Component({
  selector: 'app-success',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './success.html',
  styleUrl: './success.css',
})
export class Success implements OnInit{
 booking: BookingModel | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.booking = navigation.extras.state['booking'];
    }
  }

  ngOnInit(): void {
    if (!this.booking) {
      this.router.navigate(['/']);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  viewPlans(): void {
    this.router.navigate(['/plans']);
  }

  printConfirmation(): void {
    window.print();
  }
}
