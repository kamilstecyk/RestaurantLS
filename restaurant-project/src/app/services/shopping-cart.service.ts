import { Injectable } from '@angular/core';
import { Dish } from '../models/dish.model';
import { ReplaySubject } from 'rxjs';

export class OrderRecord
{
  dish_key?: string | null;
  amount_to_order: number;
  max_amount_to_order: number;
  price_per_dish: number;
  dish_name: string;

  constructor(key: string, max_amount: number, price: number, name: string)
  {
    this.amount_to_order = 1;
    this.dish_key = key;
    this.max_amount_to_order = max_amount;
    this.price_per_dish = price;
    this.dish_name = name;
  }

  getAvailableAmount():number
  {
    return this.max_amount_to_order - this.amount_to_order;
  }

  getOrderedAmount(): number 
  {
    return this.amount_to_order;
  }

  incrementAmount(): boolean
  {
    if(this.getAvailableAmount() > 0)
    {
      ++this.amount_to_order;
      return true;
    }

    return false;
  }

  decrementAmount():boolean
  {
    if(this.amount_to_order > 0)
    {
      --this.amount_to_order;
      return true;
    }

    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private ordered_dishes: OrderRecord[] = [];
  private currently_ordered_dishes = new ReplaySubject(1);
  private currently_number_of_items_in_cart = new ReplaySubject(1);

  constructor() { }

  addDish(dish: Dish): boolean
  {
    for(let record of this.ordered_dishes)
    {
      if(record.dish_key === dish.key)
      {
        const was_added = record.incrementAmount();
        if(was_added)
        {
          console.log("Dish amount has just been incresed in shopping cart");
        }
        else 
        {
          console.log("You reached max amount available to order of this dish");
        }

        this.currently_ordered_dishes.next(this.ordered_dishes);
        this.currently_number_of_items_in_cart.next(this.getHowManyOrderedItems());
        
        return was_added;
      }
    }

    if(dish.key && dish.max_amount && dish.price && dish.name)
    {
      this.ordered_dishes.push(new OrderRecord(dish.key, dish.max_amount, dish.price, dish.name));
      this.currently_ordered_dishes.next(this.ordered_dishes);
      this.currently_number_of_items_in_cart.next(this.getHowManyOrderedItems());
      console.log("First order of this dish just has been added");

      return true;
    }
    
    return false;
  }

  add(key: string, max_amount: number, price: number, name: string): boolean
  {
    for(let record of this.ordered_dishes)
    {
      if(record.dish_key === key)
      {
        const was_added = record.incrementAmount();
        if(was_added)
        {
          console.log("Dish amount has just been incresed in shopping cart");
        }
        else 
        {
          console.log("You reached max amount available to order of this dish");
        }

        this.currently_ordered_dishes.next(this.ordered_dishes);
        this.currently_number_of_items_in_cart.next(this.getHowManyOrderedItems());
        
        return was_added;
      }
    }

      this.ordered_dishes.push(new OrderRecord(key, max_amount,price, name));
      this.currently_ordered_dishes.next(this.ordered_dishes);
      this.currently_number_of_items_in_cart.next(this.getHowManyOrderedItems());
      console.log("First order of this dish just has been added");
      return true;
  }

  removeDish(dish: Dish): boolean
  {
    for(let [index,record] of this.ordered_dishes.entries())
    {
      if(record.dish_key === dish.key)
      {
        const was_removed = record.decrementAmount();
        // this means that we have 0 ordered amount of particular dish 
        if(was_removed)
        {
          console.log("Decreased amount of dish in shopping cart");
        }

        if(record.amount_to_order == 0)
        {
          this.ordered_dishes.splice(index,1);
          console.log("Dish has just been removed totally from cart");
        }

        this.currently_ordered_dishes.next(this.ordered_dishes);
        this.currently_number_of_items_in_cart.next(this.getHowManyOrderedItems());
        return was_removed;
      }
    }

    console.log("This dish does not exists yet in shopping cart!");
    return false;
  }

  remove(key: string): boolean
  {
    for(let [index,record] of this.ordered_dishes.entries())
    {
      if(record.dish_key === key)
      {
        const was_removed = record.decrementAmount();
        // this means that we have 0 ordered amount of particular dish 
        if(was_removed)
        {
          console.log("Decreased amount of dish in shopping cart");
        }

        if(record.amount_to_order == 0)
        {
          this.ordered_dishes.splice(index,1);
          console.log("Dish has just been removed totally from cart");
        }

        this.currently_ordered_dishes.next(this.ordered_dishes);
        this.currently_number_of_items_in_cart.next(this.getHowManyOrderedItems());
        return was_removed;
      }
    }

    console.log("This dish does not exists yet in shopping cart!");
    return false;
  }

  public removeDishOrderAfterDeletingFromMenu(dish_key: string): boolean
  {
    
    for(let [index,record] of this.ordered_dishes.entries())
    {
      if(record.dish_key === dish_key)
      {
        this.ordered_dishes.splice(index,1);
        this.currently_ordered_dishes.next(this.ordered_dishes);
        this.currently_number_of_items_in_cart.next(this.getHowManyOrderedItems());
        console.log("Dish has just been removed totally from cart");
        return true;
      }
    }

    return false;
  }

  getSumOfOrder(): string
  {
    return this.ordered_dishes.reduce((accumulator, record) => accumulator + (record.amount_to_order * Number(record.price_per_dish)), 0).toFixed(2);;
  }

  private getHowManyOrderedItems(): number 
  {
    return this.ordered_dishes.reduce((accumulator, record) => accumulator + record.amount_to_order, 0);
  }

  public getCurrentNumberOfItemsInCart():ReplaySubject<any> 
  {
    return this.currently_number_of_items_in_cart;
  }

  public getCurrenltyOrderedDishes():ReplaySubject<any>
  {
    return this.currently_ordered_dishes;
  }

  public resetShoppingCart()
  {
    this.ordered_dishes.splice(0);
    this.currently_ordered_dishes.next(this.ordered_dishes);
    this.currently_number_of_items_in_cart.next(this.getHowManyOrderedItems());
  }
}
