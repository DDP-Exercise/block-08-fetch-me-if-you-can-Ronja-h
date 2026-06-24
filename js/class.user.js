"use strict";

/*******************************************************
 *  Users
 *
 *  See: https://jsonplaceholder.typicode.com/users
 *
 *  Your users should have:
 *      -id
 *      -name
 *      -username
 *      -email
 *      -website
 *
 *  You can skip address, phone and company.
 *
 *  users should also have posts[] (see main.js).
 *
 *  When printing a user, don't forget to make
 *      - href="mailto:.." for the email and
 *      - href=".." target="_blank" for the website.
 *  *******************************************************/
export default class User {
    constructor(userData) {
        this.id = userData.id;
        this.name = userData.name;
        this.username = userData.username;
        this.email = userData.email;
        this.posts = [];
    }

    addPost(post) {
        this.posts.push(post);
    }
}