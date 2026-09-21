import type { Comment, CommentState } from './types.js';
import * as _ from 'lodash';

// todo: make this i18n ready
export function formatTimeAgo(timestamp: number): string {
    const secondsAgo = Math.floor((Date.now() - timestamp) / 1000);
    if (secondsAgo < 60) return 'just now';
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo}h ago`;
    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 30) return `${daysAgo}d ago`;
    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) return `${monthsAgo}mo ago`;
    const yearsAgo = Math.floor(monthsAgo / 12);
    return `${yearsAgo}y ago`;
}

export function renderComment(commentId: string, state: CommentState, activeReplyId: string | null, activeEditId: string | null): string {
    const comment: Comment | undefined = state.byId[commentId];
    if (!comment) return ''; // guard against invalid id's

    const repliesHtml = comment.replyIds.length > 0
        ? `<div class="replies">
        ${comment.replyIds.map(replyId => renderComment(replyId, state, activeReplyId, activeEditId)).join('')}</div>`
        : '';

    const isDeleted = comment.isDeleted;
    const sanitizedText = _.escape(comment.text);

    const isReplying = activeReplyId === comment.id;
    const replyBoxHtml = isReplying ? `
    <div class="inline-reply-box">
        <textarea placeholder="write a reply here..." rows="2" data-id="${comment.id}"></textarea>
        <div class="reply-box-actions">
            <button class="submit-reply-button" data-id="${comment.id}" >Submit</button>
            <button class="cancel-reply-button" data-id="${comment.id}">Cancel</button>
        </div>
    </div>
    ` : ``;

    let editBoxHtml: string = "";
    if (activeEditId === comment.id) {
        editBoxHtml = `
        <div class="edit-comment-box">
            <textarea placeholder="" rows="2" data-id="${comment.id}">${comment.text}</textarea>
            <div class="edit-box-actions">
                <button class="submit-edit-button" data-id="${comment.id}" >Submit</button>
                <button class="cancel-edit-button" data-id="${comment.id}">Cancel</button>
            </div>
        </div>
        `;
    }

    const commentContentHtml = !isDeleted ? `
    <div class="comment-content">
            <p>${sanitizedText}</p>
        </div>
    ` : `[comment deleted]`;

    const commentActionsHtml = !isDeleted ? `
        <div class="comment-actions">
            <button class="reply-button" data-action="reply" data-id="${comment.id}">Reply</button>
            <button class="edit-button" data-action="edit" data-id="${comment.id}">Edit</button>
            <button class="delete-button" data-action="delete" data-id="${comment.id}">Delete</button>
        </div>` : '';

    const commentHeaderHtml = !isDeleted ? `
        <div class="comment-header">
            <span class="comment-author">${comment.author}</span>
            <span class="comment-time">${formatTimeAgo(comment.createdAt)}</span>
            <span class="comment-votes">${comment.votes}</span>
        </div>` : `<div class="comment-header">[deleted comment]</div>`;

    const commentHtml = editBoxHtml === "" ? `
        ${commentHeaderHtml}
        ${commentContentHtml}
        ${commentActionsHtml}
    ` : ``;

    return `
    <div class="comment-card" data-id="${comment.id}">
        ${commentHtml}
        ${replyBoxHtml}
        ${editBoxHtml}
        ${repliesHtml}
    </div>
    `
}

export function renderWidget(state: CommentState, activeReplyId: string, activeEditId: string): string {
    return `
    <div class="comment-widget">
        <header class="widget-header">
        <h3>Comments</h3>
        </header>
        
        <!-- new comment box-->
        <div class="new-comment-box">
            <textarea placeholder="What are your thoughts?"></textarea>
            <button class="submit-comment">Submit</button>
        </div>

        <!-- commenf feed-->
        <div class="comment-feed">
            ${state.rootIds.map((commentId) => renderComment(commentId, state, activeReplyId, activeEditId)).join('')}
        </div>
    </div>
`
}