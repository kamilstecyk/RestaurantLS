import { Component } from '@angular/core';
import { HistoryRecord } from 'src/app/services/buy.service';
import { BuyService } from 'src/app/services/buy.service';
import { map } from 'rxjs';
import { ExchangeCurrencyService } from 'src/app/services/exchange-currency.service';

@Component({
  selector: 'app-shopping-history',
  templateUrl: './shopping-history.component.html',
  styleUrls: ['./shopping-history.component.scss']
})
export class ShoppingHistoryComponent {
  history_records: HistoryRecord[] = [];
  history_records_subscription: any;

  constructor(private buyService: BuyService, public exchangeCurrencyService: ExchangeCurrencyService)
  {
    this.getAllHistoryRecords();
  }

  getAllHistoryRecords()
  {
    this.history_records_subscription = this.buyService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ ...c.payload.val() })
        )
      )
    ).subscribe(data => {
        this.history_records = data;
        console.log(data);
      }
    )
  }

  getHistoryRecordFullPrice(record: HistoryRecord): String 
  {
    if(record.order_record?.amount_to_order)
      return this.exchangeCurrencyService.getPriceInDollars(record.order_record?.amount_to_order * Number(record.order_record?.price_per_dish));
    
    return "0.00";
  }

  ngOnDestroy(): void {
      if(this.history_records_subscription)
        this.history_records_subscription.unsubscribe();
  }
}
