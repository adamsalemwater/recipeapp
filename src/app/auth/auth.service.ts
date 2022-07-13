import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { environment } from "src/environments/environment";

export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    isRegistered?: boolean
}


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationDate: any;

    constructor(private http: HttpClient, private router: Router) { }

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPI,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError),
        tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }),
        )
    }

    private handleAuthentication(email: string, userId: string,token: string, expiresIn: number) {
            const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
            const user = new User(
                email,
                userId,
                token,
                expirationDate);
            this.user.next(user);
            this.autoLogout(expiresIn * 1000);
            localStorage.setItem('userData', JSON.stringify(user))
}

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }
        const autoUser = new User(userData.email, 
                        userData.id, 
                        userData._token, 
                        new Date(userData._tokenExpirationDate));
        
        if (autoUser.token) {
            this.user.next(autoUser);
            const remainingTime =  new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
            this.autoLogout(remainingTime);
        }
    }

    autoLogout(expirationDuration: number) {
        console.log(expirationDuration)
        setTimeout(() => {
            this.logout()
        },expirationDuration)
    }

    login(email: string, password: string) { 
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPI,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError),
        tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }),
        );
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/login']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationDate) {
            clearTimeout(this.tokenExpirationDate);
        }
        this.tokenExpirationDate = null;
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error has occurred';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email was not found';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'An invalid password was used';
                break;
            case 'USER_DISABLED':
                errorMessage = 'User was disabled';
        }

        return throwError(errorMessage);
    }
}