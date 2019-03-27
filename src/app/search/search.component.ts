import { Component, OnDestroy } from "@angular/core";
import { ConnectionService } from "../websocket/connection.service";
import { ISearchData, ISearchQueryData, ISearchItem, ConnStatus } from "../websocket/interfaces";
import { Subscription, Observable, timer, BehaviorSubject } from "rxjs";
import { filter, map, take } from "rxjs/operators";
import { QUERYBASE, SEARCH } from "../websocket/constants";
import { Router } from "@angular/router";

@Component({
    selector:'search',
    templateUrl:'./search.component.html',
    styleUrls:['./search.component.css']
})
export class SearchComponent implements OnDestroy{
    private searchData$: Observable<ISearchData>;
    private searchTimer: BehaviorSubject<boolean>;

    private searchDataSub: Subscription;
    private connStatusSub: Subscription;

    private lastHash: string;
    public searchDone: boolean = false;

    public items: ISearchItem[] = [];
    
    constructor (private conService: ConnectionService, private router: Router) {
        this.searchTimer = new BehaviorSubject<boolean>(false);

        this.searchData$ = <Observable<ISearchData>>conService.messages.pipe(
            filter((message) => {
                return message.key === QUERYBASE.search.key;
            }),
            map ((message)=>{
                return message.data as ISearchData;
            })
        );

        this.connStatusSub = conService.status.pipe(
            filter((status)=>status !== ConnStatus.authorised)
        ).subscribe(()=>this.router.navigate(['/auth']))

        this.startSearch();
    }

    public startSearch(){
        let queryData: ISearchQueryData = SEARCH.data;

        let inDate = new Date();
        inDate.setHours(3,0,0,0);

        let outDate = new Date();
        outDate.setDate(inDate.getDate() + 5);
        outDate.setHours(3,0,0,0);

        queryData.date.in = inDate.getTime();
        queryData.date.out = outDate.getTime();

        let search = ()=>{
            this.conService.search(queryData);
            this.searchTimer.next(true); 
            timer(2000).subscribe(()=>this.searchTimer.next(false))
        }

        this.searchDataSub = this.searchData$.subscribe(
            (data)=>{
                this.searchTimer.pipe(
                    filter((value)=> !value),
                    take(1),
                ).subscribe(()=> {
                    if (!data.done) search();
                    else this.searchDataSub.unsubscribe();
                })

                if (data.hash !== this.lastHash) {
                    this.items = data.search;
                    this.lastHash = data.hash;
                }
                this.searchDone = data.done;
            }
        );
        
        search();
    }

    ngOnDestroy(){
        !!this.searchDataSub && this.searchDataSub.unsubscribe();
        !!this.connStatusSub && this.connStatusSub.unsubscribe();
    }
}