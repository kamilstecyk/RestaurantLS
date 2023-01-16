import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DishesComponent } from './components/dishes/dishes.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { DishDetailsComponent } from './components/dish-details/dish-details.component';
import { ShoppingHistoryComponent } from './components/shopping-history/shopping-history.component';
import { AddDishComponent } from './components/add-dish/add-dish.component';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMKOMmRzapbTgl4a_9KYOGIVx8mipCquw",
  authDomain: "restauracja-9c7e8.firebaseapp.com",
  projectId: "restauracja-9c7e8",
  storageBucket: "restauracja-9c7e8.appspot.com",
  messagingSenderId: "420946017599",
  appId: "1:420946017599:web:39c09d601693dc4a1aa78a"
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DishesComponent,
    ShoppingCartComponent,
    HomePageComponent,
    DishDetailsComponent,
    ShoppingHistoryComponent,
    AddDishComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
