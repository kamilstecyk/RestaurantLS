import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExchangeCurrencyService {

  constructor() { }

  public getPriceInDollars(price: number | undefined ): String
  { 
    if(price == undefined)
    {
      return "";
    }

    return (price * 0.23).toFixed(2) + "$";
  }
}
