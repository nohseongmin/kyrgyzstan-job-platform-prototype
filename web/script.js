document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle (visual interaction)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            alert('Здесь будет открываться мобильное меню.'); // Just for prototype
        });
    }

    // Form submission prevent default on search
    const searchForm = document.getElementById('searchForm');
    if(searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = searchForm.querySelector('.search-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Поиск...';
            
            // Simulate network request loading
            setTimeout(() => {
                btn.textContent = originalText;
                // Add a simple animation to grid items
                const cards = document.querySelectorAll('.job-card');
                cards.forEach((card, index) => {
                    card.style.opacity = '0.5';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        // Simple notification animation
                        card.style.transform = 'scale(1.02)';
                        setTimeout(() => card.style.transform = 'translateY(0)', 200);
                    }, index * 100);
                });
            }, 600);
        });
    }

    // Dynamic rendering of jobs from localStorage
    const jobsGrid = document.getElementById('jobsGrid');
    if (jobsGrid) {
        let jobs = JSON.parse(localStorage.getItem('arba_jobs') || '[]');
        
        jobs.forEach(job => {
            let employmentString = '';
            if (job.employmentType === 'full') employmentString = 'Полная занятость';
            else if (job.employmentType === 'part') employmentString = 'Частичная занятость';
            else if (job.employmentType === 'once') employmentString = 'Разовая работа';

            let salaryString = `от ${job.salaryFrom} сом`;
            if (job.salaryTo) salaryString = `${job.salaryFrom} - ${job.salaryTo} сом`;

            const logoLetter = job.company.charAt(0).toUpperCase();

            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
                <div class="job-card-header">
                    <div class="company-logo bg-orange">${logoLetter}</div>
                    <div class="job-title-area">
                        <h3>${job.title}</h3>
                        <span class="company-name">${job.company}</span>
                    </div>
                    <div class="like-btn"><ion-icon name="heart-outline"></ion-icon></div>
                </div>
                <div class="salary">${salaryString}</div>
                <div class="job-details">
                    <div class="detail"><ion-icon name="location-outline"></ion-icon> ${job.location}</div>
                    <div class="detail"><ion-icon name="time-outline"></ion-icon> ${employmentString}</div>
                </div>
                <div class="job-tags">
                    <span class="tag-sm blue">Новое</span>
                </div>
                <div class="card-footer">
                    <button class="apply-btn">Откликнуться</button>
                    <span class="date">${job.date}</span>
                </div>
            `;
            jobsGrid.prepend(card);
        });
    }

    // Event delegation for like-btn, apply-btn, job-card
    document.body.addEventListener('click', (e) => {
        // Like Button
        const likeBtn = e.target.closest('.like-btn');
        if (likeBtn) {
            e.stopPropagation(); // prevent card click
            const icon = likeBtn.querySelector('ion-icon');
            if (icon.getAttribute('name') === 'heart-outline') {
                icon.setAttribute('name', 'heart');
                icon.style.color = '#ef4444';
                icon.classList.add('heart-animation');
            } else {
                icon.setAttribute('name', 'heart-outline');
                icon.style.color = 'var(--text-muted)';
            }
            return;
        }

        // Apply Button
        const applyBtn = e.target.closest('.apply-btn');
        if (applyBtn) {
            e.stopPropagation(); // prevent card click
            window.location.href = 'apply-job.html';
            return;
        }

        // Card Click (Modal/Details)
        const jobCard = e.target.closest('.job-card');
        if (jobCard && !e.target.closest('.apply-btn') && !e.target.closest('.like-btn')) {
            window.location.href = 'apply-job.html';
        }
    });

    // Handling form submission for applying a job
    const applyJobForm = document.getElementById('applyJobForm');
    if (applyJobForm) {
        applyJobForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = document.getElementById('submitApplyBtn');
            const originalText = btn.textContent;
            btn.textContent = 'Отправлено ✓';
            btn.style.backgroundColor = '#10b981';

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    // Handling form submission for posting a job
    const postJobForm = document.getElementById('postJobForm');
    if (postJobForm) {
        postJobForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const jobData = {
                id: Date.now(),
                title: document.getElementById('jobTitle').value,
                category: document.getElementById('jobCategory').value,
                location: document.getElementById('jobLocation').options[document.getElementById('jobLocation').selectedIndex].text,
                employmentType: document.querySelector('input[name="employment_type"]:checked').value,
                salaryFrom: document.getElementById('jobSalaryFrom').value,
                salaryTo: document.getElementById('jobSalaryTo').value,
                date: 'Только что',
                company: 'Новая Компания'
            };

            let jobs = JSON.parse(localStorage.getItem('arba_jobs') || '[]');
            jobs.push(jobData); // Push to array to render prepend on load or keeping order stable. let index handles it.
            localStorage.setItem('arba_jobs', JSON.stringify(jobs));

            const btn = postJobForm.querySelector('.submit-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Опубликовано ✓';
            btn.style.backgroundColor = '#10b981';

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
});
