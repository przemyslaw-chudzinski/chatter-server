module.exports = class Collection {

    constructor(items = [], model) {
        this._items = items.length ? items.map(item => new model(item)) : [];
    }

    get items() {
        return this._items;
    }
};