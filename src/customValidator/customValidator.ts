import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customStringBooleanOrEmpty', async: false })
export class CustomStringBooleaOrEmpty implements ValidatorConstraintInterface {
  validate(value: any) {
    if (
      value !== undefined &&
      typeof value !== 'boolean' &&
      value !== 'true' &&
      value !== 'false'
    ) {
      return false;
    }
    return true;
  }

  defaultMessage() {
    return 'the isActive field must be not given or boolean';
  }
}
