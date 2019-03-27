const isEmpty = require('./is-empty');
const validator = require('validator');

module.exports = function validatePostInput(data) {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';

    // Validates Post
    if (!validator.isLength(data.text, {
            min: 10,
            max: 300
        })) {
        errors.text = 'Post must be between 10 and 300 characters.'
    }
    if (validator.isEmpty(data.text)) {
        errors.text = 'Text field is required';
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}