import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppinglistService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) shoppingForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient

  constructor(private shoppinglistService: ShoppinglistService) { }

  ngOnInit(): void {
    this.subscription = this.shoppinglistService.startedEditing.subscribe((index:number) =>
     {
      this.editMode = true;
      this.editedItemIndex = index;
      this.editedItem = this.shoppinglistService.getIngredient(index);
      this.shoppingForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      })
    });
  }

  onAddItem(form: NgForm) {
    const value = form.value
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode === true) {
      this.shoppinglistService.updateIngredient(this.editedItemIndex, newIngredient)
    } else {
      this.shoppinglistService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onClearItem() {
    this.shoppingForm.reset();
    this.editMode = false;
  }

  onDeleteItem() {
    this.subscription.unsubscribe();
  }

  ngOnDestroy(): void {
    this.shoppinglistService.deleteIngredient(this.editedItemIndex);
    this.onClearItem();
  }

}
