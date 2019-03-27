import { Injectable } from "@angular/core";
import { Subject, Observable, Observer, BehaviorSubject } from "rxjs";

@Injectable()
export class WebsocketService {
    private subject: Subject<MessageEvent>;
    public isOpen: BehaviorSubject<boolean>;

    constructor() {
        this.isOpen = new BehaviorSubject<boolean>(false);
    }

    public connect(url: string, onClose: ()=>void, onError: (e:any)=>void): Subject<MessageEvent> {
        if (!this.subject) {
            this.subject = this.create(url, onClose, onError);
        }
        return this.subject;
    }

    private create(url: string, onClose: ()=>void, onError: (e:any)=>void): Subject<MessageEvent> {
        let socket = new WebSocket(url);

        let observable = Observable.create(
            (obs: Observer<MessageEvent>) => {
                socket.onmessage = obs.next.bind(obs);
                socket.onerror = (e) => {
                    onError(e);
                    obs.error.bind(obs);
                };
                socket.onclose = () => {
                    onClose();
                    obs.complete.bind(obs);
                };
                return socket.close.bind(socket);
            }
        );

        let observer = {
            next: (data: Object) => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(data));
                }
            }
        };

        socket.onopen = ()=>this.isOpen.next(true);

        return Subject.create(observer, observable);
    }
}