Issue:

JWT authentication token is stored in localStorage.

Why It Occurs:

localStorage can be accessed via JavaScript and is vulnerable to XSS attacks.

How I Would Fix It:

If given more time, I would:

Store JWT in HTTP-only cookies

Implement refresh tokens

Add token expiration handling

Add rate limiting on login endpoint

Implement proper error handling middleware