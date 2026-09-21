export interface Comment {
    id: string;
    author: string;
    text: string;
    createdAt: number;
    votes: number;
    parentId: string | null;
    isDeleted?: boolean;
    replyIds: string[];
}

export interface CommentState {
    byId: Record<string, Comment>;
    rootIds: string[];
}