export class PasswordHelper {
    static validatePassword(password) {
        if (!password) throw new Error('You should pass your password');
        let lowerCaseExp = /^(?=.*[a-z])/;
        let upperCaseExp = /(?=.*[A-Z])/;
        let numericCharecter = /(?=.*[0-9])/;
        let specialCharecter = /(?=.[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/;
        let eightOrLongerCharecter = /(?=.{8,})/;

        if (password.match(lowerCaseExp) === null) {
            throw new Error('The password string must contain at least 1 lowercase alphabetical character');
        }
        if (password.match(upperCaseExp) === null) {
            throw new Error('The password string must contain at least 1 uppercase alphabetical character');
        }
        if (password.match(numericCharecter) === null) {
            throw new Error('The password string must contain at least 1 numeric character');
        }
        if (password.match(specialCharecter) === null) {
            throw new Error('The password string must contain at least one special character');
        }
        if (password.match(eightOrLongerCharecter) === null) {
            throw new Error('The password string must be eight characters or longer');
        }
        return true;
    }
}
