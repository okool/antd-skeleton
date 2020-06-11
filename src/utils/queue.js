export class Queue {

    /**
     * 初始列队名
     * @param {string} name 队列名 
     */
    constructor(name = 'default') {
        this.name = name
        window.queues[this.name] = [];
    }
    push(data) {
        window.queues[this.name].push(data);
    }
    pop() {
        return window.queues[this.name].shift();
    }
    delete(index) {
        window.queues[this.name].splice(index, 1);
    }
    get size() {
        return window.queues[this.name].length;
    }
    get isEmpty() {
        return !window.queues[this.name].length;
    }
    all() {
        return window.queues[this.name];
    }
    loop(callback) {
        if (!window.queues[this.name] || window.queues[this.name].length < 1) {
            return false;
        }
        for (let i in window.queues[this.name]) {
            const item = window.queues[this.name][i];
            callback(i, item)
        }
    }


}

export default Queue;