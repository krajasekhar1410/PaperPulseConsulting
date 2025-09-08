const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data storage paths
const AI_SUBMISSIONS_FILE = path.join(__dirname, 'data', 'ai_submissions.json');
const CONTACT_SUBMISSIONS_FILE = path.join(__dirname, 'data', 'contact_submissions.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize data files if they don't exist
if (!fs.existsSync(AI_SUBMISSIONS_FILE)) {
    fs.writeFileSync(AI_SUBMISSIONS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(CONTACT_SUBMISSIONS_FILE)) {
    fs.writeFileSync(CONTACT_SUBMISSIONS_FILE, JSON.stringify([], null, 2));
}

// Helper function to read data
function readData(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
}

// Helper function to write data
function writeData(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing data:', error);
    }
}

// API endpoint for AI tool submissions
app.post('/api/ai-submission', (req, res) => {
    const { problem, solution, timestamp } = req.body;

    if (!problem || !solution) {
        return res.status(400).json({ error: 'Problem and solution are required' });
    }

    const submissions = readData(AI_SUBMISSIONS_FILE);
    const newSubmission = {
        id: Date.now().toString(),
        problem,
        solution,
        timestamp: timestamp || new Date().toISOString(),
        ip: req.ip
    };

    submissions.push(newSubmission);
    writeData(AI_SUBMISSIONS_FILE, submissions);

    console.log('AI submission stored:', newSubmission.id);
    res.json({ success: true, id: newSubmission.id });
});

// API endpoint for contact form submissions
app.post('/api/contact-submission', (req, res) => {
    const { name, email, message, timestamp } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const submissions = readData(CONTACT_SUBMISSIONS_FILE);
    const newSubmission = {
        id: Date.now().toString(),
        name,
        email,
        message,
        timestamp: timestamp || new Date().toISOString(),
        ip: req.ip
    };

    submissions.push(newSubmission);
    writeData(CONTACT_SUBMISSIONS_FILE, submissions);

    console.log('Contact submission stored:', newSubmission.id);
    res.json({ success: true, id: newSubmission.id });
});

// Endpoint to get all submissions (for admin access)
app.get('/api/admin/submissions', (req, res) => {
    const aiSubmissions = readData(AI_SUBMISSIONS_FILE);
    const contactSubmissions = readData(CONTACT_SUBMISSIONS_FILE);

    res.json({
        ai_submissions: aiSubmissions,
        contact_submissions: contactSubmissions,
        total_ai: aiSubmissions.length,
        total_contacts: contactSubmissions.length
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`AI submissions stored in: ${AI_SUBMISSIONS_FILE}`);
    console.log(`Contact submissions stored in: ${CONTACT_SUBMISSIONS_FILE}`);
});
