const Collection = require('../collection/collection');

class JsonResponse {

    mapElement(item) {
        return item;
    }

    collection(collection, data = null) {
        if (collection instanceof Collection) {
            return {
                data: collection.items.map(item => this.mapElement(item, data))
            };
        }
        return {
            data: []
        };
    }

    singular(model) {
        return this.mapElement(model);
    }

}

module.exports = JsonResponse;