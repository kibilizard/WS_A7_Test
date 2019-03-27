import { Component, OnDestroy } from "@angular/core";
import { ConnectionService } from "../websocket/connection.service";
import { ConnStatus } from "../websocket/interfaces";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
    selector:'auth',
    templateUrl:'./auth.component.html'
})
export class AuthComponent implements OnDestroy {
    private connStatus: ConnStatus;

    private connStatusSub: Subscription;

    public get connected() {
        return [ConnStatus.opened,ConnStatus.inAuth,ConnStatus.authorised].indexOf(this.connStatus) > -1;
    }

    public get authProcess() {
        return this.connStatus === ConnStatus.inAuth;
    }

    constructor (
        private conService: ConnectionService,
        private router: Router) {
        this.connStatusSub = this.conService.status.subscribe(
            (status: ConnStatus)=> {
                this.connStatus = status;
                
                if (status === ConnStatus.authorised) this.router.navigate(['/search']);
            }
        )
    }

    get header() {
        let inConnect = "Соединение...",
        inAuth = 'Авторизация...',
        authError = 'Ошибка авторизации. Попробовать еще раз?',
        connError = 'Соединение сброшено. Пожалуйста перезагрузите страницу',
        authorized = 'Авторизован';
        
        switch (this.connStatus) {
            case ConnStatus.inConnect: return inConnect;
            case ConnStatus.closed: return connError;
            case ConnStatus.opened: return authError
            case ConnStatus.inAuth: return inAuth;
            case ConnStatus.authorised: return authorized;
        }
    }

    public auth() {
        this.conService.authorize();
    }

    ngOnDestroy() {
        !!this.connStatusSub && this.connStatusSub.unsubscribe();
    }
}