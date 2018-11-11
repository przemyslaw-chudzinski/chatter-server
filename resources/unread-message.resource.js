const JsonResponse = require('../core/resource/json-response');

class UnreadMessageResource extends JsonResponse {

    mapElement(item) {
        return item;
    }

}

module.exports = UnreadMessageResource;