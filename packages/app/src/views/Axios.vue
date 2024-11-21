<template>
    <div class="w-full flex flex-col justify-center px-4 py-8">
        <div>
            <h1 class="text-4xl font-bold text-center my-4">Axios请求</h1>
        </div>

        <Card class="lg:w-2/3 md:w-fit flex-row self-center border border-gray-200 rounded-lg mx-4 shadow-md">
            <div class="my-4 mx-4 border-b border-gray-200 pb-4">
                这个页面是用来测试Axios请求的
            </div>
            <div v-if="loading === LoadingState.Loading" class="flex justify-center items-center">
                <Skeleton />
            </div>
            <div v-if="loading === LoadingState.Error">
                <Alert variant="destructive">
                    <Radio class="mr-2 h-4" />
                    <AlertTitle>
                        无法获取数据
                    </AlertTitle>
                    <AlertDescription>
                        你可以尝试刷新页面
                    </AlertDescription>
                </Alert>
            </div>
            <var-loading description="LOADING" :loading="loading === LoadingState.Loading">
                <div v-if="loading === LoadingState.Loading" class="flex justify-center items-center">
                    <Skeleton />
                </div>
                <div v-if="loading === LoadingState.Loaded"
                    class="gap-4 mx-auto justify-center overflow-hidden relative">
                    <div class="flex flex-wrap">
                        <div v-if="posts.length === 0">
                            没有数据
                        </div>
                        <div v-for="post in posts" :key="post.id">
                            <div class="flex flex-col items-center mx-4 my-4">
                                <img :src="`${post.image_cover}@450w_618h.avif`"
                                    class="h-[206px] w-[150px] rounded bg-text/5 object-cover" alt="预览"
                                    referrerpolicy="no-referrer" loading="lazy">
                                <div class="mt-2 text-sm font-medium text-primary max-w-[150px] truncate">
                                    {{ post.name }}
                                </div>
                                <p class="text-gray-400 text-sm text-text/5 text-nowrap max-w-[150px] truncate">{{
                                    post.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </var-loading>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ApiService, Post } from '../api.ts';
import { Skeleton } from '@/components/ui/skeleton/';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Radio } from 'lucide-vue-next';
import { Card } from '@/components/ui/card';
enum LoadingState {
    Loading,
    Loaded,
    Error,
}
const loading = ref<LoadingState>(LoadingState.Loading);

const posts = ref([] as Post[]);

onMounted(async () => {
    try {
        posts.value = await ApiService.getPosts();
        loading.value = LoadingState.Loaded;
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        loading.value = LoadingState.Error;
    }
});
</script>

<style>
@import url('https://static2.sharepointonline.com/files/fabric/assets/fonts/fabric.min.css');

body {
    font-family: 'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif;
}
</style>