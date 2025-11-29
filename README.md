# Mini App - Frontend

Modern web application for posting and interacting with the community through like/dislike features. Designed to be embedded in an iframe and receive email from parent window via postMessage.

## 🚀 Features

### ✨ Main Features

-   **Post Creation**: Create and share posts with modern interface
-   **Like/Dislike**: Interact with posts using like and dislike
-   **Reaction History**: View previously liked/disliked posts
-   **Pagination**: Pagination for post lists
-   **Real-time Updates**: Automatic data updates after each action

### 🎨 UI/UX Features

-   **Modern Design**: Gradient backgrounds, glass morphism effects
-   **Responsive**: Optimized for all screen sizes
-   **Smooth Animations**: Smooth transitions and hover effects
-   **Bottom Navigation**: Fixed navigation menu at the bottom of the screen
-   **Sticky Form**: Post creation form sticky at the top with collapse/expand
-   **Auto-collapse**: Form automatically collapses after successful post creation

### 🔐 Integration

-   **PostMessage Support**: Receive token and appSessionId from parent window (iframe)
-   **Secure Communication**: Communicate with parent window via postMessage API

## 🛠️ Technologies Used

### Core

-   **React 19**: UI framework
-   **TypeScript**: Type safety
-   **Vite**: Build tool and dev server

### UI Libraries

-   **Ant Design 5**: Component library with Vietnamese locale
-   **TailwindCSS 4**: Utility-first CSS framework
-   **Ant Design Icons**: Icon library

### State Management & Data Fetching

-   **TanStack Query (React Query)**: Server state management and caching
-   **React Router 7**: Client-side routing

### HTTP Client

-   **Axios**: HTTP client with interceptors
-   **query-string**: URL parameter serialization

#### Axios Configuration

-   **Base URL**: `/api` (proxy to backend server)
-   **Timeout**: 30000ms (30 seconds)
-   **Response Interceptor**: Automatically extracts `response.data`
-   **Error Interceptor**: Returns `error.response.data` or `error`

### Utilities

-   **Day.js**: Date formatting with Vietnamese locale
-   **clsx**: Conditional class names
-   **jose**: JWT library (installed but not currently used)
-   **react-icons**: Icon library

## 📁 Directory Structure

```
FE/
├── src/
│   ├── api/                    # API layer
│   │   ├── axios-client.ts    # Axios configuration
│   │   └── index.ts            # API functions and types
│   ├── assets/                 # Static assets
│   ├── components/            # React components
│   │   ├── BottomNavbar.tsx   # Bottom navigation bar
│   │   ├── CreatePostForm.tsx # Post creation form
│   │   ├── PostCard.tsx       # Post display card
│   │   ├── PostList.tsx       # Post list
│   │   ├── MyReactionsList.tsx # Reactions list
│   │   ├── UserEmailInput.tsx # Email input (deprecated, not used)
│   │   └── index.ts            # Component exports
│   ├── constants/             # Constants
│   │   └── index.ts            # App constants (AMOUNT, CURRENCY)
│   ├── hooks/                  # Custom React hooks
│   │   ├── usePostMessage.ts  # Hook to receive postMessage from iframe
│   │   └── index.ts            # Hook exports
│   ├── pages/                  # Page components
│   │   ├── index/              # Home page
│   │   └── my-reactions/       # Reaction history page
│   ├── routes/                 # Route configuration
│   │   └── index.tsx           # Router setup
│   ├── index.css               # Global styles
│   └── main.tsx                # Entry point
├── public/                     # Public assets
├── package.json                # Dependencies
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Documentation
```

## 🚀 Installation and Running

### Requirements

-   Node.js 18+
-   pnpm (or npm/yarn)

### Install dependencies

```bash
cd FE
pnpm install
```

### Environment Configuration

Create a `.env` file in the `FE` directory:

```env
VITE_APP_URL_API=http://localhost:3000
```

**Note**:

-   `VITE_APP_URL_API`: URL of the backend API server

### Run development server

```bash
pnpm dev
```

The application will run at `http://localhost:8080`

### Build production

```bash
pnpm build
```

Output will be created in the `dist/` directory

### Preview production build

```bash
pnpm preview
```

## 📡 API Integration

### Base URL

API is proxied through `/api` and rewritten to the backend server configured in `vite.config.ts`.

### Endpoints Used

| Method | Endpoint              | Description                   | Auth Required |
| ------ | --------------------- | ----------------------------- | ------------- |
| GET    | `/posts`              | Get post list with pagination | Yes           |
| POST   | `/posts`              | Create new post               | Yes           |
| POST   | `/posts/:id/like`     | Like a post                   | Yes           |
| POST   | `/posts/:id/dislike`  | Dislike a post                | Yes           |
| GET    | `/posts/my-reactions` | Get user reaction history     | Yes           |

**Note**: All APIs requiring authentication use Bearer token in the `Authorization` header.

### API Client

File `src/api/index.ts` contains all API functions with TypeScript types:

```typescript
import { postApi } from "./api";

// Get post list (requires token)
const posts = await postApi.getPosts({
    token: "your-jwt-token",
    page: 1,
    limit: 10,
});

// Create new post (requires token)
const newPost = await postApi.createPost({
    content: "Post content",
    amount: 1,
    currency: "VNDC",
    appSessionId: "session-id",
    token: "your-jwt-token",
});

// Like post (requires token)
await postApi.likePost(postId, "your-jwt-token");

// Dislike post (requires token)
await postApi.dislikePost(postId, "your-jwt-token");

// Get reaction history (requires token)
const reactions = await postApi.getMyReactions({
    token: "your-jwt-token",
    page: 1,
    limit: 10,
});
```

## 🎣 Custom Hooks

### usePostMessage

Hook to receive token and appSessionId from parent window via postMessage:

```typescript
import { usePostMessage } from "./hooks/usePostMessage";

const { token, appSessionId } = usePostMessage();
```

**How it works**:

-   Hook listens for `message` events from parent window
-   Only processes messages with `type === "IFRAME_RESPONSE"`
-   Extracts `token` and `app_session_id` from `event.data.data`
-   Returns `token` and `appSessionId` for use in components

**Message format from parent window**:

```typescript
{
    type: "IFRAME_RESPONSE",
    data: {
        token: string,
        app_session_id: string
    }
}
```

**Note**:

-   Hook does not verify JWT token (token is used directly for API calls)
-   Hook does not extract email from token (email is retrieved from API response)
-   Hook does not automatically send messages to parent window

## 📦 Constants

File `src/constants/index.ts` contains constants used in the application:

-   **AMOUNT**: `1000` - Default amount when creating a post
-   **CURRENCY**: `"VNDC"` - Default currency type (VNDC or USDT)

These constants are used in `CreatePostForm` when creating new posts.

## 🧩 Components

### BottomNavbar

Fixed navigation menu at the bottom of the screen with 2 menu items:

-   Home
-   Reaction History

### CreatePostForm

Post creation form with features:

-   Sticky at the top of the page
-   Collapse/Expand
-   Auto-collapse after successful post creation
-   Click outside to collapse

### PostCard

Post display card with:

-   Author information and timestamp
-   Post content
-   Like/Dislike buttons with counts
-   Highlight current user's reaction
-   Memoized for performance optimization

### PostList

Post list with:

-   Loading states
-   Error handling
-   Pagination
-   Empty states

### MyReactionsList

Reactions list with tabs:

-   "Liked" tab
-   "Disliked" tab
-   Stats showing total count
-   Pagination

## 🎨 Styling

### TailwindCSS

Uses TailwindCSS 4 with utility classes for styling.

### Custom CSS

File `src/index.css` contains:

-   Custom message styles (success, error, warning)
-   Ant Design message container styling
-   Global styles

### Design System

-   **Colors**: Blue → Indigo → Purple gradient theme
-   **Shadows**: Layered shadows for depth
-   **Border Radius**: Rounded corners (rounded-xl, rounded-2xl)
-   **Transitions**: Smooth animations (duration-200, duration-300)

## 🔄 State Management

### React Query

Uses TanStack Query for server state management:

-   Automatic caching
-   Background refetching
-   Optimistic updates
-   Error handling

### Local State

Uses React hooks (`useState`, `useRef`) for local component state.

## 📱 Routes

| Path            | Component       | Description              |
| --------------- | --------------- | ------------------------ |
| `/`             | HomePage        | Home page with post list |
| `/my-reactions` | MyReactionsPage | Reaction history page    |

## 🔧 Configuration

### Vite Config

-   **Port**: 8080
-   **Proxy**: `/api` → `VITE_APP_URL_API`
-   **Alias**: `@` → `src/`
-   **Plugins**: React, TailwindCSS
-   **Build Tool**: rolldown-vite (faster build performance)

### React Query Config

-   **staleTime**: 2000ms
-   **refetchInterval**: 15 minutes (1000 _60_ 15)
-   **retry**: 0 (no automatic retry)
-   **placeholderData**: keepPreviousData
-   **mutations.retry**: 0
-   **mutations.networkMode**: "online"

## 🐛 Development

### Linting

```bash
pnpm lint
```

### Type Checking

```bash
tsc --noEmit
```

## 📦 Build & Deploy

### Build

```bash
pnpm build
```

### Environment Variables

Ensure the following environment variables are set in production environment:

-   `VITE_APP_URL_API`: URL of the backend API server

### Deploy

Can be deployed to:

-   Vercel
-   Netlify
-   GitHub Pages
-   Any static hosting service

## 🔐 Security

### PostMessage

-   Listens for messages from parent window with type `IFRAME_RESPONSE`
-   Extracts token and appSessionId from message data
-   Token is used directly for API authentication (not verified)
-   Email is retrieved from API response, not extracted from token

### API

-   Proxied through Vite dev server in development
-   CORS handled by backend

## 📝 Notes

-   Token and appSessionId are received from parent window via postMessage (type: `IFRAME_RESPONSE`)
-   Email is retrieved from API response, not extracted from token
-   All API endpoints require Bearer token in the `Authorization` header
-   Post creation form automatically collapses after successful post creation
-   Form collapses when clicking outside or blurring if there's no content
-   Bottom navbar always displays at the bottom of the screen (fixed position)
-   All timestamps are formatted in Vietnamese (dayjs locale)
-   React Query automatically invalidates queries after mutations to update UI
-   PostCard component is memoized for performance optimization
-   Constants `AMOUNT` (1000) and `CURRENCY` ("VNDC") are used when creating posts
-   PostList only renders when token is available (enabled: !!token)

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push and create Pull Request

## 📄 License

ISC
