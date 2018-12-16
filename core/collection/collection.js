class Collection {

    constructor(items = [], model = null) {
        this._items = [];
        if (items.length && model) this._items = items.map(item => new model(item));
        else if (items.length && !model)  this._items = items;
    }

    get items() {
        return this._items;
    }

    set items(items) {
        this._items = items;
    }

    push(item) {
        this._items.add(item);
    }

    get length() {
        return this._items.length;
    }
}

module.exports = Collection;