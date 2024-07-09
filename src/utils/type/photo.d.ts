import type {AirportData} from "@/utils/type/airport";

declare type PhotoInfo = {
    airline:string,
    ac_type:string,
    id:number,
    ac_reg:string,
    username:string,
}

interface FullPhotoInfo extends PhotoInfo {
    airport_id: number,
    airport_cn:string,
    airport_iata_code: string,
    airport_icao_code: string,

    allow_socialmedia: number,

    // manufacturer_cn: string,
    // manufacturer_en: string,
    ac_msn: string,

    photo_time: string,
    user_remark: string,

    upload_user_id: number,
}