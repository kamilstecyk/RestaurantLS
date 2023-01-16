import { Component } from '@angular/core';
import { DishService } from 'src/app/services/dish.service';
import { map } from 'rxjs';
import { Dish } from 'src/app/models/dish.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dish-details',
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.scss']
})
export class DishDetailsComponent {
  dish: Dish;
  dish_key: string;

  constructor(private dishService: DishService, private activatedRoute: ActivatedRoute)
  {
    this.dish_key = this.activatedRoute.snapshot.params['key'];
    this.getDish();
  }

  getDish(): void {

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
          }
        }

      });
  };

}
