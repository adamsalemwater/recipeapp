import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  editMode = false;
  recipeForm: FormGroup;
  recipe: Recipe;
  initialRecipe:Recipe;
  id: number;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
        this.initialRecipe = this.recipe;
        this.editMode = (this.id != null);
        this.setForm(this.recipe);
      }
    );
 
    // this.recipeService.recipeSubject.subscribe((index:number) => {
    //   this.editMode = (index != null);
    //   this.recipe = this.recipeService.getRecipe(index);
    //   this.setForm();
    // })
  }
  
  initForm() {
    this.recipeForm = new FormGroup({
      'recipeName': new FormControl('', Validators.required),
      'imagePath': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
      'ingredients': new FormArray([])
    });
  }

  setForm(recipe) {
    
    this.recipeForm.get('recipeName').setValue(recipe.name);
    this.recipeForm.get('imagePath').setValue(recipe.imagePath);
    this.recipeForm.get('description').setValue(recipe.description);
    this.recipeForm.get('recipeName').setValue(recipe.name);
    if(this.recipe.ingredients){
      (<FormArray>this.recipeForm.get('ingredients')).clear(); 
      for (let ingredient of recipe.ingredients) {
        (<FormArray>this.recipeForm.get('ingredients')).push(
          new FormGroup({
            'ingredientName': new FormControl(ingredient.name, Validators.required),
            'amount': new FormControl(ingredient.amount,[
              Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
          })
        );
      }
  }
  }

  newIngredients(): FormGroup {
    return new FormGroup({
      'ingredientName': new FormControl('xxx', Validators.required),
      'amount': new FormControl(0,[
        Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    });
  }

  get ingredientArray() {
    return <FormArray>this.recipeForm.get('ingredients');
  }

  addIngredientToArray() {
    let ingr = this.newIngredients();
    this.ingredientArray.push(ingr);
  }
  
  removeIngredient(index: number) {
    this.ingredientArray.removeAt(index);
  }

  onCancel() {
    this.setForm(this.initialRecipe);
    console.dir(this.recipeForm.value);
    }

  onSubmit() {
    console.dir("Hi")
     if (this.editMode == true) {
      this.recipeService.replaceRecipe(this.id, this.recipeForm.value)
    } else {
      this.recipeService.addRecipe(this.recipeForm.value)
    }
    this.onCancel();
  }
}
