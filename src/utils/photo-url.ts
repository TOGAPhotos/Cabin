import { API_URL, STATIC_RESOURCE_URL } from "@/config";
import preSignKey from "@/stores/preSignKey";

export const PhotoUrl = (id: number | string) =>
  `${STATIC_RESOURCE_URL}/photos/${id}.jpg`;

export const RawPhotoUrl = (id: number | string) =>
  `${API_URL}/servex/cdn/rawPhoto/${preSignKey().key}/${id}`;

export const ThumbnailUrl = (id: number | string) =>
  `${STATIC_RESOURCE_URL}/photos/${id}.jpg?imageMogr2/thumbnail/56400@`;
