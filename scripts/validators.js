export const regexRules = {
  // Forbid leading/trailing spaces, collapse doubles
  description: /^\S(?:.*\S)?$/,
  // Numeric amount: valid currency format up to 2 decimal places
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  // ISO Date: YYYY-MM-DD
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  // Category: letters, spaces, hyphens
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  // Advanced regex: check for duplicate adjacent words
  duplicateWords: /\b(\w+)\s+\1\b/i
};

export function validateRecord(data) {
    const errors = {};

    if (!data.description || !regexRules.description.test(data.description.trim())) {
        errors.description = ' Description is required and cannot start / end with spaces or be emmpty.';
    } else if (regexRules.dublicateWords.test(data.description)){
        errors.description = ' Note: Description cannot contain repeated adjacent words (Warning).';
    }

    if(!data.date || !regexRules.date.test(data.date)) {
        errors.date = 'Date must follow YYYY-MM-DD format.';
    }
    if(!date.category || !regexRules.category.test(data.category)){
        errors.category = 'category must contain only letters, spaces, or hyphens.';

    }

    return{
        isValid: Object.keys(errors).length === 0 || (Object.keys(errors).length === 1 && errors.description.includes('Note:')),errors
    };

}
