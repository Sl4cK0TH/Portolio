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
        statusEl.textContent = 'Sending...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                statusEl.textContent = 'Message sent! I will get back to you soon.';
                form.reset();
            } else {
                // Try to get more specific error from Formspree
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        statusEl.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        statusEl.textContent = 'Oops! There was a problem submitting your form.';
                    }
                }).catch(() => {
                    statusEl.textContent = 'Oops! There was a problem submitting your form.';
                });
                throw new Error('Form submission failed');
            }
        } catch (error) {
            statusEl.classList.add('error');
            // Avoid duplicating the error message if already set
            if (!statusEl.textContent.startsWith('Oops!') && !statusEl.textContent.includes(',')) {
                statusEl.textContent = 'Unable to send right now. Please try again in a bit.';
            }
            console.error('Contact form submission error:', error);
        }
    });
});
