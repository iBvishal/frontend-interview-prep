import './style.css'
import { renderWidget } from './renderComment.js';
import { initialCommentState } from './mockData.js';
import { loadState, saveState } from './localStorage.js';
import type { CommentState, Comment } from './types.js';


const state: CommentState = loadState() || initialCommentState;
let activeReplyId: string | null = null;
let activeEditId: string | null = null;

const app = document.querySelector<HTMLDivElement>('#app');

async function handleReplyComment(id: string) {
  const comment = state.byId[id];
  if (!comment) return;

  const textArea = document.querySelector<HTMLTextAreaElement>('.inline-reply-box textarea');
  if (!textArea) return;

  const content = textArea.value.trim();
  if (content.length === 0) return;

  const newId = 'c_' + Date.now();
  const newComment: Comment = {
    id: newId,
    author: "Vishal",
    text: content,
    createdAt: Date.now(),
    votes: 0,
    parentId: id,
    replyIds: [],
  }

  state.byId[newComment.id] = newComment;
  comment.replyIds.push(newComment.id);

  textArea.value = "";
}

function handleAddComment() {
  const textArea = document.querySelector<HTMLTextAreaElement>('.new-comment-box textarea');
  if (!textArea) return;

  const content = textArea.value.trim();
  if (content.length === 0) return;

  const newId = 'c_' + Date.now();
  const newComment: Comment = {
    id: newId,
    author: "Vishal",
    text: content,
    createdAt: Date.now(),
    votes: 0,
    parentId: null,
    replyIds: [],
  }


  state.rootIds.unshift(newComment.id);
  state.byId[newComment.id] = newComment;

  textArea.value = "";
}

function handleEditComment(id: string) {
  const textArea = document.querySelector<HTMLTextAreaElement>('.edit-comment-box textarea');
  if (!textArea) return;

  const content = textArea.value.trim();
  if (content.length === 0) return;

  const comment = state.byId[id];
  if (!comment) return;

  comment.text = content;

  activeEditId = null;
}

function deleteComment(id: string) {
  const comment = state.byId[id];
  if (!comment) return;
  comment.isDeleted = true;
}

app?.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target) return;

  // A. Add top level Comment
  if (target.classList.contains('submit-comment')) {
    handleAddComment();
    saveAndRender();
    return;
  }

  // B. Reply
  if (target.classList.contains('reply-button')) {
    const parentId = target.dataset.id;
    activeReplyId = parentId || null;
    saveAndRender();
    return;
  }

  // C. Cancel Reply
  if (target.classList.contains('cancel-reply-button')) {
    activeReplyId = null;
    saveAndRender();
    return;
  }

  // D. Submit Reply
  if (target.classList.contains('submit-reply-button')) {
    const parentId = activeReplyId;
    activeReplyId = null;
    if (parentId) handleReplyComment(parentId);
    saveAndRender();
    return;
  }

  // E. edit comment
  if (target.classList.contains("edit-button")) {
    const id = target.dataset.id;
    if (!id) return;

    activeEditId = id;

    saveAndRender();
    return;
  }

  // F. cancel-edit-button
  if (target.classList.contains("cancel-edit-button")) {
    const id = target.dataset.id;
    if (!id) return;

    activeEditId = null;

    saveAndRender();
    return;
  }

  // G. submit-edit-button
  if (target.classList.contains("submit-edit-button")) {
    const id = target.dataset.id;
    if (!id) return;
    handleEditComment(id);
    activeEditId = null;
    saveAndRender();
    return;
  }

  //H. delete-comment-button
  if (target.classList.contains("delete-button")) {
    const id = target.dataset.id;
    if (!id) return;

    deleteComment(id);
    saveAndRender();
    return;
  }
})

function render() {
  if (!app) return;
  app.innerHTML = `${renderWidget(state, activeReplyId, activeEditId)}`
}

function saveAndRender() {
  saveState(state);
  render();
}

// initial paint
render();
