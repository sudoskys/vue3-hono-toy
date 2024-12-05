// FILE: src/api.ts
import axios from 'axios';
import useSWRV from 'swrv';
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

export interface Vocabulary {
    id?: number;
    original: string;
    translation: string;
    phonetic?: string;
    tags?: string;      
    level?: number;
    created_at?: string;   
    updated_at?: string;
    example?: string;
}

export class ApiService {

    static async baseGet<T>(path: string): Promise<T> {
        try {
            const response = await axios.get(`${API_URL}${path}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }

    // Posts 相关接口
    static async getPosts(): Promise<Post[]> {
        try {
            const response = await axios.get(`${API_URL}/api/posts`);
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    }

    static usePosts() {
        const { data, error, isValidating, mutate } = useSWRV('posts', ApiService.getPosts, {
            cache: new LocalStorageCache('swrv'),
            shouldRetryOnError: false,
            revalidateDebounce: 1000
        });
        return { data, error, isValidating, mutate };
    }

    static useVocabulary(keyword?: string) {
        console.log('fetching vocabulary:', keyword);
        // 添加调试日志
        const { data, error, isValidating, mutate } = useSWRV<Vocabulary[]>(
            () => "/api/vocabularys" + (keyword ? `?keyword=${encodeURIComponent(keyword)}` : ""),
            ApiService.baseGet,
            {
                cache: new LocalStorageCache('swrv'),
                shouldRetryOnError: false,
                revalidateDebounce: 1000,
                revalidateOnFocus: false,
            }
        );
        return { data, error, isValidating, mutate };
    }

    static async getVocabularyById(id: number): Promise<Vocabulary> {
        try {
            const response = await axios.get(`${API_URL}/api/vocabularies/${id}`);
            return response.data;
        } catch (error) {
            console.error('获取词汇详情失败:', error);
            throw error;
        }
    }

    static async createVocabulary(vocabulary: Vocabulary): Promise<Vocabulary> {
        try {
            const response = await axios.post(`${API_URL}/api/vocabularies`, vocabulary);
            return response.data;
        } catch (error) {
            console.error('创建词汇失败:', error);
            throw error;
        }
    }

    static async updateVocabulary(id: number, vocabulary: Vocabulary): Promise<Vocabulary> {
        try {
            const response = await axios.put(`${API_URL}/api/vocabularies/${id}`, vocabulary);
            return response.data;
        } catch (error) {
            console.error('更新词汇失败:', error);
            throw error;
        }
    }

    static async deleteVocabulary(id: number): Promise<Vocabulary> {
        try {
            const response = await axios.delete(`${API_URL}/api/vocabularies/${id}`);
            return response.data;
        } catch (error) {
            console.error('删除词汇失败:', error);
            throw error;
        }
    }
}