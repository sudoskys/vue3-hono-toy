<template>
    <div class="w-full flex flex-col justify-center px-4 py-8">
        <div>
            <h1 class="text-4xl font-bold text-center my-4">Axios请求</h1>
        </div>

        <Card class="lg:w-2/3 md:w-fit flex-row self-center border border-gray-200 rounded-lg mx-4 shadow-md">
            <div class="my-4 mx-4 border-b border-gray-200 pb-4">
                这个页面是用来测试Axios请求的
            </div>
            <div class="posts-container">
                <Alert v-if="loading === LoadingState.Error" variant="destructive">
                    <AlertTitle>错误</AlertTitle>
                    <AlertDescription>{{ error?.message }}</AlertDescription>
                </Alert>

                <div v-else-if="loading === LoadingState.Loading">
                    <Card v-for="n in 3" :key="n" class="mb-4">
                        <Skeleton class="h-32" />
                    </Card>
                </div>

                <div v-else>
                    <Card v-for="post in data" :key="post.id" class="mb-4">
                        <!-- 根据实际 Post 类型展示数据 -->
                        <h3>{{ post.name }}</h3>
                        <p>{{ post.description }}</p>
                    </Card>
                </div>
            </div>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ApiService } from '../api.ts';
import { Skeleton } from '@/components/ui/skeleton/';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card } from '@/components/ui/card';

enum LoadingState {
    Loading,
    Loaded,
    Error,
}

const loading = ref<LoadingState>(LoadingState.Loading);
const { data, error } = ApiService.usePosts();

</script>

<style>
@import url('https://static2.sharepointonline.com/files/fabric/assets/fonts/fabric.min.css');

body {
    font-family: 'Segoe UI', 'Segoe UI Web (West European)', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif;
}
</style>