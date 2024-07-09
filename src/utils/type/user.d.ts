export interface BasicUserInfo {
    username: string;
    airport_id: number,
    total_photo:number,
    cover_photo_id:number,
}

export interface UserSelfInfo extends BasicUserInfo {
    username: string,
    airport_id: number,
    allow_toga_use:boolean,
    allow_third_use:boolean,
    free_queue: number,
    status: number,
    passing_rate: number,
}