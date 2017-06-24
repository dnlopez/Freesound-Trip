
// This namespace
// #require "dan.js"


dan.setParameterInQueryString = function (i_paramName, i_paramValue, i_queryString)
// Add/change the value of a parameter in a query string.
//
// Args:
//  i_paramName:
//   (string)
//   The name of the parameter to add/change.
//   removeParameterFromQueryString() is called to remove any existing occurrences of this
//   parameter from the query string.
//   Then, the parameter is added at the end of the query string with its new value.
//   The name should already be URL encoded.
//  i_paramValue:
//   (string)
//   The value to set for the parameter.
//   The value should already be URL encoded.
//  i_queryString:
//   Either (string)
//    The query string to modify.
//    The string may or may not include the '?' character at the beginning.
//   or (null or undefined)
//    Default to window.location.search.
//
// Returns:
//  (string)
//  The query string with the specified parameter added or changed.
//  This result always begins with a '?' - if not originally present, it will be now.
{
    // Apply default arguments
    if (!i_queryString)
        i_queryString = window.location.search;

    // Remove the parameter's existing name and value, if present
    i_queryString = dan.removeParameterFromQueryString(i_paramName, i_queryString);

    // Append the parameter with its new value
    if (i_queryString != '?')
        i_queryString += '&';
    i_queryString += i_paramName;
    i_queryString += '=';
    i_queryString += i_paramValue;

    return i_queryString;
};


dan.removeParameterFromQueryString = function (i_paramName, i_queryString)
// Remove a named parameter from a query string.
//
// Args:
//  i_paramName:
//   (string)
//   The name of the parameter to remove.
//   The name should already be URL encoded.
//  i_queryString:
//   Either (string)
//    The query string to remove a parameter from.
//    The string may or may not include the '?' character at the beginning.
//   or (null or undefined)
//    Default to window.location.search.
//
// Returns:
//  (string)
//  The query string with all occurrences of the specified parameter removed.
//  This result always begins with a '?' - if not originally present, it will be now.
{
    // Apply default arguments
    if (!i_queryString)
        i_queryString = window.location.search;

    // If the first character is a '?' then remove it
    if (i_queryString.length > 0 && i_queryString[0] == "?")
        i_queryString = i_queryString.substring(1);

    // Split the string at the '&' character, to seperate the parameters into an array
    var paramArray = i_queryString.split('&');

    // The return query string will be built up here
    var returnQueryString = '?';

    // For each parameter
    var paramNo;
    for (paramNo = 0; paramNo < paramArray.length; ++paramNo)
    {
        // If found the target parameter
        if (paramArray[paramNo].substring(0, i_paramName.length) == i_paramName)
        {
            // Do nothing - don't add it to the return query string
        }
        else
        {
            // Otherwise

            // Copy parameter across unchanged
            if (returnQueryString != '?')
                returnQueryString += '&';
            returnQueryString += paramArray[paramNo];
        }
    }

    return returnQueryString;
};


dan.getParameterValueFromQueryString = function (i_paramName, i_queryString)
// Get the value of a named parameter from a query string.
//
// Args:
//  i_paramName:
//   (string)
//   The name of the parameter to get the value of.
//   The name should already be URL encoded.
//  i_queryString:
//   Either (string)
//    The query string to get the parameter value from.
//    The string should include the '?' character at the beginning.
//   or (null or undefined)
//    Default to window.location.search.
//
// Returns:
//  (string)
//  The value of the first occurrence of the specified parameter.
//  If the named parameter was not found in the query string, '' is returned.
{
    // Apply default arguments
    if (!i_queryString)
        i_queryString = window.location.search;
    // If the first character is a '?' then remove it
    if (i_queryString.length > 0 && i_queryString[0] == "?")
        i_queryString = i_queryString.substring(1);

    // Split the string at the '&' character, to seperate the parameters into an array
    var paramArray = i_queryString.split('&');

    // For each parameter
    var paramNo;
    for (paramNo = 0; paramNo < paramArray.length; ++paramNo)
    {
        var equalsSignPos = paramArray[paramNo].indexOf('=');
        var paramName, paramValue;
        if (equalsSignPos == -1)
        {
            paramName = paramArray[paramNo];
            paramValue = '';
        }
        else
        {
            paramName = paramArray[paramNo].substring(0, equalsSignPos);
            paramValue = paramArray[paramNo].substring(equalsSignPos + 1);
        }

        if (paramName == i_paramName)
        {
            return paramValue;
        }
    }

    return '';
};
