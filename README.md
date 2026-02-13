# my-react-frontend-2

React + Vite frontend for week 9 assignment.

## Setup

```bash
npm install
npm run dev
```

Default URL: http://localhost:5173

Set API URL in `.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Profile Page

Route: `/profile` (authenticated)

Current profile management features:

- Display profile fields: `ID`, `First name`, `Last name`, `Email`, `Profile image`
- Update first/last name via backend `PATCH /api/user/profile`
- Upload profile image via `multipart/form-data` to `POST /api/user/profile/image`
- Restrict upload input to image files
- Remove profile image via `DELETE /api/user/profile/image`
