const utilityFunctions = {};

utilityFunctions.getUnixRange = (days, hours, minutes) => {
    const unixTimeNow = Math.round(new Date().getTime() / 1000);
    const unixOffSet = minutes * 60 + hours * 60 * 60 + days * 60 * 60 * 24;
    return [unixTimeNow - unixOffSet, unixTimeNow]
};

utilityFunctions.getDuration = (days, hours, minutes) => {
    return (minutes * 60 + hours * 60 * 60 + days * 60 * 60 * 24) * 1000;
}

module.exports  = utilityFunctions;