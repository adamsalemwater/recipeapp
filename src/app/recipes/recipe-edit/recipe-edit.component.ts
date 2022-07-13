import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
  recipeForm: UntypedFormGroup;
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
        if (this.id) {
          this.recipe = this.recipeService.getRecipe(this.id);
          this.initialRecipe = this.recipe;
          this.editMode = true;
          this.setForm(this.recipe);
        }  
       
      }
    );
 
    // this.recipeService.recipeSubject.subscribe((index:number) => {
    //   this.editMode = (index != null);
    //   this.recipe = this.recipeService.getRecipe(index);
    //   this.setForm();
    // })
  }
  
  initForm() {
    this.recipeForm = new UntypedFormGroup({
      'recipeName': new UntypedFormControl('', Validators.required),
      'imagePath': new UntypedFormControl('', Validators.required),
      'description': new UntypedFormControl('', Validators.required),
      'ingredients': new UntypedFormArray([])
    });
  }

  setForm(recipe: Recipe) {
    
    this.recipeForm.get('recipeName').setValue(recipe.name);
    this.recipeForm.get('imagePath').setValue(recipe.imagePath);
    this.recipeForm.get('description').setValue(recipe.description);
    if(this.recipe.ingredients){
      (<UntypedFormArray>this.recipeForm.get('ingredients')).clear(); 
      for (let ingredient of recipe.ingredients) {
        (<UntypedFormArray>this.recipeForm.get('ingredients')).push(
          new UntypedFormGroup({
            'ingredientName': new UntypedFormControl(ingredient.name, Validators.required),
            'amount': new UntypedFormControl(ingredient.amount,[
              Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
          })
        );
      }
  }
  }

  newIngredients(): UntypedFormGroup {
    return new UntypedFormGroup({
      'ingredientName': new UntypedFormControl('xxx', Validators.required),
      'amount': new UntypedFormControl(0,[
        Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    });
  }

  get ingredientArray() {
    return <UntypedFormArray>this.recipeForm.get('ingredients');
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
    }

  onSubmit() {
     if (this.editMode) {
      this.recipeService.replaceRecipe(this.id, this.recipeForm.value)
    } else {
      this.recipeService.addRecipe(this.recipeForm.value)
    }
    // this.onCancel();
  }
}
