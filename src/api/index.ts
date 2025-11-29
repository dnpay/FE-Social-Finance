import { axiosClient } from "./axios-client";

// Types
export interface Post {
    id: string;
    email: string;
    content: string;
    created_at: string;
    updated_at: string;
    likes: number;
    dislikes: number;
    user_reaction: "like" | "dislike" | null;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
}

export interface PostsResponse {
    success: boolean;
    data: Post[];
    pagination: Pagination;
}

export interface PostResponse {
    success: boolean;
    data: Post | null;
}

export interface CreatePostRequest {
    content: string;
    amount: number;
    currency: "VNDC" | "USDT";
    appSessionId: string;
    token: string;
}

export interface ReactionResponse {
    success: boolean;
    message: string;
    action: "liked" | "disliked" | "removed";
}

export interface MyReactionsResponse {
    success: boolean;
    data: {
        liked_posts: Post[];
        disliked_posts: Post[];
        total_liked: number;
        total_disliked: number;
        total_reactions: number;
    };
    pagination: Pagination;
}

// API Functions
export const postApi = {
    // Get all posts with pagination
    getPosts: async (params: {
        page?: number;
        limit?: number;
        token: string;
    }): Promise<PostsResponse> => {
        return axiosClient.get("/posts", {
            params: {
                page: params.page,
                limit: params.limit,
            },
            headers: {
                "Authorization": `Bearer ${params.token}`,
            },
        });
    },

    // Create new post
    createPost: async (data: CreatePostRequest): Promise<PostResponse> => {
        return axiosClient.post("/posts", {
            content: data.content,
            amount: data.amount,
            currency: data.currency,
            appSessionId: data.appSessionId,
        }, {
            headers: {
                "Authorization": `Bearer ${data.token}`,
            },
        });
    },

    // Like a post
    likePost: async (id: string, token: string): Promise<ReactionResponse> => {
        return axiosClient.post(`/posts/${id}/like`, undefined, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
    },

    // Dislike a post
    dislikePost: async (
        id: string,
        token: string
    ): Promise<ReactionResponse> => {
        return axiosClient.post(`/posts/${id}/dislike`, undefined, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
    },

    // Get my reactions history
    getMyReactions: async (params: {
        token: string;
        page?: number;
        limit?: number;
    }): Promise<MyReactionsResponse> => {
        return axiosClient.get("/posts/my-reactions", {
            params: {
                page: params.page,
                limit: params.limit,
            },
            headers: {
                "Authorization": `Bearer ${params.token}`,
            },
        });
    },
};

