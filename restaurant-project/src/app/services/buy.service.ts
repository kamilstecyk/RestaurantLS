import { Injectable } from '@angular/core';
import { OrderRecord } from './shopping-cart.service';
import { AngularFireList } from '@angular/fire/compat/database';
import { AngularFireDatabase } from '@angular/fire/compat/database';


export class HistoryRecord
{
  key?: string | null;
  order_record?: OrderRecord;
  date_of_order?: string;

  constructor(order_record: OrderRecord, date: string)
  {
    this.order_record = order_record;
    this.date_of_order = date;
  }
}
@Injectable({
  providedIn: 'root'
})
export class BuyService {
  private dbPath = '/orders';
  ordersRef: AngularFireList<HistoryRecord>;

  constructor(private db: AngularFireDatabase) 
  {
    this.ordersRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<HistoryRecord> {
    return this.ordersRef;
  }

  create(order_record: OrderRecord): any {
    return this.ordersRef.push(new HistoryRecord(order_record, this.getCurrentDate()));
  }

  update(key: string, value: any): Promise<void> {
    return this.ordersRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.ordersRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.ordersRef.remove();
  }

  private getCurrentDate(): string 
  {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
  }
}
