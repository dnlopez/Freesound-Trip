
// This namespace
// #require "mesh_namespace.js"


// [Could generalize and rename this to StructureOfArrays?]


// + Construction/clone {{{

dan.mesh.AttributeArrays = function ()
// Vertices in structure-of-arrays form.
{
};

Object.defineProperty(dan.mesh.AttributeArrays.prototype, "clone", { enumerable: false, value:
function clone()
// Returns:
//  (dan.mesh.AttributeArrays)
{
    var newAttributeArrays = new dan.mesh.AttributeArrays();

    for (var attributeName in this)
    {
        newAttributeArrays[attributeName] = [];

        for (var itemNo = 0; itemNo < this[attributeName].length; ++itemNo)
        {
            if ("clone" in this[attributeName][itemNo])
                newAttributeArrays[attributeName].push(this[attributeName][itemNo].clone());
            else
                newAttributeArrays[attributeName].push(this[attributeName][itemNo]);
        }
    }

    return newAttributeArrays;
}});

// + }}}

Object.defineProperty(dan.mesh.AttributeArrays.prototype, "recreateAttributes", { enumerable: false, value:
function recreateAttributes(i_names)
// Params:
//  i_names:
//   (array of string)
{
    for (var nameNo in i_names)
    {
        this[i_names[nameNo]] = [];
    }
}});

Object.defineProperty(dan.mesh.AttributeArrays.prototype, "appendAttributes", { enumerable: false, value:
function appendAttributes(i_toAppend)
// Params:
//  i_toAppend:
//   (dan.mesh.Attributes)
//   Values which will be appended
//   to the correspondingly named arrays in 'this' (you must ensure that these target arrays
//   already exist in 'this' before calling this function.)
//   Values are cloned.
{
    // Append each single value in the i_toAppend Attributes
    // to the arrays held in this AttributeArrays
    for (var attributeName in i_toAppend)
    {
        var value = i_toAppend[attributeName];

        if ("clone" in value)
            this[attributeName].push(value.clone());
        else
            this[attributeName].push(value);
    }
}});

Object.defineProperty(dan.mesh.AttributeArrays.prototype, "appendAttributeArrays", { enumerable: false, value:
function appendAttributeArrays(i_toAppend)
// Params:
//  i_toAppend:
//   (dan.mesh.AttributeArrays)
//   Arrays from which all values will be appended
//   to the correspondingly named arrays in 'this' (you must ensure that these target arrays
//   already exist in 'this' before calling this function.)
{
    // Append each value of each array in the i_toAppend AttributeArrays
    // to the arrays held in this AttributeArrays
    for (var attributeName in i_toAppend)
    {
        var values = i_toAppend[attributeName];

        for (var valueNo = 0; valueNo < values.length; ++valueNo)
        {
            var value = values[valueNo];

            if ("clone" in value)
                this[attributeName].push(value.clone());
            else
                this[attributeName].push(value);
        }
    }
}});

Object.defineProperty(dan.mesh.AttributeArrays.prototype, "appendAttributeArraysInIndexedOrder", { enumerable: false, value:
function appendAttributeArraysInIndexedOrder(i_indices, i_arrays)
// Params:
//  i_indices:
//   (array of integer number)
//  i_arrays:
//   (dan.mesh.AttributeArrays)
//   Arrays from which selected values will be extracted and appended
//   to the correspondingly named arrays in 'this' (you must ensure that these target arrays
//   already exist in 'this' before calling this function.)
{
    // For each index
    for (var indexNo = 0; indexNo < i_indices.length; ++indexNo)
    {
        var index = i_indices[indexNo];

        // Append the indexed value of each array in the i_arrays AttributeArrays
        // to the arrays held in this AttributeArrays
        for (var attributeName in i_arrays)
        {
            var value = i_arrays[attributeName][index];

            if ("clone" in value)
                this[attributeName].push(value.clone());
            else
                this[attributeName].push(value);
        }
    }
}});

Object.defineProperty(dan.mesh.AttributeArrays.prototype, "setAttributesAt", { enumerable: false, value:
function setAttributesAt(i_index, i_value)
// Params:
//  i_index:
//   (integer number)
//  i_value:
//   (dan.mesh.Attributes)
//   Values are assigned by value.
{
    for (var attributeName in i_value)
    {
        var value = i_value[attributeName][i_index];

        this[attributeName] = value;
        //if ("clone" in value)
        //    this[attributeName] = value.clone();
        //else
        //    this[attributeName] = value;
    }
}});

Object.defineProperty(dan.mesh.AttributeArrays.prototype, "getAttributesAt", { enumerable: false, value:
function getAttributesAt(i_index)
// Params:
//  i_index:
//   (integer number)
//
// Returns:
//  (dan.mesh.Attributes)
//  Values are cloned.
{
    var rv = new dan.mesh.Attributes();

    for (var attributeName in this)
    {
        var value = this[attributeName][i_index];

        if ("clone" in value)
            rv[attributeName] = value.clone();
        else
            rv[attributeName] = value;
    }

    return rv;
}});

/*
Object.defineProperty(dan.mesh.AttributeArrays.prototype, "mix", { enumerable: false, value:
function mix(i_index1, i_index2, i_f, o_pushOutTo)
// Aka 'lerp'
//
// Params:
//  i_attributes1:
//   (integer number)
//  i_attributes2:
//   (integer number)
//  i_f:
//   (float)
//  o_pushOutTo:
//   (dan.mesh.AttributeArrays)
{
    var newAttributes = new dan.mesh.Attributes();

    var 
    for (var attributeName in i_attributes1)
    {
        var value1 = i_attributes1[attributeName];
        var value2 = i_attributes2[attributeName];

        if ("mix" in value1.constructor)
            newAttributes[attributeName] = value1.constructor.mix(value1, value2, i_f);
        else
            newAttributes[attributeName] = value1 + (value2 - value1) * i_f;
    }
}});
*/

Object.defineProperty(dan.mesh.AttributeArrays.prototype, "reverse", { enumerable: false, value:
function reverse()
// Reverse order of each array
{
    for (var attributeName in this)
    {
        this[attributeName].reverse();
    }
}});
