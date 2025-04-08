import { STATIC_RESOURCE_URL } from "@/config";

export const PhotoUrl = (id: number | string) => `${STATIC_RESOURCE_URL}/photos/${id}.jpg`

export const RawPhotoUrl = (id: number | string) => `${STATIC_RESOURCE_URL}/photos/${id}.raw`

export const ThumbnailUrl = (id: number | string) => `${STATIC_RESOURCE_URL}/photos/${id}.jpg?imageMogr2/thumbnail/56400@`