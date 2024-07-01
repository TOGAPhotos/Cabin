import serverRequest from "@/utils/request";
import {ElMessage} from "element-plus";
import type {PhotoSearchResult, SearchType} from "@/utils/type/remoteSearch";

export class RemoteSearch{
    static async photo(type: SearchType,ctx:string,lastId:number,reqNum:number=50):Promise<PhotoSearchResult[]>{
        if(reqNum < 1){
            throw new Error('Request Number must be greater than 1');
        }

        const searchUrl = `/search?keyword=${ctx}&type=${type}&lastId=${lastId}`
        const searchReq = new serverRequest('GET', searchUrl)

        let result:PhotoSearchResult[]=[];
        searchReq.success = () => result = searchReq.getData('data');
        searchReq.error = () => {
            ElMessage.error('搜索失败');
            throw new Error('Search Fail');
        }
        await searchReq.send();

        return result;
    }
}