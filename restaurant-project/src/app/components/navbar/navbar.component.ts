import { Component, OnDestroy } from '@angular/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy{
  count_number_of_ordered_dishes_subscription: any;
  count_of_ordered_dishes = 0;

  constructor(private shoppingCartService: ShoppingCartService){ this.getCountOfCurrentlyOrderedDishes(); }

  getCountOfCurrentlyOrderedDishes()
  {
    this.count_number_of_ordered_dishes_subscription = this.shoppingCartService.getCurrentNumberOfItemsInCart().subscribe(data => {this.count_of_ordered_dishes = data;})
  }

  ngOnDestroy(): void {
      if(this.count_number_of_ordered_dishes_subscription)
        this.count_number_of_ordered_dishes_subscription.unsubscribe();
  }
}
