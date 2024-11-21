<script setup lang="ts">
import { Card,CardHeader,CardTitle,CardDescription,CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
</script>

<template>
    <div class="not-found flex justify-center h-1/2">
        <Card class="w-full max-w-md">
            <CardHeader>
                <CardTitle>
                    <span class="text-4xl">404</span>
                </CardTitle>
                <CardDescription>
                    <span class="text-lg">页面未找到</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" class="w-full">
                    <router-link to="/">返回首页</router-link>
                </Button>
            </CardContent>
        </Card>
    </div>
</template>


<style scoped>
  .not-found {
    text-align: center;
    padding: 50px;
  }
</style>