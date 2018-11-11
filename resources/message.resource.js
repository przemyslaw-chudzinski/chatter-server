const JsonResponse = require('../core/resource/json-response');

class MessageResource extends JsonResponse {

    mapElement(item) {
        return item;
    }

}

module.exports = MessageResource;