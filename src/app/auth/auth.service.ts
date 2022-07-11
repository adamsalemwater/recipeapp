import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, map, tap, throwError } from "rxjs";
import { User } from "./user.model";

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

    constructor(private http: HttpClient, private router: Router) { }

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBFNx-Jz6B-HfetWBETEEC_mc1858gNYMM',
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
}

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBFNx-Jz6B-HfetWBETEEC_mc1858gNYMM',
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