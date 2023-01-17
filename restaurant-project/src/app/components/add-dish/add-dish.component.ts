import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Dish } from 'src/app/models/dish.model';
import { DishService } from 'src/app/services/dish.service';

@Component({
  selector: 'app-add-dish',
  templateUrl: './add-dish.component.html',
  styleUrls: ['./add-dish.component.scss']
})
export class AddDishComponent {
  dish: Dish = new Dish();

  constructor(private dishService: DishService){}

  onSubmit()
  {
    console.log(this.dish);
    const formatted_price = Number(this.dish.price);
    const ingredients_array = this.getArray(this.dish.ingredients);
    const imgs_list = this.getArray(this.dish.imgs);

    this.dish.price = formatted_price;
    this.dish.ingredients = ingredients_array;
    this.dish.imgs = imgs_list;

    try{
      this.dishService.create(this.dish);
      console.log("The dish has been added to restaurant menu!");
      // reset form
      this.dish = new Dish();
      alert("Pomyślnie dodano danie do menu!");
    }
    catch(err)
    {
      console.log("Unable to add dish to menu!");
    }

  }

  private getArray(value: String[] | undefined): String[]
  {
    let splitted: String[] = [];

    if(value != null)
    {
      let value_to_split: String = String(value)
      value_to_split = value_to_split.replace(/[\r\n]/gm, '');

      splitted = value_to_split.split(',');
      splitted.forEach((val) => 
      {
        val.trim();
      })
    }

    return splitted;
  }
}

