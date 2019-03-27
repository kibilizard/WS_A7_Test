import { Component, Input } from "@angular/core";
import { ISearchItem } from "../../websocket/interfaces";

@Component({
    selector: 'search-item',
    templateUrl:'./search-item.component.html',
    styleUrls:['./search-item.component.css']
})
export class SearchItemComponent {
    @Input('item') item: ISearchItem;
    get commerce() {
        return this.item.items[0][0].commerce;
    }
    get discount() {
        return this.commerce.discount;
    }
    get stars(): number[] {
        let stars: number[] = [];
        for (let i = 0; i < this.item.info.cat + 3; i++ ) stars.push(i);
        return stars;
    }
}