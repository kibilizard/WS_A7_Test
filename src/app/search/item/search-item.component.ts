import { Component, Input } from "@angular/core";
import { ISearchItem } from "../../websocket/interfaces";
import { isNgTemplate } from "@angular/compiler";

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
}