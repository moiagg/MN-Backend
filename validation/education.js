const isEmpty = require('./is-empty');
const validator = require('validator');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    // Validates Title
    if (validator.isEmpty(data.school)) {
        errors.school = 'School field is required';
    }

    // Validates Degree
    if (validator.isEmpty(data.degree)) {
        errors.degree = 'Degree field is required';
    }

    // Validates Field of Study
    if (validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = 'Field of Study field is required';
    }

    // Validates From
    if (validator.isEmpty(data.from)) {
        errors.from = 'From field is required';
    }



    return {
        errors,
        isValid: isEmpty(errors)
    }
}