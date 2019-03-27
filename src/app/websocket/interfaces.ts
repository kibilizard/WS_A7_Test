export type WSDataTypes = ISearchData | ISearchQueryData | IAuthData | IAuthQueryData;

export enum ConnStatus {
    inConnect,
    closed,
    opened,
    inAuth,
    authorised
}

export interface IWSMessage {
    action?: string,
    type?: string,
    key: string,
    status?: number,
    data: WSDataTypes
}

export interface ISearchData {
    done: boolean,
    exptime: number,
    found: number,
    hash: string,
    search:ISearchItem[],
    total: number
}

export interface ISearchItem {
    //hasspo?: boolean,
    info: {
        addr: string, // расположение
        cat: number, // звездность (+3)
        //catid: string,
        //catname: string,
        //iconsid: string[],
        id: string,
        img: string, // картинка отеля
        //imgnum: number,
        //isdesc: boolean,
        name: string, // название отеля
        //point: [number, number],
        //site: {
            //label: string,
            //url: string
        //}
    },
    items: {
        commerce:{
            //currency: number,
            discount: number, // скидка
            //offer: string,
            //original: number,
            payment: number, // цена без скидки
            //providerid: string,
            //reservationfee: number,
            //toriginal: number,
            tpayment: number // цена со скидкой
        },
        //meal: string,
        //type: string
    }[][]
}

export interface ISearchQueryData {
    place: {in: string},
    date: {
        in: number,
        out: number
    },
    families:{
        adults: number
    }[],
    lastid: string,
    num: number
}

export interface IAuthData {
    cat: string[],
    deposits: {
        id: string,
        amount: number,
        status: number
    }[]
}

export interface IAuthQueryData {
    key: string,
    wlcompany: string
}