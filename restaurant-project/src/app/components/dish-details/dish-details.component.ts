import { Component } from '@angular/core';
import { DishService } from 'src/app/services/dish.service';
import { map } from 'rxjs';
import { Dish } from 'src/app/models/dish.model';
import {ActivatedRoute} from '@angular/router';
import { DishWithItShoppingState } from '../dishes/dishes.component';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { OrderRecord } from 'src/app/services/shopping-cart.service';
import { ExchangeCurrencyService } from 'src/app/services/exchange-currency.service';

@Component({
  selector: 'app-dish-details',
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.scss']
})
export class DishDetailsComponent {
  dish: Dish;
  dish_key: string;

  dish_record: DishWithItShoppingState = new DishWithItShoppingState();
  currently_ordered_dishes_subscription: any;

  constructor(private dishService: DishService, private activatedRoute: ActivatedRoute, private shoppingCartService: ShoppingCartService, public exchangeCurrencyService: ExchangeCurrencyService)
  {
    this.dish_key = this.activatedRoute.snapshot.params['key'];
    this.getDish();
  }

  private getDish(): void {

    this.dishService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      
        for(let dish_record of data)
        {
          if(dish_record.key == this.dish_key)
          {
            this.dish = dish_record as Dish;
            console.log("Dish details: ");
            console.log(this.dish);

            this.dish_record = new DishWithItShoppingState();
            this.dish_record.dish = dish_record as Dish;
            break;
          }
        }

        this.getDishCurrentlyOrderStats();

      });
  };

  private getDishCurrentlyOrderStats()
  {
    this.currently_ordered_dishes_subscription = this.shoppingCartService.getCurrenltyOrderedDishes().subscribe((data)=>
    {
        console.log("Got shopping cart data!");
        console.log(data);

        for(let record of data)
        {
            record = record as OrderRecord;

            if(record.dish_key === this.dish_record.dish?.key && record.amount_to_order >= 0)
            {
                this.dish_record.orderRecord = record as OrderRecord;
                break;
            }
          }
        });
  }

  addToShoppingCart(dish: Dish | undefined)
  {
    if(dish)
      this.shoppingCartService.addDish(dish);
  }

  removeFromShoppingCart(dish: Dish | undefined)
  {
    if(dish)
      this.shoppingCartService.removeDish(dish);
  }

  removeDishFromMenu(dish: Dish)
  {
    if(dish.key)
    {
      if (confirm('Are you sure you want to delete this dish from menu?')) {
        this.dishService.delete(dish.key);
        this.shoppingCartService.removeDishOrderAfterDeletingFromMenu(dish.key);
      }
    }
  }

  getFirstImgOfDish(dish: Dish | undefined)
  {
    if(dish != undefined &&  dish.imgs)
      return dish.imgs[0];
    
    return '';
  }

  getFontColordependingOfAvailability(record: OrderRecord | undefined)
  {
    if(record != undefined && record.getAvailableAmount() <= 3)
    {
      return 'orange';
    }

    return 'green';
  }

  getIfAddToCartBtnIsDisabled(record :DishWithItShoppingState)
  {
    if(record.orderRecord?.getAvailableAmount() == undefined)
    {
      return false;
    }

    if(record.orderRecord?.getAvailableAmount() > 0)
    {
      return false;
    }

    return true;
  }

  getIfRemoveFromCartBtnIsDisabled(record :DishWithItShoppingState)
  {
    if(record.orderRecord?.getAvailableAmount() == undefined )
    {
      return true;
    }

    if(record.orderRecord.getAvailableAmount() == record.dish?.max_amount)
    {
      return true;
    }

    return false;
    
  }

  ngOnDestroy(): void {
    if(this.currently_ordered_dishes_subscription)
      this.currently_ordered_dishes_subscription.unsubscribe();
  } 

}
