const isEmpty = require('./is-empty');
const validator = require('validator');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    // Validates Title
    if (validator.isEmpty(data.title)) {
        errors.title = 'Job title field is required';
    }

    // Validates Company
    if (validator.isEmpty(data.company)) {
        errors.company = 'Company field is required';
    }

    // Validates Title
    if (validator.isEmpty(data.from)) {
        errors.from = 'From field is required';
    }



    return {
        errors,
        isValid: isEmpty(errors)
    }
}