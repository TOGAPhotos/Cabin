import { ElMessage } from "element-plus";
import userInfoStore from '@/stores/userInfo'
import { API_URL } from "@/config";
import useLocalIdStore from "@/stores/localId";

interface RequestFailFunc {
    (code:number,msg:string):any
}
interface RequestSuccessFunc {
    (msg:string):any
}

export default class ServerRequest {

    private readonly METHOD: string;
    private readonly URL: string;
    private body: string|object|FormData|null;
    private data:any;
    private headers: {[key: string]: string|null};
    private response: Response|null = null;
    private user = userInfoStore()
    private localId = useLocalIdStore()

    constructor(method: string, url: string, data:object|FormData|null =null, contentType:string|null= 'application/json'){
        this.METHOD = method;
        this.URL = API_URL+url;

        this.headers = this.setHeader(contentType,)
        this.body = data;
        
    }
    private setHeader(contentType:string|null,){
        if(!this.localId.isAvail){
            this.localId.setId();
        }
        return{
            'Content-Type': contentType,
            't_id':this.localId.id,
            'Authorization': this.user.isLoggedIn ? "Bearer " + this.user.token : ''
        }
    }
    private preProcess(){

        let init:RequestInit;
        if(this.body && this.headers['Content-Type'] === 'application/json'){
            this.body = JSON.stringify(<object>this.body);
        }

        init = {
            method: this.METHOD,
            headers: this.headers as HeadersInit, 
        }
        if(this.body){
            init.body = <string|FormData>this.body;
        }
        return init;

    }

    async send(){
        let init = this.preProcess();
        try{
            this.response = await fetch(this.URL,init);
        }catch(e){
            this.networkError(<Error>e);
        }

        try{
            this.data = await this.response?.json();
        }catch{
            this.data = null;
        }

        const msg = this.data?.msg;
        if(this.response?.ok){
            this.success(msg||"请求成功");
        }else{
            this.error(<number>this.response?.status,msg||"请求出错");
        }
        return this.response!.ok;
    }

    getData(...args:string[]){
        if(!this.data){
            return null;
        }

        args = ['data'].concat(args);
        let data = this.data;
        for (let key of args) {
            data = data[key]
        }
        return data;
    }
    success:RequestSuccessFunc = () =>{}
    error = (code:number,msg:string):void =>{}

    networkError(e:Error){
        console.log(e);
        ElMessage.error('网络错误，请求失败');
    }

}