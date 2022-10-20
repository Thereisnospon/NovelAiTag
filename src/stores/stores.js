import { defineStore, acceptHMRUpdate } from 'pinia';
import { ElNotification } from 'element-plus';

import Storages from '../utils/storages';

export default defineStore({
    id: 'app',
    state: () => ({
        /**
         * 所有已选择信息,
         * key : 翻译名
         * content : 原英文名
         * time : 次数
         */
        tag_positive: [],
        tag_negative: [],

        /**
         * 最终输出结果
         */
        output: ''
    }),

    getters: {
        /**
         * 缓存 key 的集合
         * @param {*} state
         * @returns
         */
        tagName(state) {
            return state.tag_positive.map(el => el.key);
        },

        /**
         * 查询指定 tag 的 times
         */
        tagNum(state) {
            return _key => {
                let item = state.tag_positive.find(user => user.key === _key);
                let res = null;
                // console.log(item);
                if (item) {
                    // console.log(Object.keys(item));
                    // console.log(Object.values(item));
                    res = Object.entries(item)[2][1];
                }
                // console.log(res);
                return res;
            };
        }
    },

    actions: {
        /**
         * 增加 1 的标签对象
         * @param {*} tag
         */
        addTag(tag, state) {
            // console.log(tag);
            let num = this.tagName.indexOf(tag.key);

            //  没有在缓存中找到
            if (num == -1) {
                this.tag_positive.push(tag);
            }
            // 在缓存中找到了
            else {
                if (this.tag_positive[num].time == -1) {
                    this.tag_positive[num].time = 1;
                } else {
                    this.tag_positive[num].time += 1;
                }
            }

            // console.log(this.tag_positive);

            this.renderOutput();
        },

        /**
         * 减少 1 的标签对象
         * @param {*} tag
         */
        minusTag(tag, state) {
            // console.log(tag);
            let num = this.tagName.indexOf(tag.key);

            //  没有在缓存中找到
            if (num == -1) {
                // TODO: 这里要和 thereisnospon 商量一下凭空减少怎么做, 负面还是不动, 暂时不动
                ElNotification({
                    title: '别乱动',
                    message: '没有数量就别瞎减哦, 想减先点标签添加',
                    type: 'info'
                });
            }
            // 在缓存中找到了
            else {
                // console.log(this.tag_positive[num].time);

                // 存在降权
                // 刚好为 1 -> 变 -1
                if (this.tag_positive[num].time == 1) {
                    this.tag_positive[num].time = -1;
                }
                // 不是1 -> 减1
                else {
                    this.tag_positive[num].time -= 1;
                }

                // // 原先无降权的样子
                // // 刚好为1 -> 删掉
                // if (this.tag_positive[num].time == 1) {
                //     this.tag_positive.splice(num, 1);
                // }
                // // 不是1 -> 减1
                // else {
                //     this.tag_positive[num].time -= 1;
                // }
            }

            // console.log(this.tag_positive);

            this.renderOutput();
        },

        /**
         * 重置标签对象 -> 为1 或者 删除
         * @param {*} tag
         * @param {*} state
         */
        setTag(tag, state) {
            let num = this.tagName.indexOf(tag.key);

            //  没有在缓存中找到
            if (num == -1) {
                tag.time = 1;
                this.tag_positive.push(tag);
            }
            // 在缓存中找到了 -> 删掉
            else {
                this.tag_positive.splice(num, 1);
            }

            // console.log(this.tag_positive);

            this.renderOutput();
        },

        /**
         * 渲染最后输出 prompt
         */
        renderOutput() {
            let res = '';

            // 循环把字符串加好
            this.tag_positive.forEach(el => {
                // 等于 1
                if (el.time == 1) {
                    res += el.content;

                    // 逗号分割
                    res += ',';
                }
                // 大于 1
                else if (el.time > 1) {
                    let prev = '{'.repeat(el.time - 1);
                    let next = '}'.repeat(el.time - 1);
                    let tmp = prev + el.content + next;
                    res += tmp;

                    // 逗号分割
                    res += ',';
                }

                // 等于 0
                else if (el.time == 0) {
                }

                // 等于 0
                else if (el.time < 0) {
                    let prev = '['.repeat(-el.time);
                    let next = ']'.repeat(-el.time);
                    let tmp = prev + el.content + next;
                    res += tmp;

                    // 逗号分割
                    res += ',';
                }
            });

            // // slice 去掉最后的逗号
            // res = res.slice(0, res.length - 1);

            this.output = res;
            // console.log(res);

            //TODO:  negative 还没搞定
            this.storageSet_write('positive');
        },

        // -------------- localStorage 操作

        /**
         * 读取 localStorage
         * @param {positive/negative} item
         */
        storageSet_read(item) {
            /**
             * localStorage 存储类型
             */
            let storageType = {
                positive: this.tag_positive,
                negative: this.tag_negative
            };

            switch (item) {
                case 'positive':
                    this.tag_positive = Storages.getItem(item);
                    break;
                case 'negative':
                    this.tag_negative = Storages.getItem(item);
                    break;
            }
            console.log('已读取: ', item);
        },
        /**
         * 写入 localStorage
         * @param {positive/negative} item
         */
        storageSet_write(item) {
            /**
             * localStorage 存储类型
             */
            let storageType = {
                positive: this.tag_positive,
                negative: this.tag_negative
            };
            Storages.setItem(item, storageType[item]);
        },

        /**
         * 初始化 localStorage
         */
        storage_init() {
            //TODO: 初始化完整, negative 还没搞定
            this.storageSet_read('positive');
            // this.storageSet_read('negative')

            this.renderOutput();
        }
    }
});
