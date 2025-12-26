import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from '../model/plan';
import { BookingModel } from '../model/bookingModel'
@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Get all plans
  getAllPlans(): Observable<Plan[]> {
    console.log("HI in service");
    
    return this.http.get<Plan[]>(this.apiUrl+"/plans");
  }

  // Get plan by ID
  getPlanById(planId: number): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.apiUrl}/plans?planId=${planId}`);
  }

  // Book insurance
  bookInsurance(booking: BookingModel): Observable<BookingModel> {
    return this.http.post<BookingModel>(`${this.apiUrl}/bookings`, booking);
  }

  // Get all bookings
  getAllBookings(): Observable<BookingModel[]> {
    return this.http.get<BookingModel[]>(`${this.apiUrl}/bookings`);
  }
}