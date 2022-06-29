import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipeService } from '../../recipe.service';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: []
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() index: number = 0;

  constructor(private recipeService: RecipeService) {}

  
  ngOnInit(): void {
  }

  recipeItem() {
    this.recipeService.recipeSubject.next(this.index);
  }

  
}
