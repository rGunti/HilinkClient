import encode from 'js-base64';

export enum NumberedBoolean {
    False = 0,
    True = 1
}

export interface IRequest {
    request:any;
}

export class HuaweiRequest<T extends BaseRequestData<T>> implements IRequest {
    constructor(requestData:T) {
        this.request = requestData;
    }

    public request:T;
}

export interface IRequestContent {
}

export abstract class BaseRequestData<T extends BaseRequestData<T>> implements IRequestContent {
    public createRequest():HuaweiRequest<BaseRequestData<T>> {
        return new HuaweiRequest<BaseRequestData<T>>(this);
    }
}

export class LoginRequestData extends BaseRequestData<LoginRequestData> {
    constructor(username:string, password:string) {
        super();
        this.username = username;
        this.password = encode(password);
    }


    public username:string;
    public password:string;
}

export class ListSmsRequestData extends BaseRequestData<ListSmsRequestData> {
    constructor(boxType:number = 1, readCount:number = 20, sortType:number = 0, page:number = 1, ascending:boolean = false, unreadPreferred:boolean = false) {
        super();
        this.PageIndex = page;
        this.ReadCount = readCount;
        this.BoxType = boxType;
        this.SortType = sortType;
        this.Ascending = ascending ? NumberedBoolean.True : NumberedBoolean.False;
        this.UnreadPreferred = unreadPreferred ? NumberedBoolean.True : NumberedBoolean.False;
    }

    public PageIndex:number;
    public ReadCount:number;
    public BoxType:number;
    public SortType:number;
    public Ascending:NumberedBoolean;
    public UnreadPreferred:NumberedBoolean;
}
