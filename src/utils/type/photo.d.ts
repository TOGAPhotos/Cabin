export interface ThumbnailInfo {
  airline_cn?: string;
  airline_en: string;
  ac_type: string;

  id: number;
  ac_reg: string;
  username: string;

  airport_cn?: string;
  airport_iata_code?: string;
  airport_icao_code?: string;
}

export interface AcceptPhoto extends ThumbnailInfo {
  airport_id: number;

  allow_socialmedia: number;

  manufacturer_cn: string;
  manufacturer_en: string;
  ac_msn: string;

  photo_time: string;
  user_remark: string;

  upload_user_id: number;
}

interface RejectPhotoInfo extends AcceptPhoto {
  reason: string;
  screener_message: string;
}

export type PhotoSearchType =
  | "blurry"
  | "reg"
  | "airline"
  | "airtype"
  | "airport"
  | "user";

export interface PhotoType {
  label: string;
  value: string;
  class?: string;
  requirement?: string;
}
