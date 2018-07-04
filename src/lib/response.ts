
export interface IResponse {
    response:IResponseData;
}

export interface ITypedResponse<T extends IResponseData> extends IResponse {
    response:T;
}

export interface IResponseData {}

export interface ILoginResponseData extends IResponseData {
    SesToken:string;
    TokInfo:string;
}
export interface ILoginResponse extends ITypedResponse<ILoginResponseData> {}

export interface IListSMSResponseData extends IResponseData {
    Count:number;
    Messages:ISms[];
}
export interface ISms {
    Smstat:number;
    Index:number;
    Phone:string;
    Content:string;
    Date:string;
    Sca:string;
    SaveType:number;
    Priority:number;
    SmsType:number;
}

export interface IListSMSResponse extends ITypedResponse<IListSMSResponseData> {}
