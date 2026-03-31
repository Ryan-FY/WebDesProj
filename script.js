// =====================
//      JOBS PAGE 
// =====================

document.addEventListener('DOMContentLoaded', function() {

    const searchForm = document.getElementById('searchForm');
    const resultsDiv = document.getElementById('results');
    const savedDiv = document.getElementById('saved-jobs');

    if (!searchForm) {
        return;   
    }

    let savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];

    // =====================
    //   RENDER SAVED JOBS
    // =====================
    function renderSavedJobs() {
        if (savedJobs.length === 0) {
            savedDiv.innerHTML = '<p>No jobs saved yet.</p>';
            return;
        }

        let html = '';

        savedJobs.forEach((job, index) => {
            html += `
              <div class="border p-4 mb-3 rounded-lg shadow">
                <strong>${job.title}</strong><br>
                Company: ${job.company}<br>
                <a href="${job.url}" target="_blank" class="text-blue-600">View Details →</a><br>
                <button onclick="removeSaved(${index})" class="text-red-500 mt-2">Remove</button>
              </div>
            `;
        });

        savedDiv.innerHTML = html;
    }

    // =====================
    //       SAVE JOB
    // =====================
    function saveJob(job) {
        if (!savedJobs.some(j => j.title === job.title)) {
            savedJobs.push(job);
            localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
            renderSavedJobs();
            alert('Job saved!');
        }
    }

    // =====================
    //    REMOVE SAVED JOB
    // =====================
    function removeSaved(index) {
        savedJobs.splice(index, 1);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        renderSavedJobs();
    }

    // =====================
    //     SEARCH JOBS
    // =====================
    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const keyword = document.getElementById('keyword').value.trim();
        if (!keyword) return;

        resultsDiv.innerHTML = '<p>Loading jobs...</p>';

        try {
            const response = await fetch(`https://www.arbeitnow.com/api/job-board-api?search=${keyword}`);
            const data = await response.json();

            resultsDiv.innerHTML = '';

            if (data.data && data.data.length > 0) {

                const filteredJobs = data.data.filter(job => 
                    job.location?.toLowerCase().includes('remote') ||
                    job.location?.toLowerCase().includes('mauritius')
                );

                const jobsToDisplay = filteredJobs.length > 0 ? filteredJobs : data.data;

                jobsToDisplay.forEach(job => {
                    const card = document.createElement('div');
                    card.className = 'border p-4 mb-3 rounded-lg shadow';

                    card.innerHTML = `
                      <strong>${job.title}</strong><br>
                      Company: ${job.company_name || 'Not listed'}<br>
                      Location: ${job.location || 'Remote'}<br>
                      <a href="${job.url}" target="_blank" class="text-blue-600">View Details →</a><br>
                      <button class="mt-2 text-pink-600">❤️ Save Job</button>
                    `;

                    card.querySelector('button').addEventListener('click', () => {
                        saveJob({
                            title: job.title,
                            company: job.company_name || 'Not listed',
                            url: job.url
                        });
                    });

                    resultsDiv.appendChild(card);
                });

            } else {
                resultsDiv.innerHTML = '<p>No jobs found.</p>';
            }

        } catch (error) {
            resultsDiv.innerHTML = '<p>Error loading jobs.</p>';
        }
    });

    // Loading saved jobs on startup
    renderSavedJobs();

});   // End of jobs section


/* ============================================
                Contact Form 
============================================ */

document.addEventListener('DOMContentLoaded', function() {

    const contactForm = document.getElementById('form');

    // In case contact form is NOT found
    if (!contactForm) {
        return;
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('full-name').value.trim();

        if (name) {
            alert(`Thank you, ${name}! Your message has been received. We will reply within 24 hours.`);
            contactForm.reset();
        } else {
            alert('Please fill in your name.');
        }
    });

});