import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Plan } from '../../model/plan';
import { Router } from '@angular/router';
import { InsuranceService } from '../../services/insurance';
import { CommonModule } from '@angular/common';
import { BookingModel } from '../../model/bookingModel';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-booking',
  imports: [CommonModule,ReactiveFormsModule,Navbar],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit{
   bookingForm!: FormGroup;
  plan: Plan | null = null;
  premium: number = 0;
  loading: boolean = false;
  submitted: boolean = false;

  paymentModes = ['Credit Card', 'Debit Card', 'Net Banking', 'UPI'];
  paymentFrequencies = ['Yearly', 'Half Yearly', 'Quarterly', 'Monthly'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private insuranceService: InsuranceService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.plan = navigation.extras.state['plan'];
      this.premium = navigation.extras.state['premium'];
    }
  }

  ngOnInit(): void {
    if (!this.plan || !this.premium) {
      this.router.navigate(['/plans']);
      return;
    }

    this.initializeForm();
  }

  initializeForm(): void {
    this.bookingForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      paymentMode: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{4}-[0-9]{4}-[0-9]{4}$/)]],
      paymentFreq: ['', Validators.required]
    });
  }

  get f() {
    return this.bookingForm.controls;
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 12) {
      value = value.substr(0, 12);
    }
    const formatted = value.match(/.{1,4}/g)?.join('-') || value;
    this.bookingForm.patchValue({ cardNumber: formatted }, { emitEvent: false });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.bookingForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (!this.plan) return;

    this.loading = true;

    const bookingData: BookingModel = {
      name: this.bookingForm.value.name,
      city: this.bookingForm.value.city,
      phone: this.bookingForm.value.phone,
      email: this.bookingForm.value.email,
      age: this.bookingForm.value.age,
      planId: this.plan.planId,
      planName: this.plan.planName,
      validity: this.plan.validity,
      paymentMode: this.bookingForm.value.paymentMode,
      cardNumber: this.bookingForm.value.cardNumber,
      premiumAmt: this.premium,
      paymentFreq: this.bookingForm.value.paymentFreq
    };

    this.insuranceService.bookInsurance(bookingData).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/success'], {
          state: { booking: response }
        });
      },
      error: (err) => {
        this.loading = false;
        alert('Booking failed. Please try again or ensure JSON server is running.');
        console.error('Booking error:', err);
      }
    });
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel? Your data will be lost.')) {
      this.router.navigate(['/plans']);
    }
}
}
