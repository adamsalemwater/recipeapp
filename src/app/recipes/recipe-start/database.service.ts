import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    constructor(private http: HttpClient, 
                private recipeService: RecipeService,
                private authService: AuthService) {}

    storeRecipes() {
       const recipes = this.recipeService.getRecipes();
       this.http.put(
        'https://recipe-2b968-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',recipes).
        subscribe((response => {
            console.log(response)
        }))
    }

    fetchRecipes() {
            return this.http.get<Recipe[]>(
                'https://recipe-2b968-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
        )
        .pipe(
        map(recipes => {
            return recipes.map(recipe => {
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients: []
                }
            });
        }),
    tap(recipes => {
        this.recipeService.setRecipes(recipes)
    })
        )   
    }
}