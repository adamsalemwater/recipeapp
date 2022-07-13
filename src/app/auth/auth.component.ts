import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponenet } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

    private closeSub: Subscription;

    constructor(private authService: AuthService,
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        let authObs: Observable<AuthResponseData>;

        this.isLoading = true;

        if (this.isLoginMode) {
            authObs = this.authService.login(email, password);
        } else {
            authObs = this.authService.signUp(email, password);
        }

        authObs.subscribe(resData => {
            console.log(resData);
            this.isLoading = false;
            this.router.navigate(['recipes']);
        }, (errorMessage) => {
            console.log(errorMessage);
            this.error = errorMessage;
            this.handleError(errorMessage);
            this.isLoading = false;
        }
    );

        form.reset();
    }

    onHandleError() {
        this.error = null;
    }

    private handleError(message: string) {
        const cmpAlertFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponenet);

        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const containerRef = hostViewContainerRef.createComponent(cmpAlertFactory);

        containerRef.instance.message = message;
        this.closeSub = containerRef.instance.close.subscribe(() => {
            hostViewContainerRef.clear()
            this.closeSub.unsubscribe();
        })
    }

   
}