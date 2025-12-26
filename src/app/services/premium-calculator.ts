import { Injectable } from '@angular/core';
import { UserHealthData } from '../model/user-health-data';

@Injectable({
  providedIn: 'root'
})
export class PremiumCalculatorService {

  constructor() { }

  calculatePremium(baseAmount: number, userData: UserHealthData): number {
    let premium = baseAmount;

    // Age-based calculation
    if (userData.age < 25) {
      premium *= 0.9; // 10% discount for young
    } else if (userData.age >= 25 && userData.age < 35) {
      premium *= 1.0; // Base rate
    } else if (userData.age >= 35 && userData.age < 45) {
      premium *= 1.2; // 20% increase
    } else if (userData.age >= 45 && userData.age < 55) {
      premium *= 1.5; // 50% increase
    } else if (userData.age >= 55) {
      premium *= 2.0; // 100% increase
    }

    // Earnings-based calculation
    if (userData.earnings > 1000000) {
      premium *= 1.1; // 10% increase for high earners
    }

    // Health conditions
    if (userData.hasPreExistingConditions) {
      premium *= 1.3; // 30% increase
    }

    if (userData.isSmoker) {
      premium *= 1.25; // 25% increase
    }

    if (userData.hasChronicDiseases) {
      premium *= 1.4; // 40% increase
    }

    // Discount for healthy lifestyle
    if (userData.exerciseRegularly && !userData.isSmoker) {
      premium *= 0.95; // 5% discount
    }

    return Math.round(premium);
  }
}