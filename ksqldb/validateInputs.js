/**
 * Executes a query to create a stream.
 *
 * <p>This method is used to create a stream.
 *
 * <p>This method is sql injection protected with the use of queryBuilder.
 *
 * @param {...array} args - a variable number of arrays (one for each argument to validate) that contains the following 4 possible elements:
 * <p>0: the argument to be validated</p>
 * 
 * 1: a string representing the intended data type of the argument
 * 
 * 2: a string representing the name of the argument (for helpful errors)
 * 
 * 3: an optional boolean indicating whether this argument is required - defaults to false if not provided. If required, the argument MUST be of tye type indicated. If not required, the argument can be of the type indicated, undefined, or null. 
 * 
 * @returns {void}
 * 
 */

const { invalidArgumentTypes } = require("./customErrors");

const validateInputs = (...args) => {
    const invalidArguments = [];
    
    // iterate through args to verify allowed types are provided
    for (let i = 0; i < args.length; i++) {
        const [currentArg, intendedType, actualType, required] = [args[i][0], args[i][1], typeof args[i][0], args[i][3] || false];

        if (intendedType === 'array') {
            if (!Array.isArray(currentArg)) invalidArguments.push(args[i]);
        }
        else if (required && actualType !== intendedType) invalidArguments.push(args[i]);
        else if (!required && currentArg !== undefined && currentArg !== null && actualType !== intendedType) invalidArguments.push(args[i]);
    }

    // craft error message if error needs to be thrown
    if (invalidArguments.length) {
        let errorMessage = '';

        for (let i = 0; i < invalidArguments.length; i++) {
            errorMessage += `argument "${invalidArguments[i][2]}" must be of type ${invalidArguments[i][1]}`;
            if (i < invalidArguments.length - 1) errorMessage += ', '
        }
        throw new invalidArgumentTypes(errorMessage);
    }
}

module.exports = validateInputs;