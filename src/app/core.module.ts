import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthInterceptor } from "./auth/auth-interceptor.service";
import { LoggingService } from "./logging.service";
import { RecipeService } from "./recipes/recipe.service";
import { ShoppinglistService } from "./shopping-list/shopping-list.service";

@NgModule({
    providers:
    [ShoppinglistService, RecipeService, 
        {provide: HTTP_INTERCEPTORS, 
        useClass: AuthInterceptor, 
        multi: true}]
})
export class CoreModule {}