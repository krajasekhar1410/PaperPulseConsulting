# PaperPulse Consulting Backend

This backend stores form submissions from the PaperPulse Consulting website, including AI tool interactions and contact form submissions.

## Features

- **AI Tool Submissions**: Stores user problems and generated solutions
- **Contact Form Submissions**: Stores contact inquiries
- **Data Storage**: Uses JSON files for easy access and management
- **Admin Access**: View all submissions via admin endpoint

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Access Points**
   - Frontend: Open `index.html` in your browser
   - Backend API: `http://localhost:3001`
   - Admin Dashboard: `http://localhost:3001/api/admin/submissions`

## Data Storage

Submissions are stored in JSON files in the `data/` directory:
- `data/ai_submissions.json` - AI tool interactions
- `data/contact_submissions.json` - Contact form submissions

## API Endpoints

### AI Submissions
- `POST /api/ai-submission` - Store AI tool interaction
  ```json
  {
    "problem": "User's problem description",
    "solution": "Generated solution",
    "timestamp": "ISO timestamp"
  }
  ```

### Contact Submissions
- `POST /api/contact-submission` - Store contact form data
  ```json
  {
    "name": "User name",
    "email": "user@example.com",
    "message": "Contact message",
    "timestamp": "ISO timestamp"
  }
  ```

### Admin Access
- `GET /api/admin/submissions` - View all stored submissions

## Deployment

For production deployment, consider:
1. Using environment variables for configuration
2. Setting up proper CORS policies
3. Adding authentication for admin endpoints
4. Using a database instead of JSON files for scalability

## File Structure

```
PaperPulse/
├── index.html          # Frontend website
├── script.js           # Frontend JavaScript
├── styles.css          # Frontend styles
├── server.js           # Backend server
├── package.json        # Node.js dependencies
├── data/               # Data storage directory
│   ├── ai_submissions.json
│   └── contact_submissions.json
└── README.md           # This file
```

## Security Notes

- Admin endpoint should be protected in production
- Consider adding rate limiting for form submissions
- Validate input data on both frontend and backend
- Use HTTPS in production
