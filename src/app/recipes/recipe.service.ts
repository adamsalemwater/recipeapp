import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppinglistService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
  recipeChanged =  new Subject<Recipe[]>();

  recipeSubject = new Subject<number>();

  constructor(private shoppinglistService: ShoppinglistService) {}


  //  recipes: Recipe[] = [
  //     new Recipe(
  //     'Tasty Schnitzel',
  //     'A super-tasty Schnitzel - just awesome!',
  //     'assets/Schnitzel.jpg',
  //     [
  //       new Ingredient('Meat', 1),
  //       new Ingredient('French Fries', 20)
  //     ]),

  //   new Recipe('Big Fat Burger',
  //     'What else you need to say?',
  //     'assets/Burger.jpg',
  //     [
  //       new Ingredient('Buns', 2),
  //       new Ingredient('Meat', 1)
  //     ])
  // ];
  recipes: Recipe[] = [];

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }
  
    getRecipes() {
        return this.recipes.slice();        
    }

    updateRecipe(recipe: Recipe){
      let value = this.recipes.find(rec=> rec.name === recipe.name);
      value.description = recipe.description;
      value.name = recipe.name;
      value.ingredients = recipe.ingredients;
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
      return this.shoppinglistService.addIngredients(ingredients);
    }

    getRecipe(index: number) {
      return this.recipes.slice()[index];
    }

    addRecipe(recipe: Recipe) {
      this.recipes.push(recipe);
      this.recipeChanged.next(this.recipes.slice());
    }
  
    replaceRecipe(index: number, newRecipe: Recipe) {
      this.recipes[index] = newRecipe;
      this.recipeChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
      this.recipes.splice(index, 1);
      this.recipeChanged.next(this.recipes.slice());
    }

}