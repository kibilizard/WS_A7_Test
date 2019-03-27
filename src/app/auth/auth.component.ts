import { Component } from "@angular/core";
import { ConnectionService } from "../websocket/connection.service";
import { ConnStatus } from "../websocket/interfaces";
import { Router } from "@angular/router";

@Component({
    selector:'auth',
    templateUrl:'./auth.component.html'
})
export class AuthComponent {
    public connected: boolean = false;
    public authProcess: boolean = false;
    public connectProcess: boolean = false;
    constructor (
        private conService: ConnectionService,
        private router: Router) {
        this.conService.status.subscribe(
            (status: ConnStatus)=> {
                switch (status) {
                    case ConnStatus.inConnect: {
                        this.connectProcess = true;
                        this.connected = false;
                        this.authProcess = false;
                        break;
                    }
                    case ConnStatus.closed: {
                        this.connectProcess = false;
                        this.connected = false;
                        this.authProcess = false;
                        break;
                    }
                    case ConnStatus.opened: {
                        this.connectProcess = false;
                        this.connected = true;
                        this.authProcess = false;
                        break;
                    }
                    case ConnStatus.inAuth: {
                        this.connectProcess = false;
                        this.connected = true;
                        this.authProcess = true;
                        break;
                    }
                    case ConnStatus.authorised: {
                        this.router.navigate(['/search']);
                        break;
                    }
                }
            }
        )
    }

    get header() {
        let inConnect = "Соединение...",
        inAuth = 'Авторизация...',
        authError = 'Ошибка авторизации. Попробовать еще раз?',
        connError = 'Соединение сброшено. Пожалуйста перезагрузите страницу';

        return this.connected ? 
            (this.authProcess ? inAuth : authError) : 
            (this.connectProcess ? inConnect : connError);
    }

    public auth() {
        this.conService.authorize();
    }
}