/**
 * Storage 二次封装
 * @author Kesa
 */

const config = { namespace: 'prompt' };

// 简易版, 没有区分模块
export default {
    setItem(key, val) {
        let storage = this.getStorage();
        storage[key] = val;
        // 结合 config 里面的命名空间
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },

    getItem(key) {
        return this.getStorage()[key];
    },

    getStorage() {
        return JSON.parse(window.localStorage.getItem(config.namespace) || '{}');
    },

    clearItem(key) {
        let storage = this.getStorage();
        delete storage[key];
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },

    clearAll() {
        window.localStorage.clear();
    }
};
