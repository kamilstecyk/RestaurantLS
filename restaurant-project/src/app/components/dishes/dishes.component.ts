import { Component, OnDestroy } from '@angular/core';
import { Dish } from '../../models/dish.model';
import { DishService } from '../../services/dish.service';
import { map } from 'rxjs';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { OrderRecord } from 'src/app/services/shopping-cart.service';

export class DishWithItShoppingState
{
  dish?: Dish;
  orderRecord?: OrderRecord;
}
@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.scss']
})
export class DishesComponent implements OnDestroy {
  highest_price = 0;
  cheapest_price = 0;

  currently_ordered_dishes_subscription: any;
  dishesWithItsOrderRecords: DishWithItShoppingState[] = [];

  constructor(private dishService: DishService, private shoppingCartService: ShoppingCartService)
  {
    this.getAllDishes();
  }

  private getAllCurrentlyOrderedDishes()
  {
    this.currently_ordered_dishes_subscription = this.shoppingCartService.getCurrenltyOrderedDishes().subscribe((data)=>
    {
        console.log("Got shopping cart data!");
        console.log(data);

        for(let record of data)
        {
          record = record as OrderRecord;

          for(let dishWithItStateRecord of this.dishesWithItsOrderRecords)
          {
            console.log("I am here!!!");

            if(record.dish_key === dishWithItStateRecord.dish?.key && record.amount_to_order >= 0)
            {
              dishWithItStateRecord.orderRecord = record as OrderRecord;
              
            }
          }
        }
        console.log("Shopping cart State: ");
        console.log(this.dishesWithItsOrderRecords);
    });
  }

  private getAllDishes(): void {

    this.dishService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
        // data =  data as Dish[];

        data.forEach((dish)=>
        {
          this.dishesWithItsOrderRecords.push({dish: dish, orderRecord: undefined});
        });

        this.highest_price = Math.max(...this.dishesWithItsOrderRecords.map(record => Number(record.dish?.price)));
        this.cheapest_price = Math.min(...this.dishesWithItsOrderRecords.map(record => Number(record.dish?.price)));

        this.getAllCurrentlyOrderedDishes();
      });
  };

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

  ngOnDestroy(): void {
      if(this.currently_ordered_dishes_subscription)
        this.currently_ordered_dishes_subscription.unsubscribe();
  }

}
