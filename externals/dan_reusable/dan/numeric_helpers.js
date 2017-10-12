
// This namespace
// #require "dan.js"


// + Logarithms {{{

dan.logN = function (i_base, i_value)
// Logarithm to an arbitrary base.
//
// Params:
//  i_base:
//   (number)
//  i_value:
//   (number)
//
// Returns:
//  (number)
{
    return Math.log(i_value) / Math.log(i_base);
};

// + }}}

// + Modulus/wrapping {{{

dan.clockMod = function (i_value, i_upperBound)
// Modulus, in the sense of "clock arithmetic"
// (rather than in the sense of "remainder of division").
// Not the same as the '%' operator in C or JavaScript.
// Is the same as the '%' operator in Python.
//
// Params:
//  i_value: (number)
//  i_upperBound: (number)
//
// Returns:
//  (number)
//
// Note:
//  The '%' operator in C and JavaScript works in the sense of "remainder of division", ie.
//   positive, positive
//    5 / 4 = 1
//    5 % 4 = 1
//   negative, positive
//    -5 / 4 = -1
//    -5 % 4 = -1
//   positive, negative
//    5 / -4 = -1
//    5 % -4 = 1
//   negative, negative
//    -5 / -4 = 1
//    -5 % -4 = -1
//  Whereas this function works in the sense of "clock arithmetic", ie.
//   positive, positive
//    clockMod(5, 4) = 1
//   negative, positive
//    clockMod(-5, 4) = 3
//   positive, negative
//    clockMod(5, -4) = -3
//   negative, negative
//    clockMod(-5, -4) = -1
{
    if (i_upperBound < 0)
        return -dan.clockMod(-i_value, -i_upperBound);

    if (i_value < 0)
    {
        var rv = i_value % i_upperBound;
        if (rv != 0)
            rv += i_upperBound;
        return rv;
    }
    else
        return i_value % i_upperBound;
};


dan.wrapByClockMod = function (i_value, i_rangeStartOrEnd, i_rangeEnd)
// Wrap value to within a range.
//
// Implementation uses clock modulus. Quicker than the alternatives if the value is very far
// out of range.
//
// Params:
//  i_value:
//   (number)
//   Value to wrap.
//  i_rangeStartOrEnd:
//   (number)
//   Either, if i_rangeEnd is also specified
//    the start position of the range,
//   or if i_rangeEnd is omitted,
//    the end position of the range, which is non-inclusive (this end of the interval is open)
//    (start position is implied to be zero)
//  i_rangeEnd:
//   Either (number)
//    the end position of the range, which is non-inclusive (this end of the interval is open)
//   or (null or undefined)
//    The end position was passed in i_rangeStartOrEnd.
//
// Returns:
//  (number)
{
    // 2-argument version
    if (i_rangeEnd == undefined || i_rangeEnd == null)
    {
        return dan.clockMod(i_value, i_rangeStartOrEnd);
    }
    // 3-argument version
    else
    {
        return i_rangeStartOrEnd + dan.clockMod(i_value - i_rangeStartOrEnd, i_rangeEnd - i_rangeStartOrEnd);
    }
};

dan.wrapByAdd = function (i_value, i_rangeStartOrEnd, i_rangeEnd)
// Wrap value to within a range.
//
// Implementation uses repeated subtraction or addition. Quicker than the alternatives
// if the value is not very far out of range.
//
// Params:
//  i_value:
//   (number)
//   Value to wrap.
//  i_rangeStartOrEnd:
//   Either, if i_rangeEnd is also specified
//    the start position of the range,
//   or if i_rangeEnd is omitted,
//    the end position of the range, which is non-inclusive (this end of the interval is open)
//    (start position is implied to be zero)
//  i_rangeEnd:
//   Either (number)
//    the end position of the range, which is non-inclusive (this end of the interval is open)
//   or (null or undefined)
//    The end position was passed in i_rangeStartOrEnd.
//
// Returns:
//  (number)
{
    // 2-argument version
    if (i_rangeEnd == undefined || i_rangeEnd == null)
    {
        if (i_rangeStartOrEnd < 0)
            return -dan.wrapByAdd(-i_value, -i_rangeStartOrEnd);

        while (i_value >= i_rangeStartOrEnd)
            i_value -= i_rangeStartOrEnd;
        while (i_value < 0)
            i_value += i_rangeStartOrEnd;

        return i_value;
    }
    // 3-argument version
    else
    {
        return i_rangeStartOrEnd + dan.wrapByAdd(i_value - i_rangeStartOrEnd, i_rangeEnd - i_rangeStartOrEnd);
    }
};

dan.wrap = function (i_value, i_rangeStartOrEnd, i_rangeEnd)
// Wrap value to within a range, trying to choose an implementation intelligently.
// Implementation tries one subtraction or addition and returns if now in range.
// Else if value is still out of range then passes on to wrapByClockMod().
//
// Params:
//  i_value:
//   (number)
//   Value to wrap.
//  i_rangeStartOrEnd:
//   Either, if i_rangeEnd is also specified
//    the start position of the range,
//   or if i_rangeEnd is omitted,
//    the end position of the range, which is non-inclusive (this end of the interval is open)
//    (start position is implied to be zero)
//  i_rangeEnd:
//   Either (number)
//    the end position of the range, which is non-inclusive (this end of the interval is open)
//   or (null or undefined)
//    The end position was passed in i_rangeStartOrEnd.
//
// Returns:
//  (number)
{
    // 2-argument version
    if (i_rangeEnd == undefined || i_rangeEnd == null)
    {
        if (i_value >= i_rangeStartOrEnd)
            i_value -= i_rangeStartOrEnd;
        if (i_value < 0)
            i_value += i_rangeStartOrEnd;

        if (i_value >= i_rangeStartOrEnd || i_value < 0)
            return dan.wrapByClockMod(i_value, i_rangeStartOrEnd);
        else
            return i_value;
    }
    // 3-argument version
    else
    {
        return i_rangeStartOrEnd + dan.wrap(i_value - i_rangeStartOrEnd, i_rangeEnd - i_rangeStartOrEnd);
    }
};

dan.wrappedPointInRange = function (i_wrappedSpaceSize, i_rangeStart, i_rangeSize, i_point)
// Check whether a number is within a range,
// where both number and range exist in a circularly wrapped space.
//
// Params:
//  i_wrappedSpaceSize:
//   (number)
//   The size, or end position of the wrapped space, which is non-inclusive (this end of the
//   interval is open). (The start position of the wrapped space is always zero.)
//  i_rangeStart:
//   (number)
//   The start position of the range.
//  i_rangeSize:
//   (number)
//   The end position of the range, which is non-inclusive (this end of the interval is open).
//  i_point:
//   (number)
//   The position, to check whether is within the range.
//
// Returns:
//  (boolean)
{
    if (i_rangeSize >= 0)
    {
        // Wrap both range start and point to the clock bounds
        i_rangeStart = dan.wrap(i_rangeStart, i_wrappedSpaceSize);
        i_point = dan.wrap(i_point, i_wrappedSpaceSize);

        //
        if (i_point < i_rangeStart)
            i_point += i_wrappedSpaceSize;

        return (i_point >= i_rangeStart) && (i_point < i_rangeStart + i_rangeSize);
    }
    else
    {
        // Wrap both range start and point to the clock bounds
        i_rangeStart = dan.wrap(i_rangeStart, i_wrappedSpaceSize);
        i_point = dan.wrap(i_point, i_wrappedSpaceSize);

        //
        if (i_point > i_rangeStart)
            i_point -= i_wrappedSpaceSize;

        return (i_point <= i_rangeStart) && (i_point > i_rangeStart - i_rangeSize);
    }
};

dan.fract = function (i_value)
{
    //return i_value - Math.floor(i_value);
    if (i_value >= 0)
        return i_value % 1.0;
    else
        return (i_value % 1.0) + 1;
};

// + }}}

// + Bounce {{{

dan.bounceByClockMod = function (i_value, i_rangeStartOrEnd, i_rangeEnd)
// Bounce value to within a range.
//
// Implementation uses clock modulus. Quicker than the alternatives if the value is very far
// out of range.
//
// Params:
//  i_value:
//   (number)
//   Value to bounce.
//  i_rangeStartOrEnd:
//   (number)
//   Either, if i_rangeEnd is also specified
//    the start position of the range,
//   or if i_rangeEnd is omitted,
//    the end position of the range, which is bounced back from
//    (start position is implied to be zero)
//  i_rangeEnd:
//   Either (number)
//    the end position of the range, which is bounced back from
//   or (null or undefined)
//    The end position was passed in i_rangeStartOrEnd.
//
// Returns:
//  (number)
{
    // 2-argument version
    if (i_rangeEnd == undefined || i_rangeEnd == null)
    {
        if (i_rangeStartOrEnd < 0)
            return -dan.bounceByClockMod(-i_value, -i_rangeStartOrEnd);

        var doubledRangeEnd = i_rangeStartOrEnd * 2;
        var wrappedToDoubledRange = dan.clockMod(i_value, doubledRangeEnd);
        if (wrappedToDoubledRange < i_rangeStartOrEnd)
            return wrappedToDoubledRange;
        else
            return doubledRangeEnd - wrappedToDoubledRange;
    }
    // 3-argument version
    else
    {
        return i_rangeStartOrEnd + dan.bounceByClockMod(i_value - i_rangeStartOrEnd, i_rangeEnd - i_rangeStartOrEnd);
    }
};

dan.bounceByAdd = function (i_value, i_rangeStartOrEnd, i_rangeEnd)
// Bounce value to within a range.
//
// Implementation uses repeated subtraction or addition. Quicker than the alternatives
// if the value is not very far out of range.
//
// Params:
//  i_value:
//   (number)
//   Value to bounce.
//  i_rangeStartOrEnd:
//   Either, if i_rangeEnd is also specified
//    the start position of the range,
//   or if i_rangeEnd is omitted,
//    the end position of the range, which is bounced back from
//    (start position is implied to be zero)
//  i_rangeEnd:
//   Either (number)
//    the end position of the range, which is bounced back from
//   or (null or undefined)
//    The end position was passed in i_rangeStartOrEnd.
//
// Returns:
//  (number)
{
    // 2-argument version
    if (i_rangeEnd == undefined || i_rangeEnd == null)
    {
        if (i_rangeStartOrEnd < 0)
            return -dan.bounceByAdd(-i_value, -i_rangeStartOrEnd);

        var doubledRangeEnd = i_rangeStartOrEnd * 2;
        var wrappedToDoubledRange = dan.wrapByAdd(i_value, doubledRangeEnd);
        if (wrappedToDoubledRange < i_rangeStartOrEnd)
            return wrappedToDoubledRange;
        else
            return doubledRangeEnd - wrappedToDoubledRange;
    }
    // 3-argument version
    else
    {
        return i_rangeStartOrEnd + dan.bounceByAdd(i_value - i_rangeStartOrEnd, i_rangeEnd - i_rangeStartOrEnd);
    }
};

dan.bounce = function (i_value, i_rangeStartOrEnd, i_rangeEnd)
// Bounce value to within a range, trying to choose an implementation intelligently.
// Implementation tries one subtraction or addition and returns if now in range.
// Else if value is still out of range then passes on to bounceByClockMod().
//
// Params:
//  i_value:
//   (number)
//   Value to bounce.
//  i_rangeStartOrEnd:
//   Either, if i_rangeEnd is also specified
//    the start position of the range,
//   or if i_rangeEnd is omitted,
//    the end position of the range, which is bounced back from
//    (start position is implied to be zero)
//  i_rangeEnd:
//   Either (number)
//    the end position of the range, which is bounced back from
//   or (null or undefined)
//    The end position was passed in i_rangeStartOrEnd.
//
// Returns:
//  (number)
{
    // 2-argument version
    if (i_rangeEnd == undefined || i_rangeEnd == null)
    {
        if (i_rangeStartOrEnd < 0)
            return -dan.bounce(-i_value, -i_rangeStartOrEnd);

        var doubledRangeEnd = i_rangeStartOrEnd * 2;
        if (i_value >= doubledRangeEnd)
            i_value -= doubledRangeEnd;
        if (i_value < 0)
            i_value += doubledRangeEnd;

        if (i_value >= doubledRangeEnd || i_value < 0)
            return dan.bounceByClockMod(i_value, i_rangeStartOrEnd);
        else
        {
            if (i_value < i_rangeStartOrEnd)
                return i_value;
            else
                return doubledRangeEnd - i_value;
        }
    }
    // 3-argument version
    else
    {
        return i_rangeStartOrEnd + dan.bounce(i_value - i_rangeStartOrEnd, i_rangeEnd - i_rangeStartOrEnd);
    }
};

// + }}}

// + Clamping {{{

dan.clamp = function (i_value, i_rangeStart, i_rangeEnd)
// Params:
//  i_value:
//   (number)
//  i_rangeStart:
//   (number)
//   Minimum allowed value.
//  i_rangeEnd:
//   (number)
//   Maximum allowed value.
//
// Returns:
//  (number)
{
    if (i_value < i_rangeStart)
        return i_rangeStart;
    if (i_value > i_rangeEnd)
        return i_rangeEnd;
    return i_value;
};

// + }}}

// + Map values between linear and exponential ranges {{{

dan.mapLinToLin = function (i_value,
                            i_fromStart, i_fromEnd,
                            i_toStart, i_toEnd)
// Params:
//  i_value:
//   (number)
//  i_fromStart, i_fromEnd:
//   (number)
//  i_toStart, i_toEnd
//   (number)
//
// Returns:
//  (number)
{
    //return (i_value - i_fromStart) / (i_fromEnd - i_fromStart) * (i_toEnd - i_toStart) + i_toStart;
    return (i_value - i_fromStart) * (i_toEnd - i_toStart) / (i_fromEnd - i_fromStart) + i_toStart;
};

dan.linearBlend = function (i_position, i_valueAt0, i_valueAt1)
// Note that this would be equivalent: mapLinToLin(i_position, 0, 1, i_valueAt0, i_valueAt1)
//
// Params:
//  i_position:
//   (number)
//  i_valueAt0, i_valueAt1:
//   (number)
//
// Returns:
//  (number)
{
    return i_valueAt0*(1 - i_position) + i_valueAt1*i_position;
};

dan.mapLinToExp = function (i_value,
                            i_fromStart, i_fromEnd,
                            i_toStart, i_toEnd)
// Params:
//  i_value:
//   (number)
//  i_fromStart, i_fromEnd:
//   (number)
//  i_toStart, i_toEnd
//   (number)
//
// Returns:
//  (number)
{
    return Math.pow(i_toEnd / i_toStart,
                    // value in from range, 0..1
                    (i_value - i_fromStart) / (i_fromEnd - i_fromStart))
        * i_toStart;
};

dan.mapExpToLin = function (i_value,
                            i_fromStart, i_fromEnd,
                            i_toStart, i_toEnd)
// Params:
//  i_value:
//   (number)
//  i_fromStart, i_fromEnd:
//   (number)
//  i_toStart, i_toEnd
//   (number)
//
// Returns:
//  (number)
{
    return dan.logN(i_fromEnd / i_fromStart, i_value / i_fromStart)
        * (i_toEnd - i_toStart)
        + i_toStart;
};

dan.newMapLinToExp = function (i_value,
                               i_base,
                               i_fromStart, i_fromEnd,
                               i_toStart, i_toEnd)
// Params:
//  i_value:
//   (number)
//  i_base:
//   (number)
//   Previously i_toEnd / i_toStart
//  i_fromStart, i_fromEnd:
//   (number)
//  i_toStart, i_toEnd
//   (number)
//
// Returns:
//  (number)
{
    // i_value range is [i_fromStart .. i_fromEnd]
    i_value = (i_value - i_fromStart) / (i_fromEnd - i_fromStart);
    // i_value range is [0 .. 1]
    i_value = pow(i_base, i_value);
    // i_value range is [1 .. base]
    i_value -= 1;
    // i_value range is [0 .. base-1]
    i_value /= i_base - 1;
    // i_value range is [0 .. 1]
    i_value = i_value * (i_toEnd - i_toStart) + i_toStart;
    // i_value range is [i_toStart .. i_toEnd]

    /* Above code without temporaries
    i_value = (((pow(i_base,
                     (i_value - i_fromStart) / (i_fromEnd - i_fromStart)))
                - 1)
               / (i_base - 1))
        * (i_toEnd - i_toStart) + i_toStart;
    */

    // Suppress NaN
    if (isNaN(i_value))
        i_value = i_fromStart;

    // Suppress infinities
    if (!isFinite(i_value))
        i_value = 0.0;

    return i_value;
};

dan.newMapExpToLin = function (i_value,
                               i_base,
                               i_fromStart, i_fromEnd,
                               i_toStart, i_toEnd)
// Params:
//  i_value:
//   (number)
//  i_base:
//   (number)
//   Previously i_fromEnd / i_fromStart
//  i_fromStart, i_fromEnd:
//   (number)
//  i_toStart, i_toEnd
//   (number)
//
// Returns:
//  (number)
{
    // i_value range is [i_fromStart .. i_fromEnd]
    i_value = (i_value - i_fromStart) / (i_fromEnd - i_fromStart);
    // i_value range is [0 .. 1]
    i_value *= i_base - 1;
    // i_value range is [0 .. base-1]
    i_value += 1;
    // i_value range is [1 .. base]
    i_value = dan.logN(i_base, i_value);
    // i_value range is [0 .. 1]
    i_value = i_value * (i_toEnd - i_toStart) + i_toStart;
    // i_value range is [i_toStart .. i_toEnd]

    /* Above code without temporaries
    i_value = logN(i_base,
                   ((i_value - i_fromStart) / (i_fromEnd - i_fromStart)
                    * i_base - 1)
                   + 1)
        * (i_toEnd - i_toStart) + i_toStart;
    */

    // Suppress NaN
    if (isNaN(i_value))
        i_value = i_toStart;

    // Suppress infinities
    if (!isFinite(i_value))
        i_value = 0.0;

    return i_value;
};

// + }}}

// + Rounding {{{

dan.round = function (i_value)
// Round to nearest integer.
//
// In halfway cases always round up (towards +Infinity).
//
// Params:
//  i_value:
//   (number)
//
// Returns:
//  (number)
{
    return Math.floor(i_value + 0.5);
};

dan.roundToMultiple = function (i_value, i_multipleOf)
// Round to nearest multiple of a number.
//
// Params:
//  i_value:
//   (number)
//  i_multipleOf:
//   (number)
//
// Returns:
//  (number)
{
    var offset = dan.clockMod(i_value, i_multipleOf);
    if (offset < i_multipleOf / 2)
        return i_value - offset;
    else
        return i_value - offset + i_multipleOf;
};

dan.roundToDecimalPlaces = function (i_number, i_decimalPlaces)
// Round to a particular number of decimal places
//
// Params:
//  i_number:
//   (number)
//   The number to round.
//  i_decimalPlaces:
//   (integer number)
//   How many digits after the decimal point to keep.
//   A negative number will change successive numbers to the left of the decimal point to 0.
//
// Returns:
//  (number)
//  The rounded number.
{
    var multiplier = Math.pow(10, i_decimalPlaces);
    return Math.round(i_number * multiplier) / multiplier;
};

dan.roundToSignificantFigures = function (i_number, i_figures)
// Params:
//  i_number:
//   (number)
//   The number to round.
//  i_figures:
//   (integer number)
//   The number of significant figures to round to.
//
// Returns:
//  (number)
{
    var wasNegative = false;
    if (i_number < 0)
    {
        i_number = -i_number;
        wasNegative = true;
    }

    // Get count of digits before decimal point:
    // Get log{10} of the whole number part to get the number of multiplications of 10
    // to that number, then add 1 because 10 itself (for which log{10}(10) = 1)
    // actually has two digits and not one
    var digitsBeforeDecimalPoint = Math.floor(Math.log(i_number) / Math.LN10) + 1;

    //
    i_number *= Math.pow(10, i_figures - digitsBeforeDecimalPoint);
    i_number += 0.5;
    i_number = Math.floor(i_number);
    i_number /= Math.pow(10, i_figures - digitsBeforeDecimalPoint);

    if (wasNegative)
        i_number = -i_number;

    return i_number;
};

// + }}}

// + Powers of two {{{

dan.roundUpToNextPowerOfTwo = function (i_n)
// Round up to the next power of 2.
//
// Params:
//  i_n:
//   (number)
//
// Returns:
//  (integer number)
{
    // Ensure i_n is integer
    i_n = i_n >>> 0;

    // Subtract 1 before following process in case i_n is a power of 2 already
    i_n = i_n - 1;

    // From highest 1 bit, set 1 in every bit below it
    // eg. if i_n is now (binary) 10000
    i_n = i_n | (i_n >> 1);   // i_n = 11000
    i_n = i_n | (i_n >> 2);   // i_n = 11110
    i_n = i_n | (i_n >> 4);   // i_n = 11111
    i_n = i_n | (i_n >> 8);   // etc
    i_n = i_n | (i_n >> 16);  // for up to 32 bit numbers

    // Round back up to power of 2
    return i_n + 1;
};

dan.isPowerOfTwo = function (i_val)
// Params:
//  i_val:
//   (number)
//
// Returns:
//  (boolean)
{
    var intVal = i_val | 0;
    if (intVal != i_val)
        return false;

    return !(intVal == 0) && !(intVal & (intVal - 1));
};

// + }}}

// + Interpolation {{{
// [maybe this stuff should go to movement/easing.h?]

dan.mix = function (i_a, i_b, i_w)
// Linearly interpolate between two values
//
// [Similar to dan.linearBlend() but the parameters are in a different order,
// and they are clamped]
//
// Params:
//  i_a:
//   (number)
//   The start value.
//  i_b:
//   (number)
//   The end value.
//  i_w:
//   (number)
//   The current position, in range [0 .. 1].
//
// Returns:
//  (number)
{
    return i_a + (i_b - i_a)*Math.min(Math.max(i_w, 0.0), 1.0);
};

// + + Preprocessors for the weight parameter {{{

dan.cubicSCurve = function (i_x)
// Cubic S-curve, -2x^3 + 3x^2
//
// aka
//  Hermite blending function
//
// Params:
//  i_x:
//   Input in range [0..1]
//
// Returns:
//  Shaped output in range [0..1]
//  Corresponding 1st derivative is [0 .. 0]
//  Corresponding 2nd derivative is [6 .. -6]
//
// From
//  http://libnoise.sourceforge.net/noisegen/index.html
{
    //return -2*i_x*i_x*i_x + 3*i_x*i_x;
    return (-2*i_x + 3)*i_x*i_x;
};

dan.quinticSCurve = function (i_x)
// Quintic S-curve, 6x^5 - 15x^4 + 10x^3
//
// Params:
//  i_x:
//   Input in range [0..1]
//
// Returns:
//  Shaped output in range [0..1]
//  Corresponding 1st derivative is [0 .. 0]
//  Corresponding 2nd derivative is [0 .. 0]
//
// From
//  http://libnoise.sourceforge.net/noisegen/index.html
{
    //return 6*i_x*i_x*i_x*i_x*i_x - 15*i_x*i_x*i_x*i_x + 10*i_x*i_x*i_x;
    return ((6*i_x - 15)*i_x + 10)*i_x*i_x*i_x;
};

// + + }}}

dan.smoothstep = function (i_edge0, i_edge1, i_w)
// Interpolate backwards with a cubic s-curve.
//
// Params:
//  i_edge0:
//   (number)
//   Lower bound for i_w.
//  i_edge1:
//   (number)
//   Upper bound for i_w.
//  i_w:
//   (number)
//   Some position between i_edge0 and i_edge1.
//
// Returns:
//  (number)
//  Position in range [0 .. 1].
{
    if (i_w < i_edge0)
        return 0.0;
    if (i_w > i_edge1)
        return 1.0;

    var y = (i_w - i_edge0) / (i_edge1 - i_edge0);
    return y*y*(3.0 - 2.0*y);
};

dan.smootherstep = function (i_edge0, i_edge1, i_w)
// Interpolate backwards with a quintic s-curve.
//
// Params:
//  i_edge0:
//   (number)
//   Lower bound for i_w.
//  i_edge1:
//   (number)
//   Upper bound for i_w.
//  i_w:
//   (number)
//   Some position between i_edge0 and i_edge1.
//
// Returns:
//  (number)
//  Position in range [0 .. 1].
{
    if (i_w < i_edge0)
        return 0.0;
    if (i_w > i_edge1)
        return 1.0;

    var y = (i_w - i_edge0) / (i_edge1 - i_edge0);
    return y*y*y*(y*(y*6 - 15) + 10);
};

// + }}}

dan.sign = function (i_value)
// Get the sign of a number.
//
// Params:
//  i_value:
//   (number)
//   Number to get the sign of.
//
// Returns:
//  (number)
//  1 if i_value is positive or zero
//  -1 if i_value is negative
//
// Not quite the same as the GLSL function, as that returns 0.0 for i_value = 0.0
{
    if (i_value >= 0.0)
        return 1.0;
    else
        return -1.0;
};

dan.step = function (i_stepPosition, i_x)
// Step function.
//
// Params:
//  i_stepPosition:
//   (number)
//   Position of step.
//  i_x:
//   (number)
//   Current position.
//
// Returns:
//  (number)
//  0 if position has not yet reached step, else 1 if it has.
{
    if (i_x < i_stepPosition)
        return 0.0;
    else
        return 1.0;
};

