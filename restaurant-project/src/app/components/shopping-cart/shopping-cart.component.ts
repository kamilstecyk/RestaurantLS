import { Component } from '@angular/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { DishService } from 'src/app/services/dish.service';
import { OrderRecord } from 'src/app/services/shopping-cart.service';
import { BuyService } from 'src/app/services/buy.service';
import { ExchangeCurrencyService } from 'src/app/services/exchange-currency.service';
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent {
  is_shopping_cart_extended = false;
  currently_ordered_dishes: OrderRecord[] = [];
  currently_ordered_dishes_subscription: any;
  current_sum_of_order: string = "0.00";

  constructor(private shoppingCartService: ShoppingCartService, private dishService: DishService, private buyService: BuyService, public exchangeCurrencyService: ExchangeCurrencyService)
  {
    this.getShoppingCartRecords();
  }

  getShoppingCartRecords()
  {
    this.currently_ordered_dishes_subscription = this.shoppingCartService.getCurrenltyOrderedDishes().subscribe((data)=>
    {
      this.currently_ordered_dishes =  Object.assign([], data);  
      console.log(this.currently_ordered_dishes);
      this.current_sum_of_order = this.shoppingCartService.getSumOfOrder();
    });
  }

  handleExtendingBtn()
  {
    this.is_shopping_cart_extended = !this.is_shopping_cart_extended;
  }

  addToShoppingCart(record: OrderRecord)
  {
    if(record.dish_key)
      this.shoppingCartService.add(record.dish_key, record.max_amount_to_order, record.price_per_dish, record.dish_name);
  }

  removeFromShoppingCart(record: OrderRecord)
  {
    if(record.dish_key)
      this.shoppingCartService.remove(record.dish_key);
  }

  removeDishTotallyFromShoppingCart(dish_key: string | undefined | null)
  {
    if(dish_key)
      this.shoppingCartService.removeDishOrderAfterDeletingFromMenu(dish_key);
  }

  buyDishes()
  {
    this.currently_ordered_dishes.forEach((record)=>
    {
      this.buyService.create(record);
    });

    this.updateDishMaxAvailableAmountAfterBuying();
    this.shoppingCartService.resetShoppingCart();
    alert("Pomyślnie zakupiono dania!");
  }

  private updateDishMaxAvailableAmountAfterBuying()
  {
    this.currently_ordered_dishes.forEach((record)=>
    {
      const updated_max_amount_value = { max_amount : (record.max_amount_to_order - record.amount_to_order) };
      if(record.dish_key)
        this.dishService.update(record.dish_key, updated_max_amount_value);
    }); 
  }

  getSumOfOrder()
  {
    return  this.exchangeCurrencyService.getPriceInDollars(Number(this.shoppingCartService.getSumOfOrder()));
  }

   ngOnDestroy() {
  
    if(this.currently_ordered_dishes_subscription)
      this.currently_ordered_dishes_subscription.unsubscribe();
   }
}
