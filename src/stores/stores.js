import { defineStore, acceptHMRUpdate } from 'pinia';

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
        }
    },

    actions: {
        // reset() {
        //     // this.count = 100;
        //     this.$reset();
        // }

        /**
         * 添加标签对象
         * @param {*} tag
         */
        addTag(tag, state) {
            // console.log(tag);

            let num = this.tagName.indexOf(tag.key);

            if (num == -1) {
                this.selectedTag.push(tag);
            } else {
                this.selectedTag[num].time += 1;
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
