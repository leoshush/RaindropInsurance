import { Component ,signal} from '@angular/core';
import { UserHealthData } from '../../model/user-health-data';
import { Plan } from '../../model/plan';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InsuranceService } from '../../services/insurance';
import { PremiumCalculatorService } from '../../services/premium-calculator';
import { Navbar } from '../navbar/navbar';

declare var bootstrap:any;

@Component({
  selector: 'app-plan-details',
  imports: [CommonModule,FormsModule,Navbar],
  standalone:true,
  templateUrl: './plan-details.html',
  styleUrl: './plan-details.css',
})
export class PlanDetails {
  
  
 plan = signal<Plan | null>(null);
  loading = signal<boolean>(true);
  error: string = '';

  userHealthData: UserHealthData = {
    age: 0,
    earnings: 0,
    hasPreExistingConditions: false,
    isSmoker: false,
    hasChronicDiseases: false,
    exerciseRegularly: false
  };

  currentQuestion = signal<number>(0);
  questionsCompleted = signal<boolean>(false);
  calculatedPremium = signal<number>(0);

  // If you still want a pure Angular overlay, you can keep this.
  // For Bootstrap modal approach, we won't use isQuestionnaireOpen.
  isQuestionnaireOpen = false;

  questions = [
    { id: 1, question: 'What is your age?', type: 'number', field: 'age', placeholder: 'Enter your age', min: 18, max: 100, errorMsg: 'Age must be between 18 and 100' },
    { id: 2, question: 'What is your annual earnings (in ₹)?', type: 'number', field: 'earnings', placeholder: 'Enter your annual earnings', min: 0, errorMsg: 'Earnings cannot be negative' },
    { id: 3, question: 'Do you have any pre-existing medical conditions?', type: 'boolean', field: 'hasPreExistingConditions' },
    { id: 4, question: 'Are you a smoker?', type: 'boolean', field: 'isSmoker' },
    { id: 5, question: 'Do you have any chronic diseases (diabetes, hypertension, etc.)?', type: 'boolean', field: 'hasChronicDiseases' },
    { id: 6, question: 'Do you exercise regularly (at least 3 times a week)?', type: 'boolean', field: 'exerciseRegularly' }
  ];

  tempValue: any = '';
  validationError: string = '';

  // Reference to the modal instance
  private questionModal!: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private insuranceService: InsuranceService,
    private premiumCalculator: PremiumCalculatorService
  ) {
    const planId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPlanDetails(planId);
  }

  ngOnInit(): void {
    const planId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPlanDetails(planId);
  }

  // ====== Fetch plan then open questionnaire ======
  loadPlanDetails(planId: number): void {
    this.loading.set(true);
    this.insuranceService.getPlanById(planId).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.plan.set(data[0]);
          this.loading.set(false);

          // ✅ Open questionnaire BEFORE showing plan details
          this.startQuestionnaire();
          this.isQuestionnaireOpen = true;
        } else {
          this.error = 'Plan not found';
          this.loading.set(false);
        }
      },
      error: (err) => {
        this.error = 'Failed to load plan details';
        this.loading.set(false);
        console.error('Error loading plan:', err);
      }
    });
  }

 

  closeQuestionnaireModal(): void {
    if (this.questionModal) {
      this.questionModal.hide();
    }
  }

  /** ===== Questionnaire flow ===== */
  startQuestionnaire(): void {
    this.currentQuestion.set(0);
    this.questionsCompleted.set(false);
    this.tempValue = '';
    this.validationError = '';
    
     this.isQuestionnaireOpen = true;
  }

  closeQuestionnaire(): void {
   
    this.isQuestionnaireOpen = false;
  }

  getCurrentQuestion() {
    return this.questions[this.currentQuestion()];
  }

  validateInput(): boolean {
    this.validationError = '';
    const question = this.getCurrentQuestion();

    if (question.type === 'number') {
      const value = Number(this.tempValue);
      if (!this.tempValue || isNaN(value)) {
        this.validationError = 'Please enter a valid number';
        return false;
      }
      if (question.min !== undefined && value < question.min) {
        this.validationError = question.errorMsg || `Value must be at least ${question.min}`;
        return false;
      }
      if (question.max !== undefined && value > question.max) {
        this.validationError = question.errorMsg || `Value must be at most ${question.max}`;
        return false;
      }
    } else if (question.type === 'boolean') {
      if (this.tempValue !== 'yes' && this.tempValue !== 'no') {
        this.validationError = 'Please select Yes or No';
        return false;
      }
    }

    return true;
  }

  nextQuestion(): void {
    if (!this.validateInput()) return;

    const question = this.getCurrentQuestion();
    if (question.type === 'number') {
      (this.userHealthData as any)[question.field] = Number(this.tempValue);
    } else if (question.type === 'boolean') {
      (this.userHealthData as any)[question.field] = this.tempValue === 'yes';
    }

    this.tempValue = '';
    this.validationError = '';

    const idx = this.currentQuestion();
    if (idx < this.questions.length - 1) {
      this.currentQuestion.set(idx + 1);
    } else {
      this.completeQuestionnaire();
    }
  }

  previousQuestion(): void {
    const idx = this.currentQuestion();
    if (idx > 0) {
      this.currentQuestion.set(idx - 1);
      this.validationError = '';
      const question = this.getCurrentQuestion();
      const value = (this.userHealthData as any)[question.field];

      if (question.type === 'boolean') {
        this.tempValue = value ? 'yes' : 'no';
      } else {
        this.tempValue = value;
      }
    }
  }

  completeQuestionnaire(): void {
    const currentPlan = this.plan();
    if (currentPlan) {
      const premium = this.premiumCalculator.calculatePremium(
        currentPlan.baseAmt,
        this.userHealthData
      );
      this.calculatedPremium.set(premium);
      this.questionsCompleted.set(true);
    }

    this.isQuestionnaireOpen = false;
  }

  /** ===== Router navigation ===== */
  proceedToBooking(): void {
    const currentPlan = this.plan();
    if (currentPlan) {
      this.router.navigate(['/booking'], {
        state: {
          plan: currentPlan,
          premium: this.calculatedPremium(),
          userHealthData: { ...this.userHealthData }
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/plans']);
  }


}
