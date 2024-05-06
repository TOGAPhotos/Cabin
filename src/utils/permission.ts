export default class Permission{
    static check(user:any,require:any){
        return user === require
    }
}