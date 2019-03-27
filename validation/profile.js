const isEmpty = require('./is-empty');
const validator = require('validator');

module.exports = function validateProfileInput(data) {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    // Validates Handle
    if (!validator.isLength(data.handle, {
            min: 2,
            max: 40
        })) {
        errors.handle = 'Handle needs to be between 2 and 4 characters';
    }

    if (validator.isEmpty(data.handle)) {
        errors.handle = 'Profile Handle is required';
    }
    // Validates Status
    if (validator.isEmpty(data.status)) {
        errors.status = 'Status Handle is required';
    }

    if (validator.isEmpty(data.skills)) {
        errors.skills = 'Skills Handle is required';
    }
    // URL
    if (!isEmpty(data.website)) {
        if (!validator.isURL(data.website)) {
            errors.website = 'not a valid URL'
        }
    }
    // Social Media
    if (!isEmpty(data.youtube)) {
        if (!validator.isURL(data.youtube)) {
            errors.youtube = 'not a valid URL'
        }
    }
    if (!isEmpty(data.facebook)) {
        if (!validator.isURL(data.facebook)) {
            errors.facebook = 'not a valid URL'
        }
    }
    if (!isEmpty(data.twitter)) {
        if (!validator.isURL(data.twitter)) {
            errors.twitter = 'not a valid URL'
        }
    }
    if (!isEmpty(data.linkedin)) {
        if (!validator.isURL(data.linkedin)) {
            errors.linkedin = 'not a valid URL'
        }
    }
    if (!isEmpty(data.instagram)) {
        if (!validator.isURL(data.instagram)) {
            errors.instagram = 'not a valid URL'
        }
    }
    if (!isEmpty(data.twitch)) {
        if (!validator.isURL(data.twitch)) {
            errors.twitch = 'not a valid URL'
        }
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};