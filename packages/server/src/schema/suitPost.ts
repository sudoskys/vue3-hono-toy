import { z } from "zod";

/**
 * "id":223951001,"name":"小小焦虑猫","description":"本装扮预留编号1-5～","startTime":1724731200,"totalPurchaseCount":13,"user":3546387199298339,"username":"繁楼科技","owner":3546387199298339,"image_cover":"https://i0.hdslb.com/bfs/garb/5f5fc8e60c6a8ff9b83e55e2c658afe90b61bb5d.jpg"}
 */
export const postSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    startTime: z.number().nullable(),
    totalPurchaseCount: z.number().nullable(),
    user: z.number().nullable(),
    username: z.string().nullable(),
    owner: z.number().nullable(),
    image_cover: z.string().nullable(),
});

export type PostT = z.infer<typeof postSchema>; 