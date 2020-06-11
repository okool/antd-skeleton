
export class Cache {

    constructor({ prefix = 'c', storage = 'localStorage', expire = Infinity }) {
        super();
        this.prefix = prefix;
        this.expire = typeof expire === 'number' ? expire : Infinity;
        this.storage = this._getStorageInstance(storage);
        this.isSupported = this._isStorageSupported(this.storage);
        if (!this.isSupported) {
            console.warn(`cache not support ${storage}.`);
        }
    }

    // 序列化
    _serialize(value, expire) {
        // 创建时间
        const c = (new Date).getTime();
        const e = typeof expire === 'number' ? c + expire * 1000 : this.expire;
        const data = {
            v: value,
            e,
            c,
        };
        return JSON.stringify(data);
    }

    // 反序列化
    _deserialize(data) {
        return data && JSON.parse(data);
    }

    // 缓存的Key
    _getCacheKey(key) {
        if (typeof key !== 'string') {
            console.warn(key + ' used as a key, but it is not a string.');
            key = String(key);
        }
        return this.prefix + ':' + key;
    }

    // 是否过期
    _checkCacheExpire(expire) {
        const timeNow = (new Date()).getTime();
        return expire > timeNow;
    }

    // 容量是否超
    _isQuotaExceeded(e) {
        var quotaExceeded = false;
        if (e) {
            if (e.code) {
                switch (e.code) {
                    case 22:
                        quotaExceeded = true;
                        break;
                    case 1014:
                        // Firefox
                        if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                            quotaExceeded = true;
                        }
                        break;
                }
            } else if (e.number === -2147024882) {
                // Internet Explorer 8
                quotaExceeded = true;
            }
        }
        return quotaExceeded;
    }

    // 获取KEY
    get(key) {
        const cKey = this._getCacheKey(key);
        const cacheData = this.storage.getItem(cKey);
        if (!cacheData) {
            return null;
        }
        const { e, v = null } = cacheData || {};
        if (this._checkCacheExpire(e)) {
            this.delete(key);
        } else {

        }

        return v;
    }

    /**
     * 设置数据
     * @param {*} key 键 
     * @param {*} value  值
     * @param {*} expire 过期时间
     */
    set(key, value, expire = Infinity) {
        const cKey = this._getCacheKey(key);
        if (value === undefined) {
            return this.delete(key);
        }
        const cValue = this._serialize(value, expire);
        try {
            this.storage.setItem(cKey, cValue);
            return true;
        } catch (e) {

            if (this._isQuotaExceeded(e)) {
                // 尝试清空过期

            } else {
                console.error(e);
            }
            return false;
        }
    }

    // 删除
    delete(key) {
        const cKey = this._getCacheKey(key);
        this.storage.removeItem(cKey);
        return true;
    }

    // 清空所有
    clear() {
        const length = this.storage.length;
        const deleteKeys = [];
        const _this = this;
        for (let i = 0; i < length; i++) {
            const key = this.storage.key(i);
            if (key && key.search(this.prefix + ':') === 0) {
                const { e } = this.storage.getItem(key) || {}
                deleteKeys.push(key);
            }
        }
        deleteKeys.forEach(function (key) {
            _this.delete(key);
        });
        return deleteKeys;
    }

    setEx(key, expire) {
        const value = this.get(key);
        this.set(key, value, expire);
    }

    // 清理空期
    deleteAllExpires() {
        const length = this.storage.length;
        const deleteKeys = [];
        const _this = this;
        for (let i = 0; i < length; i++) {
            const key = this.storage.key(i);
            if (key && key.search(this.prefix + ':') === 0) {
                const { e } = this.storage.getItem(key) || {}
                if (this._checkCacheExpire(e)) {
                    deleteKeys.push(key);
                }
            }
        }
        deleteKeys.forEach(function (key) {
            _this.delete(key);
        });
        return deleteKeys;
    }

    _getStorageInstance(storage) {
        var type = typeof storage;
        if (type === 'string' && window[storage] instanceof Storage) {
            return window[storage];
        }
        return storage;
    }

    _isStorageSupported(storage) {
        var supported = false;
        if (storage && storage.setItem) {
            supported = true;
            var key = '__' + Math.round(Math.random() * 1e7);
            try {
                storage.setItem(key, key);
                storage.removeItem(key);
            } catch (err) {
                supported = false;
            }
        }
        return supported;
    }

}

export default Cache;