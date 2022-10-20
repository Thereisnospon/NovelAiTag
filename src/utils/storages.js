/**
 * Storage 二次封装
 * @author Kesa
 */

const config = { namespace: 'prompt' };

// 简易版, 没有区分模块
export default {
    /**
     * 存储项目
     * @param {*} key 键
     * @param {*} val 值
     */
    setItem(key, val) {
        let storage = this.getStorage();
        storage[key] = val;
        // 结合 config 里面的命名空间
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },

    /**
     * 获取项目
     * @param {*} key 键
     * @returns 获取值
     */
    getItem(key) {
        return this.getStorage()[key];
    },

    /**
     * 获取整体 localStorage 内容
     * @returns
     */
    getStorage() {
        return JSON.parse(window.localStorage.getItem(config.namespace) || '{}');
    },

    /**
     * 清空指定项目 localStorage 内容
     * @param {} key
     */
    clearItem(key) {
        let storage = this.getStorage();
        delete storage[key];
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },

    /**
     *  localStorage 内容
     */
    clearAll() {
        window.localStorage.clear();
    }
};
