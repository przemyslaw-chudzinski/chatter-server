// TODO: Remove in the future

const JsonResponse = require('../core/resource/json-response');

class ChannelResource extends JsonResponse {
    mapElement(item) {
        return item;
    }
}

module.exports = ChannelResource;
