import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppinglistService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  private changeSub: Subscription;
  
  constructor(private shoppinglistService: ShoppinglistService,
              private logService: LoggingService) { }

  ngOnInit(): void {
      this.ingredients = this.shoppinglistService.getIngredients();
      this.changeSub = this.shoppinglistService.ingredientsChanged.subscribe((ingredients: Ingredient[]) =>
      {
        this.ingredients = ingredients;
      })
      this.logService.printLog("Hello from shopping list ngOnInit")
  }

  onEditItem(index: number) {
    this.shoppinglistService.startedEditing.next(index);
  }

  ngOnDestroy(): void {
      this.changeSub.unsubscribe();
  }

  
}
