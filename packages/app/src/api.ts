// FILE: src/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
export interface Post {
    id: number;
    name: string;
    description: string | null;
    startTime: number;
    totalPurchaseCount: number;
    user: number;
    username: string;
    owner: number;
    image_cover: string;
}

export class ApiService {

    /**
     * 获取所有的 posts
     * @returns  {Promise<Post[]>} 所有的 posts
     */
    static async getPosts(): Promise<Post[]> {
        try {
            const response = await axios.get(`${API_URL}/api/posts`);
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    }
}