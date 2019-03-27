import { Component } from '@angular/core';
import { ConnectionService } from './websocket/connection.service';

@Component({
    selector: 'main-app',
    template:  `<h1>
    Angular 7 + WebSocket
  </h1>
  <router-outlet></router-outlet>`
})
export class AppComponent {
    constructor() {
      }
}