import userRepository from '../repositories/UserRepository.js';

class UserService {
    async getAll() {
        const users = await userRepository.getAll();
        return users.map(user => ({
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            birthDate: user.birthDate,
            url_profile: user.url_profile,
            adress: user.adress,
            roles: user.roles.map(r => r.name)
        }));
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            birthDate: user.birthDate,
            url_profile: user.url_profile,
            adress: user.adress,
            roles: user.roles.map(r => r.name)
        };
    }
}

export default new UserService();