import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DatabaseService } from "../recipes/recipe-start/database.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'  ,
    styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Output() featureSelected = new EventEmitter<string>();
    userSub: Subscription;
    isAuthenticated = false;

    constructor(private databaseService: DatabaseService,
                private authService: AuthService) {}

    ngOnInit(): void {
        this.userSub = this.authService.user.subscribe(user => {
            this.isAuthenticated = !!user;
        })
    }

    onLogout() {
        this.authService.logout();
    }

    onSelect(feature: string) {
        this.featureSelected.emit(feature);
    }

    onFetchData() {
        this.databaseService.fetchRecipes().subscribe();
    }

    onSaveData() {
        this.databaseService.storeRecipes();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}