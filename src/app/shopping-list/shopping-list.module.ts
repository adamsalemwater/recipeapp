import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LoggingService } from "../logging.service";
import { SharedModule } from "../shared/shared.module";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { ShoppingRoutingModule } from "./shopping-routing.module";

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent
    ],
    imports: [
        ShoppingRoutingModule,
        SharedModule,
        FormsModule
    ],
    exports: [
        ShoppingListComponent,
        ShoppingEditComponent
    ],
    providers: [LoggingService]

})
export class ShoppingListModule {}