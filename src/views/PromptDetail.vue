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
                    <textarea
                        @click="copy2Clipboard('positive')"
                        class="form-control"
                        aria-label="With textarea"
                        id="textarea_pos"
                        :value="PromptStore.output"
                    ></textarea>
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
                    <textarea
                        @click="copy2Clipboard('negative')"
                        class="form-control"
                        aria-label="With textarea"
                        id="textarea_pos"
                    ></textarea>
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
                    <div class="btn_group relative mr-2 mb-2">
                        <!-- 减号 -->
                        <button class="btn_left absolute left-0 top-0 bottom-0" @click="tagManage_minus(_key, _content)">-</button>

                        <!-- 减号 button 占位 -->
                        <!-- <button class="btn_center w-2rem">x</button> -->

                        <!-- tag 内容 -->
                        <button
                            class="btn_center btn_left_cover btn_right_cover"
                            :class="{ 'bg-blue-700 text-white ': isTagSelected(_key) }"
                            @click="tagManage_reset(_key, _content)"
                        >
                            {{ _key }}:{{ _content }}
                        </button>

                        <!-- 数量 badge -->
                        <button
                            class="btn_center w-3rem absolute top-0 bottom-0 right-2rem px-0 inline-block"
                            :class="{ 'btn_center_times bg-blue-700 text-white ': isTagSelected(_key) }"
                        >
                            <span
                                class="inline-block text-white text-center bg-black m-0 text-.8rem lh-1rem px-2 py-1 rounded-full w-1.5rem"
                                :class="{ 'bg-gray': !isTagSelected(_key) }"
                            >
                                <!-- DEBUG: 这里有点脏, 之后想办法解决一下 proxy 或者 pinia 的 vue3 读取问题  -->
                                {{ isTagSelected(_key) ? PromptStore.tagNum(_key) : '无' }}
                            </span>
                        </button>

                        <!-- 可能的删除按钮 -->
                        <!-- <button class="btn_center btn_center_delete">xxx</button> -->

                        <!-- 加号 -->
                        <button class="btn_right z-1000 absolute right-0 top-0 bottom-0" @click="tagManage_add(_key, _content)">+</button>
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
 * @param {*} _key tag中文名
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
    // console.log('tag: ', _key, '  raw: ', _content);
    PromptStore.addTag({ key: _key, content: _content, time: 1 });

    // console.log('output', PromptStore.output);
};

/**
 * 点击减少 tag
 * @param {*} _key tag中文名
 * @param {*} _content tag原名
 */
const tagManage_minus = (_key, _content) => {
    // console.log('tag: ', _key, '  raw: ', _content);
    PromptStore.minusTag({ key: _key, content: _content });

    // console.log('output', PromptStore.output);
};

/**
 * 点击重置 tag
 * @param {*} _key tag中文名
 * @param {*} _content tag原名
 */
const tagManage_reset = (_key, _content) => {
    //DEBUG:  bug 修理中
    // console.log('tag: ', _key, '  raw: ', _content);
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

    // 无标签检测
    if (!text) {
        ElNotification({
            title: '没有文本',
            message: '您似乎没有选择该区域的任何标签',
            type: 'warning'
        });
        return;
    }

    // 复制
    if (navigator.clipboard) {
        new Promise((res, rej) => {
            console.log(`> [${place}]标签 复制到粘贴板`);
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
<style lang="scss">
// 全局样式
@import '@/assets/styles/global_variables.scss';
// 两个边框颜色变量
// $tag_border_normal: red;
// $tag_border_hover: rgb(0, 119, 255);

// 提出 tag 的样式, 将边框颜色所谓变量
@mixin btn_left($color) {
    transition: all 0.2s;

    border: 0.15rem solid $color;
    border-top-left-radius: 0.75rem;
    border-bottom-left-radius: 0.75rem;
    width: 2rem;
    line-height: 2rem;
    border-right: none;

    background-color: #dc3545;
}

@mixin btn_center($color) {
    transition: all 0.2s;

    border: 0.15rem solid $color;
    line-height: 2rem;
    border-right: none;
    border-left: none;
}

@mixin btn_right($color) {
    transition: all 0.2s;

    border: 0.15rem solid $color;
    border-top-right-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
    width: 2rem;
    line-height: 2rem;
    border-left: none;

    background-color: #1a8754;
}

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
        border-radius: 0.75rem;
        overflow: hidden;
        transition: all 0.2s;
        box-shadow: 0px 0px rgba(0, 0, 0, 0.4);

        .btn_left {
            @include btn_left($tag_border_normal);
            font-size: inherit;
        }
        .btn_center {
            @include btn_center($tag_border_normal);
            font-size: inherit;
        }
        .btn_right {
            @include btn_right($tag_border_normal);
            font-size: inherit;
        }

        .btn_center_times {
            // display: none;
        }
        .btn_center_delete {
            display: none;
        }

        .btn_left_cover {
            padding-left: calc(2rem + 6px);
        }

        .btn_right_cover {
            padding-right: calc(5rem + 6px);
        }
    }

    .btn_group:hover {
        box-shadow: 5px 5px 0px 0px $tag_border_hover;
        .btn_left {
            @include btn_left($tag_border_hover);
        }
        .btn_center {
            @include btn_center($tag_border_hover);
        }
        .btn_right {
            @include btn_right($tag_border_hover);
        }
    }
}
</style>
