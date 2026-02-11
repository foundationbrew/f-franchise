import { validateForm, sanitizeFormData } from './formValidation.js';
import { setFieldError, clearAllErrors } from './textFields.js';
import { getCurrentLanguage } from './languageSwitcher.js';

const API_URL = 'https://api.foundationcoffee.pl/api/v2/forms/franchise/submit';

export function initForm() {
    const form = document.getElementById('reviewForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearAllErrors();

        const formData = getFormData();
        const errors = validateForm(formData);

        if (Object.keys(errors).length > 0) {
            displayErrors(errors);
            scrollToFirstError();
            return;
        }

        await submitForm(formData);
    });
}

export function getFormData() {
    const form = document.getElementById('reviewForm');
    const formData = new FormData(form);

    return {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        location: formData.get('location'),
        budget: formData.get('budget'),
        message: formData.get('message')
    };
}

export function displayErrors(errors) {
    Object.keys(errors).forEach(fieldName => {
        const fieldDiv = document.querySelector(`[data-field="${fieldName}"]`);
        if (!fieldDiv) return;
        setFieldError(fieldDiv, errors[fieldName]);
    });
}

export function scrollToFirstError() {
    const firstError = document.querySelector('.textfield_error');
    if (firstError) {
        const offset = firstError.getBoundingClientRect().top + window.pageYOffset - 64;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    }
}

export async function submitForm(data) {
    const submitBtn = document.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);

    const cleanData = sanitizeFormData(data);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(cleanData)
        });

        if (response.ok) {
            const lang = getCurrentLanguage();
            window.location.href = `./success.html?lang=${lang}`;
        } else if (response.status === 422) {
            const errorData = await response.json();
            if (errorData.errors) {
                displayErrors(errorData.errors);
                scrollToFirstError();
            }
        } else {
            throw new Error(`Server error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        // Можно показать пользователю сообщение об ошибке
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

function setButtonLoading(button, isLoading) {
    const btnLoader = button.querySelector('.btn__loader');

    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        btnLoader.style.display = 'block';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        btnLoader.style.display = 'none';
    }
}