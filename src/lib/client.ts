import { HuaweiRequest, LoginRequestData, BaseRequestData, IRequest, ListSmsRequestData } from './request';
import { IResponse, ITypedResponse, ILoginResponseData, ILoginResponse, IListSMSResponse } from './response';
import { parseString, Builder } from 'xml2js';
import { Buffer } from 'buffer';
import * as http from 'http';

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
}

/**
 * Based on https://github.com/Matsuo3rd/sms-forward/blob/master/lib/HuaweiModemClient.js
 */
export class HuaweiModemClient {
    private ip:string;
    private loginData:{ username:string, password:string };

    private sessionInfo:string;
    private tokenInfo:string;

    constructor(ip:string, username:string = null, password:string = null) {
        this.ip = ip;
        if (username != null) {
            this.loginData = { username: username, password: password };
        }
    }

    async command<T extends IResponse>(path:string, request:IRequest|null = null, method:HttpMethod = HttpMethod.POST):Promise<T> {
        let self = this;
        let body = new Builder().buildObject(request);
        let httpRequest = {
            host: this.ip,
            path: path,
            port: 80,
            method: method,
            headers: {
                'Content-Length': Buffer.byteLength(body),
                'Cookie': this.sessionInfo,
                '__RequestVerificationToken': this.tokenInfo
            }
        };

        return new Promise<T>((resolve, reject) => {
            const req = http.request(httpRequest, (res:http.IncomingMessage) => {
                let buf = "";
                res.on('data', (data) => {
                    buf += data;
                });
                res.on('end', (data) => {
                    if (res.statusCode != 200) {
                        reject(buf);
                    } else {
                        parseString(buf, (err, xml) => {
                            if (err) {
                                reject(err);
                            } else if (xml.error != null) {
                                reject(xml.error.code);
                            } else {
                                if (res.headers.__requestverificationtoken) {
                                    self.tokenInfo = <string>res.headers.__requestverificationtoken;
                                }
                                resolve(xml);
                            }
                        });
                    }
                });
            });
            req.on('error', (error) => {
                reject(error);
            });
            req.write(body);
            req.end();
        });
    }

    /**
     * Sends authentication data to create a new session and get new tokens
     */
    async authenticate():Promise<ILoginResponse> {
        let request = new LoginRequestData(this.loginData.username, this.loginData.password).createRequest();
        return <Promise<ILoginResponse>>this.command("/api/user/login", request);
    }

    async listSMS():Promise<IListSMSResponse> {
        let request = new ListSmsRequestData().createRequest();
        return <Promise<IListSMSResponse>>this.command("/api/sms/sms-list", request);
    }
}