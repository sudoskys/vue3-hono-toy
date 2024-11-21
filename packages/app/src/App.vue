<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Route, Home } from 'lucide-vue-next'
import { Themes, StyleProvider } from '@varlet/ui'
StyleProvider(Themes.md3Light)
</script>
<template>
  <div class="relative min-h-screen">
    <div className="fixed inset-0 bg-gradient-to-b from-primary/10 to-primary opacity-30
     pointer-events-none -z-10"></div>
    <!-- 一个头部 -->
    <header class="flex items-center p-4">
      <div class="text-left">
        浏览 {{ $route.path }}
      </div>
      <div class="mx-auto lg:w-1/2 md:w-fit flex justify-center items-center">
        <div>
          <RouterLink class="flex justify-center flex-row hover:text-primary h-full w-full p-2 font-medium" to="/">
            <Home class="w-4 mr-2" />
            首页
          </RouterLink>
        </div>
        <div>
          <RouterLink class="flex justify-center flex-row hover:text-primary h-full w-full p-2 font-medium" to="/axios">
            <Route class="w-4 mr-2" />
            Axios请求
          </RouterLink>
        </div>
      </div>
    </header>
    <!-- 一个内容区 -->
    <main class="relative min-h-screen">
      <RouterView />
    </main>
    <!-- 一个底部 -->
    <footer class="p-4 text-center">
      <span>实验性 Vue 前后端一体化示例</span>
    </footer>
  </div>
</template>

<style scoped>
body {
  transition: background-color .25s, color .25s;
  color: var(--color-text);
  background-color: var(--color-body);
}
</style>
