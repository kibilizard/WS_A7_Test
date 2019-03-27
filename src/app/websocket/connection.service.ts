import { Injectable } from "@angular/core";
import { WebsocketService } from "./websocket.service";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { map, filter, take } from 'rxjs/operators';
import { CONNECT_URL, AUTH, QUERYBASE } from "./constants";
import { IWSMessage, ConnStatus, ISearchQueryData, IAuthQueryData } from "./interfaces";

@Injectable()
export class ConnectionService {
    private conSubject: Subject<IWSMessage>;
    public messages: Observable<IWSMessage>;
    public status: BehaviorSubject<ConnStatus>;

    constructor (private wsService:WebsocketService) {
        this.status = new BehaviorSubject<ConnStatus>(ConnStatus.inConnect);
        this.conSubject = <Subject<IWSMessage>>wsService.connect(
            CONNECT_URL,
            ()=>{
                console.log("WS connection closed");
                this.status.next(ConnStatus.closed);
            },
            (err) => {
                console.error("WS Error: "+err);
                this.status.next(ConnStatus.closed);
            }).pipe(
            map((response: MessageEvent) => {
                let data = JSON.parse(response.data);
                return {
                    key: data.key,
                    status: data.status,
                    data: data.data 
                };
            })
        )

        const subject = new Subject();
        this.conSubject.subscribe(subject);
        this.messages = new Observable((observer) => subject.subscribe(observer));

        wsService.isOpen.pipe(
            filter((opened)=>opened)
        ).subscribe(
            ()=>{
                this.status.next(ConnStatus.opened);
                this.authorize();
            }
        );
    }

    public authorize(data: IAuthQueryData = AUTH.data) {
        this.status.next(ConnStatus.inAuth);

        let query: IWSMessage = Object.assign({},QUERYBASE.auth, {data});

        this.conSubject.next(query);

        this.messages.pipe(
            filter((data: IWSMessage) => {
                return data.key === QUERYBASE.auth.key;
            }),
            take(1)
        ).subscribe(
            (data: IWSMessage) => {
                this.status.next(data.status === AUTH.SUCCESS ? ConnStatus.authorised : ConnStatus.opened);
            }
        )
    }

    public search(data: ISearchQueryData) {
        let query: IWSMessage = Object.assign({}, QUERYBASE.search, {data});
        
        this.conSubject.next(query);
    }
}