import { defineStore, acceptHMRUpdate } from 'pinia';
import { ElNotification } from 'element-plus';

export default defineStore({
    id: 'app',
    state: () => ({
        // count: 100,

        /**
         * 所有已选择信息,
         * key : 翻译名
         * content : 原英文名
         * time : 次数
         */
        selectedTag: [],

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
            return state.selectedTag.map(el => el.key);
        },

        /**
         * 查询指定 tag 的 times
         */
        tagNum(state) {
            return _key => {
                let item = state.selectedTag.find(user => user.key === _key);
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
        // reset() {
        //     // this.count = 100;
        //     this.$reset();
        // }

        /**
         * 增加 1 的标签对象
         * @param {*} tag
         */
        addTag(tag, state) {
            // console.log(tag);
            let num = this.tagName.indexOf(tag.key);

            //  没有在缓存中找到
            if (num == -1) {
                this.selectedTag.push(tag);
            }
            // 在缓存中找到了
            else {
                this.selectedTag[num].time += 1;
            }

            // console.log(this.selectedTag);

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
                    message: '没有数量就别瞎减哦',
                    type: 'info'
                });
            }
            // 在缓存中找到了
            else {
                // 刚好为1 -> 删掉
                if (this.selectedTag[num].time == 1) {
                    this.selectedTag.splice(num, 1);
                }
                // 不是1 -> 减1
                else {
                    this.selectedTag[num].time -= 1;
                }
            }

            // console.log(this.selectedTag);

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
                this.selectedTag.push(tag);
            }
            // 在缓存中找到了 -> 删掉
            else {
                this.selectedTag.splice(num, 1);
            }

            // console.log(this.selectedTag);

            this.renderOutput();
        },

        /**
         * 渲染最后输出 prompt
         */
        renderOutput() {
            let res = '';

            // 循环把字符串加好
            this.selectedTag.forEach(el => {
                if (el.time == 1) {
                    res += el.content;
                } else {
                    let prev = '{'.repeat(el.time - 1);
                    let next = '}'.repeat(el.time - 1);
                    let tmp = prev + el.content + next;
                    res += tmp;
                }
                res += ',';
            });

            // // slice 去掉最后的逗号
            // res = res.slice(0, res.length - 1);

            this.output = res;
            // console.log(res);
        }
    }
});
