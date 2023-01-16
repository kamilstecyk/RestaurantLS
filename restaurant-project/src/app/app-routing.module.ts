import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDishComponent } from './components/add-dish/add-dish.component';
import { DishDetailsComponent } from './components/dish-details/dish-details.component';
import { DishesComponent } from './components/dishes/dishes.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { ShoppingHistoryComponent } from './components/shopping-history/shopping-history.component';

const routes: Routes = [
  { path: 'menu', component: DishesComponent },
  { path: 'dodaj-danie', component: AddDishComponent },
  { path: 'koszyk-zakupowy', component: ShoppingCartComponent },
  { path: 'strona-glowna', pathMatch: "full" , component: HomePageComponent },
  { path: 'szczegoly-dania/:key', component: DishDetailsComponent},
  { path: 'historia-zakupow', component: ShoppingHistoryComponent},
  { path: '**', component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
