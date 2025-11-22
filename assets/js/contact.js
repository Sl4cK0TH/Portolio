document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form.contact-form');
    const statusEl = document.querySelector('.form-status');

    if (!form || !statusEl) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        statusEl.classList.remove('error');
        statusEl.textContent = '';

        if (!form.reportValidity()) {
            statusEl.classList.add('error');
            statusEl.textContent = 'Please fill in the required fields.';
            return;
        }

        const formData = new FormData(form);
        const encoded = new URLSearchParams(formData).toString();
        statusEl.textContent = 'Sending...';

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: encoded
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            statusEl.textContent = 'Message sent! I will get back to you soon.';
            form.reset();
        } catch (error) {
            statusEl.classList.add('error');
            statusEl.textContent = 'Unable to send right now. Please try again in a bit.';
            console.error('Contact form submission error:', error);
        }
    });
});
