//validation
export interface Validatable<T> {
    name: string;
    value: T;
    required?: boolean;
}

export interface ValidatableString extends Validatable<string> {
    minLength?: number;
    maxLength?: number;
}

export interface ValidatableNumber extends Validatable<number> {
    min?: number;
    max?: number;
}

export function validateNumber(validatable: ValidatableNumber) {

    if (validatable.max && !(validatable.value <= validatable.max))
        throw new Error(validatable.name + " must be less than or equal: " + validatable.max);

    if (validatable.min && !(validatable.value >= validatable.min))
        throw new Error(validatable.name + " must be greater than or equal: " + validatable.min);

    validate(validatable);
}

export function validateString(validatable: ValidatableString) {
    if (validatable.maxLength && !(validatable.value.length <= validatable.maxLength))
        throw new Error(validatable.name + " length must be less than or equal: " + validatable.maxLength);


    if (validatable.minLength && !(validatable.value.length >= validatable.minLength))
        throw new Error(validatable.name + " length must be greater than or equal: " + validatable.minLength);

    validate(validatable);
}

export function validate<T>(validatable: Validatable<T>) {
    if (validatable.required && validatable.value == null)
        throw new Error(validatable.name + " must have a value");
}
