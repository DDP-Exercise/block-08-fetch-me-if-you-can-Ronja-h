"use strict";

/*******************************************************
 *    Asynchronotrigger - 100p
 *
 *    This is your last assignment. Finish this to proof that
 *    you are a grown up now, who doesn't need to be held by
 *    the hand.
 *
 *    Create a users-class. Fetch the users, create Instances.
 *    - https://jsonplaceholder.typicode.com/users
 *
 *    Create a posts-class. Fetch the posts. create Instances.
 *    Assign them to the users (see userId in the posts).
 *    - https://jsonplaceholder.typicode.com/posts
 *
 *    Print the shit. Beautifully:
 *    List the 10 users. On click, expand them with their posts.
 *    Each Post should also have a Button to "load comments".
 *    Yes, you are correct. This is the perfect usecase for
 *    event-delegation! You can get the comments to a post from either
 *    - https://jsonplaceholder.typicode.com/posts/1/comments
 *    or
 *    - https://jsonplaceholder.typicode.com/comments?postId=1
 *    where "1" stands for the posts ID of course.
 *
 *    I believe in...
 *    Ronja - 2026-06-09
 *  *******************************************************/
import Post from "./class.post.js";
import User from "./class.user.js";

const app = document.querySelector("#app");
const userTemplate = document.querySelector("#user-template");
const postTemplate = document.querySelector("#post-template");
const commentTemplate = document.querySelector("#comment-template");

let allUsers = [];

async function loadUsers() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const userData = await response.json();

    const users = [];

    for (const user of userData) {
        const newUser = new User(user);
        users.push(newUser);
    }

    return users;
}
function assignPostsToUsers(userList, postList) {
    for (const currentPost of postList) {
        for (const currentUser of userList) {
            if (currentUser.id === currentPost.userId) {
                currentUser.addPost(currentPost);
            }
        }
    }
}

async function loadPosts() {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const postData = await response.json();

    const posts = [];

    for (const post of postData) {
        const newPost = new Post(post);
        posts.push(newPost);
    }

    return posts;
}

async function loadComments(postId) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    const commentData = await response.json();

    return commentData;
}
function renderUsers(userList) {
    app.innerHTML = "";

    for (const currentUser of userList) {
        const userElement = userTemplate.content.cloneNode(true);

        const userCard = userElement.querySelector(".user-card");
        const userName = userElement.querySelector(".user-name");
        const userEmail = userElement.querySelector(".user-email");

        userCard.dataset.userId = currentUser.id;
        userName.textContent = currentUser.name;
        userEmail.textContent = currentUser.email;

        app.appendChild(userElement);
    }
}

function renderPosts(userCard, selectedUser) {
    const postsContainer = userCard.querySelector(".posts-container");

    if (postsContainer.innerHTML !== "") {
        postsContainer.innerHTML = "";
        return;
    }

    for (const currentPost of selectedUser.posts) {
        const postElement = postTemplate.content.cloneNode(true);

        const postCard = postElement.querySelector(".post-card");
        const postTitle = postElement.querySelector(".post-title");
        const postBody = postElement.querySelector(".post-body");

        postCard.dataset.postId = currentPost.id;
        postTitle.textContent = currentPost.title;
        postBody.textContent = currentPost.body;

        postsContainer.appendChild(postElement);
    }
}

function renderComments(commentsContainer, commentList) {
    commentsContainer.innerHTML = "";

    for (const currentComment of commentList) {
        const commentElement = commentTemplate.content.cloneNode(true);

        const commentName = commentElement.querySelector(".comment-name");
        const commentEmail = commentElement.querySelector(".comment-email");
        const commentBody = commentElement.querySelector(".comment-body");

        commentName.textContent = currentComment.name;
        commentEmail.textContent = currentComment.email;
        commentBody.textContent = currentComment.body;

        commentsContainer.appendChild(commentElement);
    }
}

app.addEventListener("click", async function(event) {
    const clickedCommentsButton = event.target.closest(".load-comments-button");

    if (clickedCommentsButton !== null) {
        const postCard = clickedCommentsButton.closest(".post-card");
        const commentsContainer = postCard.querySelector(".comments-container");
        const postId = Number(postCard.dataset.postId);

        commentsContainer.textContent = "Loading comments...";

        const comments = await loadComments(postId);

        renderComments(commentsContainer, comments);

        clickedCommentsButton.textContent = "comments loaded";
        clickedCommentsButton.disabled = true;

        return;
    }

    const clickedUserHeader = event.target.closest(".user-header");

    if (clickedUserHeader === null) {
        return;
    }

    const userCard = clickedUserHeader.closest(".user-card");
    const clickedUserId = Number(userCard.dataset.userId);

    const selectedUser = allUsers.find(currentUser => {
        return currentUser.id === clickedUserId;
    });

    if (selectedUser === undefined) {
        return;
    }

    renderPosts(userCard, selectedUser);
});

async function init() {
    const users = await loadUsers();
    const posts = await loadPosts();

    assignPostsToUsers(users, posts);

    allUsers = users;

    console.log(allUsers);
    renderUsers(allUsers);
}

init();