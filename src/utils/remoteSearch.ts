import ServerRequest from "@/utils/request";
import {ElMessage} from "element-plus";
import type { AcceptPhoto, PhotoSearchType } from "./type/photo";
import type { Airtype } from "./type/airtype";


export class RemoteSearch{
    static async photo(type: PhotoSearchType,ctx:string,lastId:number,num:number=50):Promise<AcceptPhoto[]>{
        if(num < 1){
            throw new Error('Request Number must be greater than 1');
        }

        const searchUrl = `/search?keyword=${ctx}&type=${type}&lastId=${lastId}&num=${num}`
        const searchReq = new ServerRequest('GET', searchUrl)

        let result:AcceptPhoto[]=[];
        searchReq.success = () => result = searchReq.getData();
        searchReq.error = () => {
            ElMessage.error('搜索失败');
            throw new Error('Search Fail');
        }
        await searchReq.send();
        return result;
    }
    static async airtype(ctx:string){
        const searchReq = new ServerRequest('GET', `/airtype?search=${ctx}`);
        await searchReq.send();
        return searchReq.getData() as Airtype[];
    }
}