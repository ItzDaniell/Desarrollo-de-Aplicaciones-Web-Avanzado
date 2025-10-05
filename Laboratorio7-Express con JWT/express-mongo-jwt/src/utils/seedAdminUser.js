import userRepository from "../repositories/UserRepository.js";
import AuthService from "../services/AuthService.js";

export default async function seedAdminUser() {
    const email = "admin@example.com";
    const password = "Admin#2025";
    const existing = await userRepository.findByEmail(email);
        if (existing) {
            return;
    }
        await AuthService.signUp({
            email,
            password,
            name: "Admin",
            lastName: "Principal",
            phoneNumber: "999999999",
            birthDate: "1990-01-01",
            url_profile: "https://static.vecteezy.com/system/resources/thumbnails/036/885/313/small_2x/blue-profile-icon-free-png.png",
            adress: "Santa Anita, Lima, Peru",
            roles: ["admin"]
        });
}
