export interface BookingModel{
    id?:number;
    name:string;
    city:string;
    phone:string;
    email:string;
    age:number | string;
    planId:number;
    planName:string;
    validity:number | string;
    paymentMode:string;
    cardNumber:string;
    premiumAmt:number;
    paymentFreq:string;
}