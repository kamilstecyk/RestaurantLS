import { Component } from '@angular/core';
import { Dish } from '../../models/dish.model';
import { DishService } from '../../services/dish.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.scss']
})
export class DishesComponent {
  dishes: Dish[] = [];
  highest_price = 0;
  cheapest_price = 0;

  constructor(private dishService: DishService)
  {
    this.getAllDishes();
  }

  getAllDishes(): void {

    this.dishService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      
        this.dishes = data as Dish[];

        this.highest_price = Math.max(...this.dishes.map(dish => Number(dish.price)));
        this.cheapest_price = Math.min(...this.dishes.map(dish => Number(dish.price)));

        console.log("Retreived data:");
        console.log(this.dishes);

      });
  };

}
