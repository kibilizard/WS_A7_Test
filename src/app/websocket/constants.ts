
export const CONNECT_URL = "wss://api.night2stay.com/api/v2/websocket";

export const QUERYBASE =  {
    auth : {
        action: "login",
        key: "4bd97223-9ad0-4261-821d-3e9ffc356e32",
        type: "account"
    },
    search: {
        action: "accommodation",
        key: "2ee1edbf-d90f-4785-b9db-5b07ce70a928",
        type: "service"

    }
}

export const AUTH = {
    data:{
        key: "123123",
        wlcompany: "CMPN00000053"
    },
    SUCCESS: 200
}

export const SEARCH = {
    data:{
        place: {in: "CI266088ZZ"},
        date: {
            in: 1553472000000,
            out: 1553731200000
        },
        families:[
            {adults: 2}
        ],
        lastid: '0',
        num: 5
    }
}