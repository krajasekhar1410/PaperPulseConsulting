r // Include XLSX library (you'll need to add this script tag to index.html)
// <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    // Carousel functionality
    const carouselContainer = document.querySelector('.carousel-container');
    const projects = document.querySelectorAll('.project');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;

    function updateCarousel() {
        const width = projects[0].clientWidth;
        carouselContainer.style.transform = `translateX(-${currentIndex * width}px)`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? projects.length - 1 : currentIndex - 1;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === projects.length - 1) ? 0 : currentIndex + 1;
        updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);

    // Function to save data to text file
    function saveToTextFile(filename, content) {
        try {
            // Create a blob with the content
            const blob = new Blob([content], { type: 'text/plain' });

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;

            // Programmatically click the link to trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the URL object
            URL.revokeObjectURL(link.href);

            return true;
        } catch (error) {
            console.error('Error saving to text file:', error);
            return false;
        }
    }

    // Function to save data to Excel file
    function saveToExcel(filename, data, headers) {
        try {
            // Create workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data, { header: headers });

            // Auto-size columns
            const colWidths = headers.map(header => ({ wch: Math.max(header.length, 20) }));
            ws['!cols'] = colWidths;

            XLSX.utils.book_append_sheet(wb, ws, 'Submissions');

            // Save file
            XLSX.writeFile(wb, filename);
            return true;
        } catch (error) {
            console.error('Error saving to Excel:', error);
            return false;
        }
    }

    // Function to load existing Excel data
    function loadFromExcel(filename) {
        try {
            // For browser environment, we'll use localStorage as a simple alternative
            // since direct file reading from browser is restricted
            const stored = localStorage.getItem(filename);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading from Excel:', error);
            return [];
        }
    }

    // Function to generate AI solution
    function generateAISolution(problemDescription) {
        let solution = "Based on your problem description, we recommend the following approach:\n\n";

        if (/optimization|efficiency|process/i.test(problemDescription)) {
            solution += "- Conduct a thorough process audit.\n- Identify bottlenecks and inefficiencies.\n- Implement lean methodologies and automation where applicable.\n";
        }
        if (/digital|transformation|technology/i.test(problemDescription)) {
            solution += "- Assess current technology stack.\n- Develop a digital transformation roadmap.\n- Integrate modern ERP and data analytics tools.\n";
        }
        if (/data|analysis|insights/i.test(problemDescription)) {
            solution += "- Collect relevant operational data.\n- Use advanced analytics to uncover trends.\n- Apply predictive modeling for decision support.\n";
        }
        if (/improvement|workflow|performance/i.test(problemDescription)) {
            solution += "- Map existing workflows.\n- Engage stakeholders for feedback.\n- Implement continuous improvement cycles.\n";
        }
        if (solution === "Based on your problem description, we recommend the following approach:\n\n") {
            solution += "- Gather detailed information about the problem.\n- Analyze industry best practices.\n- Develop a customized solution framework.\n";
        }

        return solution;
    }

    // AI Tool form submission
    const aiForm = document.getElementById('ai-form');
    const problemInput = document.getElementById('problem-input');
    const aiResponse = document.getElementById('ai-response');
    const responseText = document.getElementById('response-text');

    aiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const problemDescription = problemInput.value.trim();
        if (!problemDescription) return;

        // Show loading state
        responseText.textContent = "Generating solution framework...";
        aiResponse.style.display = 'block';

        try {
            // Generate AI solution
            const solution = generateAISolution(problemDescription);

            // Create unique filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `ai_request_${timestamp}.txt`;

            // Prepare content for text file
            const content = `AI SOLUTION REQUEST
==================

Timestamp: ${new Date().toLocaleString()}
Request ID: ${Date.now()}

PROBLEM DESCRIPTION:
${problemDescription}

GENERATED SOLUTION:
${solution}

==================
PaperPulse Consulting - AI Framework Generator
`;

            // Save to text file
            const success = saveToTextFile(filename, content);

            if (success) {
                console.log('AI submission saved to text file');
                responseText.textContent = solution + `\n\n✅ Data saved to ${filename}`;
            } else {
                responseText.textContent = solution + '\n\n⚠️ Solution generated but file save failed';
            }

        } catch (error) {
            console.error('Error:', error);
            responseText.textContent = "Error generating solution. Please try again.";
        }
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name') || contactForm.querySelector('input[type="text"]').value;
        const email = formData.get('email') || contactForm.querySelector('input[type="email"]').value;
        const message = formData.get('message') || contactForm.querySelector('textarea').value;

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            // Create unique filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `contact_request_${timestamp}.txt`;

            // Prepare content for text file
            const content = `CONTACT FORM SUBMISSION
======================

Timestamp: ${new Date().toLocaleString()}
Request ID: ${Date.now()}

Name: ${name.trim()}
Email: ${email.trim()}
Message:
${message.trim()}

======================
PaperPulse Consulting - Contact Us
`;

            // Save to text file
            const success = saveToTextFile(filename, content);

            if (success) {
                console.log('Contact submission saved to text file');
                alert(`Thank you for your message! We will get back to you shortly.\n\n✅ Data saved to ${filename}`);
                contactForm.reset();
            } else {
                alert('Thank you for your message! We will get back to you shortly.\n\n⚠️ Message sent but file save failed');
                contactForm.reset();
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error sending message. Please try again.');
        }
    });
});
