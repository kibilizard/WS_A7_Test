import { CanActivate, Router } from "@angular/router";
import { ConnectionService } from "../websocket/connection.service";
import { ConnStatus } from "../websocket/interfaces";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable()
export class SearchGuard implements CanActivate {

    constructor(public conService: ConnectionService, public router: Router){}
    
    canActivate(): Observable<boolean> {
        return this.conService.status.pipe(
            map((status: ConnStatus) => {
                if (status !== ConnStatus.authorised) this.router.navigate(['/auth']);
                return status === ConnStatus.authorised;
            })
        )
    }
}