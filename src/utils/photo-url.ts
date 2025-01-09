import { STATIC_RESOURCE_URL } from "@/config";

export const PhotoUrl = (id:number|string) => `${STATIC_RESOURCE_URL}/photos/${id}.jpg`

export const ThumbnailUrl = (id:number|string) => `${STATIC_RESOURCE_URL}/min/photos/${id}.jpg`