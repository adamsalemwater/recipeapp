import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ingredients: Ingredient[]}>;
  private changeSub: Subscription;
  
  constructor(
              private logService: LoggingService,
              private store: Store<fromApp.AppState>
              ) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  //     this.ingredients = this.shoppinglistService.getIngredients();
  //     this.changeSub = this.shoppinglistService.ingredientsChanged.subscribe((ingredients: Ingredient[]) =>
  //     {
  //       this.ingredients = ingredients;
  //     })
  //     this.logService.printLog("Hello from shopping list ngOnInit")
  //     console.dir(this.child);
  //     console.dir(this.child.childVariable);
   }

  onEditItem(index: number) {
    // this.shoppinglistService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index))

  }

  // ngOnDestroy(): void {
  //     // this.changeSub.unsubscribe();
  // }

  

  }

  

