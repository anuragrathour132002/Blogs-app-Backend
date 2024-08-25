
1. **Clone the Repository**

   ```bash
   git clone 'https://github.com/anuragrathour132002/Blogs-app-Frontend'
   cd backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```


## Running the Server

1. **Start the Server**

   ```bash
   npm start
   ```

   This command starts the server and listens on the port specified in the `.env` file (default is 3001).

## API Endpoints

### User Routes

- **Sign Up**
  
  - `POST /user/signup`
  - **Body**: `{ email: String, password: String }`
  - **Description**: Creates a new user.

- **Log In**
  
  - `POST /user/login`
  - **Body**: `{ email: String, password: String }`
  - **Description**: Authenticates a user and returns a token.

- **Log Out**
  
  - `GET /user/logout`
  - **Description**: Logs out the user and clears session data.

- **Get Current User**
  
  - `POST /user/currentUser`
  - **Headers**: `{ Authorization: Bearer <token> }`
  - **Description**: Retrieves the current logged-in user’s information.

### Post Routes

- **Create Post**
  
  - `POST /post/create-post/:userId`
  - **Body**: `{ title: String, content: String }`
  - **Params**: `userId`
  - **Description**: Creates a new post for a user.

- **View All Posts**
  
  - `GET /post/view-posts`
  - **Description**: Retrieves all posts.

- **View Post by ID**
  
  - `GET /post/view-post/:id`
  - **Params**: `id`
  - **Description**: Retrieves a specific post by ID.

- **Update Post by ID**
  
  - `PUT /post/update-post/:id`
  - **Params**: `id`
  - **Body**: `{ title: String, content: String }`
  - **Description**: Updates a specific post by ID.

- **Delete Post by ID**
  
  - `DELETE /post/delete-post/:id`
  - **Params**: `id`
  - **Description**: Deletes a specific post by ID.

- **Search Posts**
  
  - `GET /post/search`
  - **Query**: `title=<search-term>`
  - **Description**: Searches posts by title.

- **Fetch Comments**
  
  - `GET /post/fetchComments/:postId`
  - **Params**: `postId`
  - **Description**: Fetches comments for a specific post.

- **Add Comment**
  
  - `POST /post/addComments/:postId/:userId`
  - **Params**: `postId`, `userId`
  - **Body**: `{ comment: String }`
  - **Description**: Adds a comment to a post.

## Middleware

- **Authentication Middleware**

  - Used in routes to ensure that the user is authenticated. It checks if the user is logged in and has a valid session.

