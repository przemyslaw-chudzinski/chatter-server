const JsonResponse = require('../core/resource/json-response');

class NotificationResource extends JsonResponse {

    mapElement(item) {
        return item;
    }

}

module.exports = NotificationResource;