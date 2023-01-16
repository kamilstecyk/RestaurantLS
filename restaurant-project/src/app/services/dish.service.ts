import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Dish } from '../models/dish.model';

@Injectable({
  providedIn: 'root'
})
export class DishService {
  private dbPath = '/dishes';
  dishesRef: AngularFireList<Dish>;

  constructor(private db: AngularFireDatabase) 
  {
    this.dishesRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<Dish> {
    return this.dishesRef;
  }

  create(dish: Dish): any {
    return this.dishesRef.push(dish);
  }

  update(key: string, value: any): Promise<void> {
    return this.dishesRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.dishesRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.dishesRef.remove();
  }
}
