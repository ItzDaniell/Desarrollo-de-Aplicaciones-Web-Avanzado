import postService from "../services/postService.js";
import userRepository from "../repositories/userRepository.js";

class PostController {
    async newForm(req, res) {
        try {
            const users = await userRepository.findAll();
            return res.render("create", { users });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            const { userId } = req.params; // puede venir undefined si no se usa
            await postService.createPost(userId, req.body);
            return res.redirect("/posts");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getPost(req, res) {
        try {
            const { postId } = req.params;
            const post = await postService.getPost(postId);
            if (!post) return res.status(404).json({ error: "Post no encontrado" });
            res.status(200).json(post);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const posts = await postService.getPosts();
            console.log(posts);
            res.render("posts", { posts }); // Renderiza la vista posts/index.ejs
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async edit(req, res) {
        try {
            const { postId } = req.params;
            const post = await postService.getPost(postId);
            res.render("edit", { post });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { postId } = req.params;
            await postService.updatePost(postId, req.body);
            return res.redirect("/posts");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { postId } = req.params;
            await postService.deletePost(postId);
            return res.redirect("/posts");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new PostController();
