const JsonResponse = require('../core/resource/json-response');

class MessageResource extends JsonResponse {

    mapElement(item, data) {
        item.author = data.author;
        return item;
    }

}

module.exports = MessageResource;