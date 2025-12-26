import { Component, OnInit, signal } from '@angular/core';
import { InsuranceService } from '../../services/insurance';
import { Router } from '@angular/router';
import { Plan } from '../../model/plan';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-plans',
  imports: [CommonModule,Navbar],
  templateUrl: './plans.html',
  styleUrl: './plans.css',
})
export class Plans{
  plans=signal<Plan[]>([])
  loading=signal<boolean>(true);
  error: string = '';

  constructor(
    private insuranceService: InsuranceService,
    private router: Router
  ) { 

    this.loadPlans();
  }

  // ngOnInit(): void {
  //   this.loadPlans();
  // }

  loadPlans(): void {
    this.loading.set(true);
    this.insuranceService.getAllPlans().subscribe({
      next: (data) => {
        console.log("data kehende",data);
        
        this.plans.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error = 'Failed to load insurance plans. Please ensure the JSON server is running.';
        this.loading.set(false);
        console.error('Error loading plans:', err);
      }
    });
  }

  viewPlanDetails(planId: number): void {
    this.router.navigate(['/plan-details', planId]);
  }
}
