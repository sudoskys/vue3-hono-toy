<template>
    <div class="container mx-auto">
        <!-- 顶部搜索栏 -->
        <div class="fixed top-0 left-0 right-0 bg-white shadow-sm z-20 px-4 py-3">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <h1 class="text-2xl font-bold">单词本</h1>
                <div class="w-1/3">
                    <Input v-model="searchKeyword" placeholder="搜索单词..." class="w-full" />
                </div>
                <Button @click="openDrawer()">添加单词</Button>
            </div>
        </div>

        <!-- 主体内容区 -->
        <div class="pt-16 flex gap-4">
            <!-- 左侧列表 -->
            <div class="w-1/2 p-4">
                <div v-if="isLoading" class="flex justify-center p-4">
                    <div class="loading-spinner" />
                </div>
                <div v-else-if="error" class="text-red-500 p-4">
                    加载失败: {{ error.message }}
                </div>
                <div v-else class="space-y-4">
                    <Card v-for="vocabulary in data" :key="vocabulary.id"
                        class="hover:shadow-lg transition-shadow cursor-pointer" @click="selectVocabulary(vocabulary)">
                        <CardHeader>
                            <div class="flex justify-between items-start">
                                <div>
                                    <CardTitle>{{ vocabulary.original }}</CardTitle>
                                    <CardDescription>{{ vocabulary.translation }}</CardDescription>
                                </div>
                                <div class="flex gap-2">
                                    <Button variant="outline" size="sm" @click.stop="openDrawer(vocabulary)">
                                        编辑
                                    </Button>
                                    <Button variant="destructive" size="sm"
                                        @click.stop="deleteVocabulary(vocabulary.id)">
                                        删除
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            <!-- 右侧详情 -->
            <div class="w-1/2 p-4 border-l">
                <div v-if="selectedVocabulary" class="space-y-6">
                    <div>
                        <h2 class="text-3xl font-bold">{{ selectedVocabulary.original }}</h2>
                        <p class="text-xl text-gray-600">{{ selectedVocabulary.translation }}</p>
                    </div>
                    <div v-if="selectedVocabulary.phonetic" class="text-gray-600">
                        音标: {{ selectedVocabulary.phonetic }}
                    </div>
                    <div v-if="selectedVocabulary.level" class="flex items-center gap-2">
                        <span>难度:</span>
                        <div class="flex">
                            <div v-for="n in 5" :key="n" class="w-4 h-4 rounded-full"
                                :class="n <= selectedVocabulary.level ? 'bg-primary' : 'bg-gray-200'" />
                        </div>
                    </div>
                    <div v-if="selectedVocabulary.tags?.length" class="flex gap-2 flex-wrap">
                        <span v-for="tag in selectedVocabulary.tags.split('\n')" :key="tag"
                            class="px-2 py-1 bg-gray-100 rounded-full text-sm">
                            {{ tag }}
                        </span>
                    </div>
                    <div v-if="selectedVocabulary.example" class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-semibold mb-2">例句:</h3>
                        <p class="text-gray-600">{{ selectedVocabulary.example }}</p>
                    </div>
                </div>
                <div v-else class="flex justify-center items-center h-full text-gray-400">
                    请选择单词查看详情
                </div>
            </div>
        </div>

        <!-- 添加/编辑抽屉 -->
        <Drawer :open="isDrawerOpen" @close="closeDrawer" class="w-1/3">
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{{ editingVocabulary ? '编辑单词' : '添加单词' }}</DrawerTitle>
                </DrawerHeader>
                <form @submit.prevent="handleSubmit" class="space-y-4 p-4">
                    <div class="space-y-2">
                        <Label for="original">单词</Label>
                        <Input id="original" v-model="form.original" required />
                    </div>
                    <div class="space-y-2">
                        <Label for="translation">翻译</Label>
                        <Input id="translation" v-model="form.translation" required />
                    </div>
                    <div class="space-y-2">
                        <Label for="phonetic">音标</Label>
                        <Input id="phonetic" v-model="form.phonetic" />
                    </div>
                    <div class="space-y-2">
                        <Label for="example">例句</Label>
                        <Textarea id="example" v-model="form.example" />
                    </div>

                    <!-- Tags 多选框 -->
                    <div class="space-y-2">
                        <Label for="tags">标签</Label>
                        <TagsInput v-model="selectedTags">
                            <TagsInputItem v-for="tag in selectedTags" :key="tag" :value="tag">
                                <TagsInputItemText />
                                <TagsInputItemDelete />
                            </TagsInputItem>
                            <TagsInputInput placeholder="添加标签..." />
                        </TagsInput>
                    </div>

                    <!-- Level 选择器 -->
                    <div class="space-y-2">
                        <Label for="level">难度等级</Label>
                        <NumberField class="gap-2" :min="1" :max="5" :model-value="form.level"
                            @update:model-value="(v: number) => form.level = v || 1">
                            <NumberFieldContent>
                                <NumberFieldDecrement />
                                    <NumberFieldInput />
                                <NumberFieldIncrement />
                            </NumberFieldContent>
                        </NumberField>
                    </div>
                    <div class="flex justify-end gap-2">
                        <Button variant="outline" @click="closeDrawer">取消</Button>
                        <Button type="submit" :disabled="loading">保存</Button>
                    </div>
                </form>
            </DrawerContent>
        </Drawer>
        <Toaster />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/ui/number-field'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { ApiService, type Vocabulary } from '@/api'
import { useToast, Toaster } from '@/components/ui/toast'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'

const { toast } = useToast()
const searchKeyword = ref('')
const loading = ref(false)
const editingVocabulary = ref<Vocabulary | null>(null)
const form = ref<Vocabulary>({
    original: '',
    translation: '',
    phonetic: undefined,
    tags: '',
    level: 0,
    example: ''
})
const selectedTags = ref<string[]>([])
const isDrawerOpen = ref(false)
const selectedVocabulary = ref<Vocabulary | null>(null)

// 使用 SWRV 获取数据
const { data, error, isValidating: isLoading, mutate } = ApiService.useVocabulary(searchKeyword.value)

// 监听 selectedTags 变化，同步到 form
watch(selectedTags, (newTags) => {
    console.log('watch triggered:', newTags)
    if (Array.isArray(newTags)) {
        form.value.tags = newTags.join('\n')
    }
}, { 
    immediate: true, // 立即执行一次
    deep: true // 深度监听数组变化
})

// 编辑时初始化标签 
watch(editingVocabulary, (vocabulary) => {
    if (vocabulary?.tags) {
        // 将换行符分隔的字符串转换为数组
        selectedTags.value = vocabulary.tags.split('\n').filter(tag => tag.trim())
    } else {
        selectedTags.value = []
    }
})

watch(error, () => {
    if (error) {
        toast({
            title: '获取数据失败',
            description: error instanceof Error ? error.message : '未知错误',
            variant: 'destructive'
        })
    }
})

const handleSubmit = async () => {
    try {
        loading.value = true
        if (editingVocabulary.value) {
            await ApiService.updateVocabulary(editingVocabulary.value.id!, form.value)
            toast({
                title: '更新成功',
                description: '单词已更新'
            })
        } else {
            await ApiService.createVocabulary(form.value)
            toast({
                title: '添加成功',
                description: '单词已添加'
            })
        }
        closeDrawer()
        mutate()
    } catch (error) {
        toast({
            title: '操作失败',
            description: editingVocabulary.value ? '更新单词失败' : '添加单词失败',
            variant: 'destructive'
        })
    } finally {
        loading.value = false
    }
}

// 删除词汇
const deleteVocabulary = async (id?: number) => {
    if (!id) {
        toast({
            title: '删除失败',
            description: '未找到单词 ID',
            variant: 'destructive'
        })
        return
    }
    try {
        await ApiService.deleteVocabulary(id)
        toast({
            title: '删除成功',
            description: '单词已删除'
        })
        // 触发重新获取数据
        mutate()
    } catch (error) {
        toast({
            title: '删除失败',
            description: '删除单词失败',
            variant: 'destructive'
        })
    }
}

// 打开抽屉
const openDrawer = (vocabulary?: Vocabulary) => {
    if (vocabulary) {
        editingVocabulary.value = vocabulary
        form.value = { ...vocabulary }
    }
    isDrawerOpen.value = true
}

// 关闭抽屉
const closeDrawer = () => {
    isDrawerOpen.value = false
    editingVocabulary.value = null
    form.value = {
        original: '',
        translation: '',
        phonetic: undefined,
        tags: undefined,
        level: 0,
        example: ''
    }
}

// 选择单词
const selectVocabulary = (vocabulary: Vocabulary) => {
    selectedVocabulary.value = vocabulary
}
</script>

<style scoped>
.loading-spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>