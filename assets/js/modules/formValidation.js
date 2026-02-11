// formValidation.js - Form validation logic

import { getCurrentLanguage } from './languageSwitcher.js';
import { getTranslation } from './translations.js';

/**
 * Validate entire form data
 * Only email and phone are required
 * @param {Object} data - Form data object
 * @returns {Object} Errors object with field names as keys
 */
export function validateForm(data) {
    const errors = {};
    const lang = getCurrentLanguage();

    // Name validation (optional, but if filled - only letters and spaces)
    if (data.name && data.name.trim() !== '') {
        if (!/^[a-zA-Zа-яА-ЯіІїЇєЄґҐąćęłńóśźżĄĆĘŁŃÓŚŹŻäöüßÄÖÜàâæçéèêëïîôœùûüÿ\s'-]+$/.test(data.name.trim())) {
            errors.name = getTranslation('errors.name', lang);
        }
    }

    // Email validation (REQUIRED)
    if (!data.email || data.email.trim() === '') {
        errors.email = getTranslation('errors.required', lang);
    } else if (!isValidEmail(data.email)) {
        errors.email = getTranslation('errors.email', lang);
    }

    // Phone validation (REQUIRED)
    if (!data.phone || data.phone.trim() === '') {
        errors.phone = getTranslation('errors.required', lang);
    } else {
        const digits = data.phone.replace(/\D/g, '');
        if (digits.length < 7) {
            errors.phone = getTranslation('errors.phoneMin', lang);
        } else if (!isValidPhone(data.phone)) {
            errors.phone = getTranslation('errors.phone', lang);
        }
    }

    // Location validation (optional, but if filled - only letters, spaces, commas)
    if (data.location && data.location.trim() !== '') {
        if (!/^[a-zA-Zа-яА-ЯіІїЇєЄґҐąćęłńóśźżĄĆĘŁŃÓŚŹŻäöüßÄÖÜàâæçéèêëïîôœùûüÿ\s,'-]+$/.test(data.location.trim())) {
            errors.location = getTranslation('errors.locationFormat', lang);
        }
    }

    // Message validation (optional, but if filled - min 5, max 255)
    if (data.message && data.message.trim() !== '') {
        if (data.message.trim().length < 5) {
            errors.message = getTranslation('errors.messageMin', lang);
        } else if (data.message.length > 255) {
            errors.message = getTranslation('errors.messageTooLong', lang);
        }
    }

    return errors;
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate phone number (basic check)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
export function isValidPhone(phone) {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Should have at least 10 digits
    return digits.length >= 10;
}

/**
 * Remove emoji from string
 * @param {string} str - String that may contain emoji
 * @returns {string} String without emoji
 */
export function removeEmoji(str) {
    if (!str) return str;
    return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu, '');
}

/**
 * Sanitize form data before submission
 * @param {Object} data - Raw form data
 * @returns {Object} Sanitized form data
 */
export function sanitizeFormData(data) {
    return {
        name: data.name ? removeEmoji(data.name) : '',
        email: data.email || '',
        phone: data.phone ? data.phone.replace(/\D/g, '') : '', // Remove all non-digits
        location: data.location ? removeEmoji(data.location) : '',
        budget: data.budget || '',
        message: data.message ? removeEmoji(data.message) : ''
    };
}