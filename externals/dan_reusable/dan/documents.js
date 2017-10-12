// documents.js, was called dquery.js in various projects (art50, gamebase, warble) during development


// This namespace
// #require "dan.js"


// + htmlToDom {{{

// TODO
//  also see here also: https://davidwalsh.name/convert-html-stings-dom-nodes

dan.htmlToDom = function (i_html)
// From gamebase
//
// Params:
//  i_html:
//   (string)
//   This should have a single root element.
//
// Returns:
//  (Element)
//  The first element in the passed in HTML (with all its children) converted to a DOM node.
{
    // Find the first element of the HTML string,
    // and create an appropriate temporary element to be a parent to it
    var rootElementName = i_html.match(/<([^> ]+)/)[1];
    var temporaryParentElementName = "div";
    if (rootElementName == "tr")
        temporaryParentElementName = "table";
    var container = document.createElement(temporaryParentElementName);

    // Set the HTML string in there using the innerHTML property
    // then pull out and return the first DOM node that the browser created
    container.innerHTML = i_html;
    return container.firstElementChild;
}

/*
dan.htmlToDom = function (i_html)
// Old, more simple-minded implementation
// which doesn't determine the appropriateness of the type of the temporary parent element.
//
// Originally from:
//  art50
//  warble
{
    // Create a temporary local div to receive the HTML string,
    // set the HTML string in there using the innerHTML property,
    // then pull out and return the first DOM node that the browser created
    var container = document.createElement("div");
    container.innerHTML = i_html;
    return container.firstElementChild;
}
*/

/*
dan.htmlToDom = function (i_html)
// jQuery implementation.
//
// From art50
// From warble
{
    return $(i_html)[0];
}
*/

// + }}}

// + hereDoc {{{
// Same in both art50 and warble

dan.hereDoc = function (i_function)
// From:
//  http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript
//
// Params:
//  i_function:
//   (function)
//   A function expression with an embedded multiline comment.
//   A "!" may be added after the opening /* of the comment to make it less likely for code compressors
//   to strip the comment, and this function will not include it in the return value.
//   A "\" may be added after the above, which if followed immediately by a newline, the slash and the
//   newline will both not be included in the return value.
//
// Returns:
//  (string)
//  The content of the comment.
//
// Example:
//  Call:
//   hereDoc(function () {/*!
//   aa
//   bb
//   cc
//   */});
//  Returns:
//   "
//   aa
//   bb
//   cc
//   "
//
// Example:
//  Call:
//   hereDoc(function () {/*!\
//   aa
//   bb
//   cc*/});
//  Returns:
//   "aa
//   bb
//   cc"
{
    return i_function.toString().
        // Remove chars at start of function string up to and including
        //  opening multiline comment delimiter,
        //  optional exclamation mark,
        //  backslash and newline
        replace(/^[^\/]+\/\*!?(\\\n)?/, '').
        // Remove chars at end of function string including and subsequent to
        //  closing multiline comment delimiter
        replace(/\*\/[^\/]+$/, '');
}
/*
dan.hereDoc = function (i_function)
// Alternative implementation.
{
    return i_function.toString().slice(14, -3);
}
*/

// + }}}
