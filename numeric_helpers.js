
function lowTendingRandom(i_power, i_linearRandomGeneratorFunc)
// Params:
//  i_power:
//   (number)
//  i_linearRandomGeneratorFunc:
//   Either (function)
//    Function has:
//     Params:
//      -
//     Returns:
//      (float number)
//      In half-open range [0 .. 1)
//   or (null or undefined)
//    Use default of Math.random()
//
// FIXME:
//  If i_power is high, 
{
    if (i_linearRandomGeneratorFunc === null || i_linearRandomGeneratorFunc === undefined)
        i_linearRandomGeneratorFunc = Math.random;

    return Math.pow(i_linearRandomGeneratorFunc(), i_power);
}

function highTendingRandom(i_power, i_linearRandomGeneratorFunc)
// Params:
//  i_power:
//   (number)
//  i_linearRandomGeneratorFunc:
//   Either (function)
//    Function has:
//     Params:
//      -
//     Returns:
//      (float number)
//      In half-open range [0 .. 1)
//   or (null or undefined)
//    Use default of Math.random()
{
    return 1 - Number.EPSILON - lowTendingRandom(i_power, i_linearRandomGeneratorFunc);
}

function map01ToRange(i_value,
                      i_toStart, i_toEnd)
// Params:
//  i_value:
//   (number)
//  i_toStart, i_toEnd
//   (number)
//
// Returns:
//  (float number)
//  In half-open range [i_toStart .. i_toEnd)
{
    return (i_value * (i_toEnd - i_toStart)) + i_toStart;
};
