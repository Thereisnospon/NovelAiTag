<template>
    <div class="grid place-items-left">
        <!-- 正面 tag 输入框 -->
        <div class="rowPositive">
            <div class="input-group">
                <div class="input-group__title">
                    <div class="pb-1">正面 Tag</div>
                    <div><el-button @click="copy2Clipboard('positive')">复制</el-button></div>
                </div>
                <div class="input-group__content">
                    <textarea class="form-control" aria-label="With textarea" id="textarea_pos" :value="PromptStore.output"></textarea>
                </div>
            </div>
        </div>

        <!-- 负面 tag 输入框 -->
        <div class="rowNegative mb-2">
            <div class="input-group">
                <div class="input-group__title">
                    <div class="pb-1">负面 Tag</div>
                    <div><el-button @click="copy2Clipboard('negative')">复制</el-button></div>
                </div>
                <div class="input-group__content">
                    <textarea class="form-control" aria-label="With textarea" id="textarea_pos"></textarea>
                </div>
            </div>
        </div>

        <!-- 已选择的 tag -->

        <!-- 单个 tag 操作 -->
        <div class="rowTagManipulation">
            <!-- tag 分类 read from 'good_practice' -->
            <div class="rowTagCategories">
                <div v-for="(_content, _key) in dictionary" :key="_key">
                    <button
                        class="transition-200 px-4 py-2 mb-2 mr-2 text-white bg-green-600 border border-green-200 rounded hover:opacity-80 active:bg-green-800"
                        :class="{ 'bg-green-800 border-red-900': _key == active }"
                        @click="jumpPage(_key)"
                    >
                        {{ _key }}
                    </button>
                    <!-- <div>{{ _content }}</div> -->
                    <!-- <br /> -->
                </div>
            </div>

            <!-- 该 tag 分类下的所有 tag -->
            <div class="rowTagShow">
                <div v-for="(_content, _key) in dictionary[active]" :key="_key">
                    <div class="btn_group mr-1 mb-1">
                        <!-- 减号 -->
                        <button class="btn_l">-</button>

                        <!-- 内容 -->
                        <button class="btn_c" @click="tagManage_reset(_key, _content)">{{ _key }}:{{ _content }}</button>

                        <!-- 数量 badge -->
                        <button
                            class="btn_c"
                            v-show="PromptStore.tagName.includes(_key)"
                            :class="{ 'btn_c_times  pl-0': PromptStore.tagName.includes(_key) }"
                        >
                            <span class="inline-block text-white bg-black ml-0 text-.8rem lh-1rem px-2 py-1 rounded-full">
                                <!-- DEBUG: 这里有点脏, 之后想办法解决一下 proxy 或者 pinia 的 vue3 读取问题  -->
                                <!-- 优雅但是没做出来的方法 -->
                                {{ PromptStore.tagName.includes(_key) ? PromptStore.tagNum(_key) : '' }}
                            </span>
                        </button>

                        <!-- 可能的删除按钮 -->
                        <button class="btn_c btn_c_delete">xxx</button>

                        <!-- 加号 -->
                        <button class="btn_r" @click="tagManage_add(_key, _content)">+</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import good_practice from '../dictionaries/good_practice';
import { ref, reactive } from 'vue';
import { ElNotification } from 'element-plus';
import { storeToRefs } from 'pinia';

// store 引用
import usePromptStore from '@/stores/stores.js';
let PromptStore = usePromptStore();

// 字典对象
const dictionary = reactive(good_practice);

// 当前激活字典页面
const active = ref('优秀实践');

/**
 * 跳转 tag 页面
 * @param {*} index
 */
const jumpPage = index => {
    active.value = index;
    console.log('打开页面: ', active.value);
};

/**
 * 检测 tag 是否被选中
 * @param {*} _key
 */
const isTagSelected = _key => {
    return PromptStore.tagName.includes(_key);
};

/**
 * 点击增加 tag
 * @param {*} _key tag中文名
 * @param {*} _content tag原名
 */
const tagManage_add = (_key, _content) => {
    console.log('tag: ', _key, '  raw: ', _content);
    PromptStore.addTag({ key: _key, content: _content, time: 1 });

    // console.log('output', PromptStore.output);
};

/**
 * 点击重置 tag
 * @param {*} _key tag中文名
 * @param {*} _content tag原名
 */
const tagManage_reset = (_key, _content) => {
    //DEBUG:  bug 修理中
    console.log('tag: ', _key, '  raw: ', _content);
    PromptStore.setTag({ key: _key, content: _content });
    // console.log('output', PromptStore.output);
};

/**
 * 复制到剪切板,
 * @param {*} place 正面1 /负面0 /可能还有单个标签的复制
 */
const copy2Clipboard = place => {
    //TODO: negative 没弄好
    const obj = { positive: PromptStore.output, negative: 'negative 还没弄好' };

    let text = obj[place];

    if (navigator.clipboard) {
        new Promise((res, rej) => {
            console.log(999);
            navigator.clipboard.writeText(text);
            res();
        }).then(res => {
            ElNotification({
                title: 'Success',
                message: '您已复制成功\n' + text.slice(0, 20) + '...',
                type: 'success'
            });
        });
    } else {
        alert('您的浏览器版本暂时不支持复制, 请手动复制');
    }
};
</script>
<style lang="scss" scoped>
.input-group {
    display: flex;
    justify-content: stretch;
    align-items: center;
    &__title {
        padding: 10px;
        text-align: center;
    }
    &__content {
        flex: 1;
        & textarea {
            width: 100%;
            height: 6rem;
            border-radius: 4px;
            resize: vertical;
        }
    }
}

.rowTagManipulation {
    margin-bottom: 4px;
}

.rowTagCategories {
    display: flex;
    flex-wrap: wrap;
}

.rowTagShow {
    display: flex;
    flex-wrap: wrap;

    .btn_group {
        // display: flow-root;
        overflow: hidden;
    }

    .btn_group:hover {
        // background-color: green;
        transition: all 0.3s;
        filter: opacity(75%);
    }

    .btn_l {
        border: 0.15rem solid red;
        border-top-left-radius: 0.75rem;
        border-bottom-left-radius: 0.75rem;
        width: 2rem;
        line-height: 2rem;
        border-right: none;

        background-color: #dc3545;
    }
    .btn_c {
        border: 0.15rem solid red;
        // height: 2rem;
        line-height: 2rem;
        border-right: none;
        border-left: none;
    }
    .btn_r {
        border: 0.15rem solid red;
        border-top-right-radius: 0.75rem;
        border-bottom-right-radius: 0.75rem;
        width: 2rem;
        line-height: 2rem;
        border-left: none;

        background-color: #1a8754;
    }

    .btn_c_times {
        // display: none;
    }
    .btn_c_delete {
        display: none;
    }
}
</style>
