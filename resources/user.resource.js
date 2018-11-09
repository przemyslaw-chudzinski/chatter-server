const JsonResponse = require('../core/resource/json-response');

class UserResource extends JsonResponse {

    mapElement(item) {
        return {
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            confirmed: item.confirmed,
            avatar: item.avatar,
            _id: item._id
        };
    }

}

module.exports = UserResource;