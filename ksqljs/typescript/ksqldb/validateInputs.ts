const validateInputs = (...args: []): void => {
  const invalidArguments: [] = [];

  // iterate through args to verify allowed types are provided
  for (let i = 0; i < args.length; i++) {
    const [currentArg, intendedType, actualType, required] = [
      args[i][0],
      args[i][1],
      typeof args[i][0],
      args[i][3] || false,
    ];

    if (intendedType === "array") {
      if (!Array.isArray(currentArg)) invalidArguments.push(args[i]);
    } else if (required && actualType !== intendedType)
      invalidArguments.push(args[i]);
    else if (
      !required &&
      currentArg !== undefined &&
      currentArg !== null &&
      actualType !== intendedType
    )
      invalidArguments.push(args[i]);
  }

  // craft error message if error needs to be thrown
  if (invalidArguments.length) {
    let errorMessage = "";

    for (let i = 0; i < invalidArguments.length; i++) {
      errorMessage += `argument "${invalidArguments[i][2]}" must be of type ${invalidArguments[i][1]}`;
      if (i < invalidArguments.length - 1) errorMessage += ", ";
    }
    throw new invalidArgumentTypes(errorMessage);
  }
};

module.exports = validateInputs;
