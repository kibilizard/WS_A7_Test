import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { WebsocketService } from './websocket/websocket.service';
import { ConnectionService } from './websocket/connection.service';
import { AuthComponent } from './auth/auth.component';
import { SearchComponent } from './search/search.component';
import { SearchGuard } from './search/search.guarg';
import { SearchItemComponent } from './search/item/search-item.component';
import { PricePipe } from './search/item/price.pipe';

@NgModule({
    imports: [BrowserModule, RouterModule.forRoot([
        {path: '', redirectTo: 'auth', pathMatch:'full'},
        {path: 'auth', component: AuthComponent},
        {path: 'search', component: SearchComponent, canActivate: [SearchGuard]},
        {path: '**', redirectTo: 'auth'}
    ])],
    declarations: [
        AppComponent, 
        AuthComponent, 
        SearchComponent, 
        SearchItemComponent, 
        PricePipe],
    providers: [
        WebsocketService,
        ConnectionService,
        SearchGuard
    ],
    bootstrap: [AppComponent]
})

export class AppModule {}