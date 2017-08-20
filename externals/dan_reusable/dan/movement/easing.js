
// This namespace
// #require "movement.js"


// + 1 parameter {{{

// 1-parameter versions with normalized ([0 .. 1]) input/output
//
// Based on https://github.com/warrenm/AHEasing/blob/master/AHEasing/easing.c
//
// Input position x runs from [0 .. 1]
// Input range runs from [0 .. 1]
// Output range runs from [0 .. 1]
//
// Params:
//  x:
//   Input position, in range [0 .. 1]
//
// Returns:
//  Output position, in range [0 .. 1]

// + + Linear {{{

dan.movement.ease_linear_in = function (x)
{
    // Modelled after the line y = x
    return x;
};

dan.movement.ease_linear_out = function (x)
{
    // Functional:
    // return 1 - ease_linear_in(1 - x);

    // Inlined/simplified:
    return x;
};

dan.movement.ease_linear_inOut = function (x)
{
    // Functional:
    // if (x < 0.5)
    //     return ease_linear_in(2 * x) / 2;
    // else
    //     return 1 - (ease_linear_in(2 * (1 - x)) / 2);

    // Inlined/simplified:
    return x;
};

// + + }}}

// + + Quadratic {{{

dan.movement.ease_quadratic_in = function (x)
{
    // Modelled after the parabola y = x^2
    return x * x;
};

dan.movement.ease_quadratic_out = function (x)
{
    // Functional:
    // return 1 - ease_quadratic_in(1 - x);

    // Inlined/simplified:
    return x * (2 - x);
};

dan.movement.ease_quadratic_inOut_inHalf = function (x)
{
    // Functional:
    // return ease_quadratic_in(2 * x) / 2;

    // Inlined/simplified:
    return 2 * x * x;
};

dan.movement.ease_quadratic_inOut_outHalf = function (x)
{
    // Functional:
    // return 1 - ease_quadratic_inOut_inHalf(1 - x);

    // Inlined/simplified:
    var xr = 1 - x;
    return 1 - 2 * xr * xr;
};

dan.movement.ease_quadratic_inOut = function (x)
{
    // Functional:
    // if (x < 0.5)
    //     return ease_quadratic_inOut_inHalf(x);
    // else
    //     return ease_quadratic_inOut_outHalf(x);

    // Inlined/simplified:
    if (x < 0.5)
        return 2 * x * x;
    else
    {
        var xr = 1 - x;
        return 1 - 2 * xr*xr;
    }
};

// + + }}}

// + + Cubic {{{

dan.movement.ease_cubic_in = function (x)
{
    // Modelled after the parabola y = x^3
    return x * x * x;
};

dan.movement.ease_cubic_out = function (x)
{
    // Functional:
    // return 1 - ease_cubic_in(1 - x);

    // Inlined/simplified:
    // var xr = 1 - x;
    // return 1 - xr * xr * xr;

    // Further optimized:
    return --x * x * x + 1;
};

dan.movement.ease_cubic_inOut_inHalf = function (x)
{
    // Functional:
    // return ease_cubic_in(2 * x) / 2;

    // Inlined/simplified:
    return 4 * x * x * x;
};

dan.movement.ease_cubic_inOut_outHalf = function (x)
{
    // Functional:
    // return 1 - ease_cubic_inOut_inHalf(1 - x);

    // Inlined/simplified:
    var xr = 1 - x;
    return 1 - 4 * xr * xr * xr;
};

dan.movement.ease_cubic_inOut = function (x)
{
    // Functional:
    // if (x < 0.5)
    //     return ease_cubic_inOut_inHalf(x);
    // else
    //     return ease_cubic_inOut_outHalf(x);

    // Inlined/simplified:
    if (x < 0.5)
        return 4 * x * x * x;
    else
    {
        var xr = 1 - x;
        return 1 - 4 * xr * xr * xr;
    }
};

// + + }}}

// + + Quartic {{{

dan.movement.ease_quartic_in = function (x)
{
    // Modelled after the parabola y = x^4
    return x * x * x * x;
};

dan.movement.ease_quartic_out = function (x)
{
    // Functional:
    // return 1 - ease_quartic_in(1 - x);

    // Inlined/simplified:
    // var xr = 1 - x;
    // return 1 - xr * xr * xr * xr;

    // Further optimized:
    return 1 - (--x * x * x * x);
};

dan.movement.ease_quartic_inOut_inHalf = function (x)
{
    // Functional:
    // return ease_quartic_in(2 * x) / 2;

    // Inlined/simplified:
    return 8 * x * x * x * x;
};

dan.movement.ease_quartic_inOut_outHalf = function (x)
{
    // Functional:
    // return 1 - ease_quartic_inOut_inHalf(1 - x);

    // Inlined/simplified:
    var xr = 1 - x;
    return 1 - 8 * xr * xr * xr * xr;
};

dan.movement.ease_quartic_inOut = function (x)
{
    // Functional:
    // if (x < 0.5)
    //     return ease_quartic_inOut_inHalf(x);
    // else
    //     return ease_quartic_inOut_outHalf(x);

    // Inlined/simplified:
    if (x < 0.5)
        return 8 * x * x * x * x;
    else
    {
        var xr = 1 - x;
        return 1 - 8 * xr * xr * xr * xr;
    }
};

// + + }}}

// + + Quintic {{{

dan.movement.ease_quintic_in = function (x)
{
    // Modelled after the parabola y = x^5
    return x * x * x * x * x;
};

dan.movement.ease_quintic_out = function (x)
{
    // Functional:
    // return 1 - ease_quintic_in(1 - x);

    // Inlined/simplified:
    // var xr = 1 - x;
    // return 1 - xr * xr * xr * xr * xr;

    // Futher optimized:
    return --x * x * x * x * x + 1;
};

dan.movement.ease_quintic_inOut_inHalf = function (x)
{
    // Functional:
    // return ease_quintic_in(2 * x) / 2;

    // Inlined/simplified:
    return 16 * x * x * x * x * x;
};

dan.movement.ease_quintic_inOut_outHalf = function (x)
{
    // Functional:
    // return 1 - ease_quintic_inOut_inHalf(1 - x);

    // Inlined/simplified:
    var xr = 1 - x;
    return 1 - 16 * xr * xr * xr * xr * xr;
};

dan.movement.ease_quintic_inOut = function (x)
{
    // Functional:
    // if (x < 0.5)
    //     return ease_quintic_inOut_inHalf(x);
    // else
    //     return ease_quintic_inOut_outHalf(x);

    // Inlined/simplified:
    if (x < 0.5)
        return 16 * x * x * x * x * x;
    else
    {
        var xr = 1 - x;
        return 1 - 16 * xr * xr * xr * xr * xr;
    }
};

// + + }}}

// + + Sinusoidal {{{

dan.movement.ease_sinusoidal_in = function (x)
{
    // Modelled after last quadrant of sine wave (shallow -> steep)
    //return Math.sin((x - 1) * Math.PI/2) + 1;

    // Optimized:
    return 1 - Math.cos(x * Math.PI / 2);
};

dan.movement.ease_sinusoidal_out = function (x)
{
    // Functional:
    // return 1 - ease_sinusoidal_in(1 - x);

    // Inlined/simplified:
    // (use first quadrant of sine wave instead (steep -> shallow))
    return Math.sin(x * Math.PI / 2);
};

dan.movement.ease_sinusoidal_inOut_inHalf = function (x)
{
    // Functional:
    // return ease_sinusoidal_in(2 * x) / 2;

    // Inlined/simplified:
    return 0.5 * (1 - Math.cos(x * Math.PI));
};

dan.movement.ease_sinusoidal_inOut_outHalf = function (x)
{
    // Functional:
    // return 1 - ease_sinusoidal_inOut_inHalf(1 - x);

    // Inlined/simplified:
    return 0.5 * (1 - Math.cos(x * Math.PI));
};

dan.movement.ease_sinusoidal_inOut = function (x)
{
    // Functional:
    // if (x < 0.5)
    //     return ease_sinusoidal_inOut_inHalf(x);
    // else
    //     return ease_sinusoidal_inOut_outHalf(x);

    // Inlined/simplified:
    return 0.5 * (1 - Math.cos(Math.PI * x));
};

// + + }}}

// + + Circular {{{

dan.movement.ease_circular_in = function (x)
{
    // Modelled after last quadrant of unit circle (horizontally shallow -> vertically steep)
    return 1 - Math.sqrt(1 - (x * x));
};

dan.movement.ease_circular_out = function (x)
{
    // Functional:
    // return 1 - ease_circular_in(1 - x);

    // Inlined/simplified:
    return Math.sqrt(x * (2 - x));
};

dan.movement.ease_circular_inOut_inHalf = function (x)
{
    // Functional:
    // return ease_circular_in(2 * x) / 2;

    // Inlined/simplified:
    return 0.5 * (1 - Math.sqrt(1 - 4 * (x * x)));
};

dan.movement.ease_circular_inOut_outHalf = function (x)
{
    // Functional:
    // return 1 - ease_circular_inOut_inHalf(1 - x);

    // Inlined/simplified:
    var xr = 1 - x;
    return 0.5 * (1 - Math.sqrt(1 - 4 * (xr * xr)));
};

dan.movement.ease_circular_inOut = function (x)
{
    // Functional:
    // if (x < 0.5)
    //     return ease_circular_inOut_inHalf(x);
    // else
    //     return ease_circular_inOut_outHalf(x);

    // Inlined/simplified:
    if (x < 0.5)
    {
        return 0.5 * (1 - Math.sqrt(1 - 4 * (x * x)));
    }
    else
    {
        var xr = 1 - x;
        return 0.5 * (1 - Math.sqrt(1 - 4 * (xr * xr)));
    }
};

// + + }}}

// + + Exponential {{{

dan.movement.ease_exponential_in = function (x)
{
    // Modelled after the exponential function y = 2^(10(x - 1))
    // return (x === 0.0) ?
    //     x :
    //     Math.pow(2, 10 * (x - 1));

    // Optimized:
    return (x === 0.0) ?
        x :
        Math.pow(1024, x - 1);
};

dan.movement.ease_exponential_out = function (x)
{
    // Functional:
    // return 1 - ease_exponential_in(1 - x);

    // Inlined/simplified:
    return (x == 1.0) ?
        x :
        1 - Math.pow(2, -10 * x);
};

dan.movement.ease_exponential_inOut_inHalf = function (x)
{
    // Functional:
    // return ease_exponential_in(2 * x) / 2;

    // Inlined/simplified:
    return (x == 0.0) ?
        x :
        0.5 * Math.pow(2, (20 * x) - 10);
};

dan.movement.ease_exponential_inOut_outHalf = function (x)
{
    // Functional:
    // return 1 - ease_exponential_inOut_inHalf(1 - x);

    // Inlined/simplified:
    return (x == 1.0) ?
        x :
        -0.5 * Math.pow(2, 10 - (20 * x)) + 1;
};

dan.movement.ease_exponential_inOut = function (x)
{
    // Functional:
    // if (x < 0.5)
    //     return ease_exponential_inOut_inHalf(x);
    // else
    //     return ease_exponential_inOut_outHalf(x);

    if (x < 0.5)
    {
        return (x == 0.0) ?
            x :
            0.5 * Math.pow(2, (20 * x) - 10);
    }
    else
    {
        return (x == 1.0) ?
            x :
            -0.5 * Math.pow(2, 10 - (20 * x)) + 1;
    }
};

// + + }}}

// TODO: Compare Back, Bounce and Elastic with the versions in Tween.js

// + + Back {{{

dan.movement.ease_back_in = function (x)
{
    // Modelled after the overshooting cubic y = x^3-x*sin(x*pi)
    return x * x * x - x * Math.sin(x * Math.PI);
};

dan.movement.ease_back_out = function (x)
{
    // Functional:
    // return 1 - ease_back_in(1 - x);

    // Inlined/simplified:
    var xr = 1 - x;
    return 1 - (xr * xr * xr - xr * Math.sin(xr * Math.PI));
};

dan.movement.ease_back_inOut_inHalf = function (x)
{
    // Functional:
    // return ease_back_in(2 * x) / 2;

    // Inlined/simplified:
    var xd = 2 * x;
    return 0.5 * (xd * xd * xd - xd * Math.sin(xd * Math.PI));
};

dan.movement.ease_back_inOut_outHalf = function (x)
{
    // Functional:
    // return 1 - ease_back_inOut_inHalf(1 - x);

    // Inlined/simplified:
    var xrd = 2 * (1 - x);
    return 1 - 0.5 * (xrd * xrd * xrd - xrd * Math.sin(xrd * Math.PI));
};

dan.movement.ease_back_inOut = function (x)
{
    // Functional:
    // if (x < 0.5)
    //     return ease_back_inOut_inHalf(x);
    // else
    //     return ease_back_inOut_outHalf(x);

    if (x < 0.5)
    {
        var xd = 2 * x;
        return 0.5 * (xd * xd * xd - xd * Math.sin(xd * Math.PI));
    }
    else
    {
        var xrd = 2 * (1 - x);
        return 1 - 0.5 * (xrd * xrd * xrd - xrd * Math.sin(xrd * Math.PI));
    }
};

// + + }}}

// + + Bounce {{{

dan.movement.ease_bounce_in = function (x)
{
    return 1 - dan.movement.ease_bounce_out(1 - x);
};

dan.movement.ease_bounce_out = function (x)
{
    if (x < 4.0/11.0)
    {
        return (121.0 * x * x)/16.0;
    }
    else if (x < 8.0/11.0)
    {
        return (363.0/40.0 * x * x) - (99.0/10.0 * x) + 17.0/5.0;
    }
    else if (x < 9.0/10.0)
    {
        return (4356.0/361.0 * x * x) - (35442.0/1805.0 * x) + 16061.0/1805.0;
    }
    else
    {
        return (54.0/5.0 * x * x) - (513.0/25.0 * x) + 268.0/25.0;
    }
};

dan.movement.ease_bounce_inOut_inHalf = function (x)
{
    return dan.movement.ease_bounce_in(2.0 * x) * 0.5;
};

dan.movement.ease_bounce_inOut_outHalf = function (x)
{
    // Functional:
    // return 1 - ease_bounce_inOut_inHalf(1 - x);

    // Inlined/simplified:
    return 1.0 - dan.movement.ease_bounce_in(2.0 * (1 - x)) * 0.5;
};

dan.movement.ease_bounce_inOut = function (x)
{
    if (x < 0.5)
    {
        return dan.movement.ease_bounce_in(2.0 * x) * 0.5;
    }
    else
    {
        return 1.0 - dan.movement.ease_bounce_in(2.0 * (1 - x)) * 0.5;
    }
};

// + + }}}

// + + Elastic {{{

dan.movement.ease_elastic_in = function (x)
// Modelled after the damped sine wave y = sin(13 * pi/2 * x) * 2^(10(x - 1))
{
    return Math.sin(13 * Math.PI/2 * x) * Math.pow(2, 10 * (x - 1));
};

dan.movement.ease_elastic_out = function (x)
// [AHEasing: "Modelled after the damped sine wave y = sin(-13pi/2*(x + 1))*pow(2, -10x) + 1"]
{
    // Functional:
    // return 1 - ease_elastic_in(1 - x);

    // Inlined/simplified:
    // [this is copied from AHEasing but the sign of the sin part looks wrong to me...]
    return Math.sin(-13 * Math.PI/2 * (x + 1)) * Math.pow(2, -10 * x) + 1;
};

dan.movement.ease_elastic_inOut = function (x)
// [AHEasing: 
//  Modelled after the piecewise exponentially-damped sine wave:
//  y = (1/2)*sin(13pi/2*(2*x))*pow(2, 10 * ((2*x) - 1))      ; [0,0.5)
//  y = (1/2)*(sin(-13pi/2*((2x-1)+1))*pow(2,-10(2*x-1)) + 2) ; [0.5, 1]]
{
    if (x < 0.5)
    {
        return 0.5 * Math.sin(13 * Math.PI/2 * (2 * x)) * Math.pow(2, 10 * ((2 * x) - 1));
    }
    else
    {
        return 0.5 * (Math.sin(-13 * Math.PI/2 * ((2 * x - 1) + 1)) * Math.pow(2, -10 * (2 * x - 1)) + 2);
    }
};

// + + }}}

// + }}}
