import postRepository from "../repositories/postRepository.js";
import userRepository from "../repositories/userRepository.js";

class PostService {
    async createPost(userId, postData) {
        // If userId wasn't provided as a route param, fall back to form body
        const effectiveUserId = userId || postData.userId;

        let user = null;
        if (effectiveUserId) {
            user = await userRepository.findById(effectiveUserId);
            if (!user) throw new Error("Usuario no encontrado");
        }

        // Normalize hastags to array
        const tags = Array.isArray(postData.hastags)
            ? postData.hastags
            : (postData.hastags ? [postData.hastags] : []);

        const payload = {
            title: postData.title,
            content: postData.content,
            hastags: tags.filter(Boolean).map(t => String(t).trim()).filter(t => t.length > 0),
            imageUrl: postData.imageUrl,
        };
        if (user) payload.user = user._id;

        return await postRepository.create(payload);
    }

    async getPost(postId){
        return await postRepository.findById(postId);
    }

    async getPosts() {
        return await postRepository.findAll();
    }

    async getPostsByUser(userId) {
        return await postRepository.findByUser(userId);
    }

    async updatePost(postId, postData) {
        const tags = Array.isArray(postData.hastags)
            ? postData.hastags
            : (postData.hastags ? [postData.hastags] : []);

        const payload = {
            title: postData.title,
            content: postData.content,
            hastags: tags.filter(Boolean).map(t => String(t).trim()).filter(t => t.length > 0),
            imageUrl: postData.imageUrl,
        };
        return await postRepository.update(postId, payload);
    }

    async deletePost(postId) {
        return await postRepository.delete(postId);
    }
}

export default new PostService();