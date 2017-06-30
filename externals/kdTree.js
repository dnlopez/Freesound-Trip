/**
 * k-d Tree JavaScript - V 1.01
 *
 * https://github.com/ubilabs/kd-tree-javascript
 *
 * @author Mircea Pricop <pricop@ubilabs.net>, 2012
 * @author Martin Kleppe <kleppe@ubilabs.net>, 2012
 * @author Ubilabs http://ubilabs.net, 2012
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports === 'object') {
        factory(exports);
    } else {
        factory((root.commonJsStrict = {}));
    }
}(this, function (exports) {

    // type: Point
    //  (object)
    //  Has properties with the position of the point in each dimension
    //  The dimension count and name of the properties is customizable (see i_dimensionPropertyNames parameter to kdTree),
    //  but a typical set is: "x", "y", "z"

    function Node(i_obj, i_pivotDimensionNo, i_parent)
    {
        this.obj = i_obj;
        this.left = null;
        this.right = null;
        this.parent = i_parent;
        this.pivotDimensionNo = i_pivotDimensionNo;
    }

    // + kdTree {{{

    function kdTree(i_points, i_metric, i_dimensionPropertyNames)
    // Params:
    //  i_points:
    //   Either (array of Point)
    //    Points to add to the new tree
    //   or (kdTree)
    //    Existing (probably recently unserialized) tree to take on.
    //    Child-to-parent links will be fixed up in it.
    //  i_metric:
    //   (function)
    //   Function to calculate distance between two points
    //   Function has:
    //    Params:
    //     i_point1, i_point2:
    //      (Point)
    //    Returns:
    //     (float number)
    //  i_dimensionPropertyNames:
    //   (array of string)
    //   Names of properties present in each Point that hold the position in each dimension
    //   eg. ["x", "y", "z"]
    {
        // + Construction {{{

        function buildTree(i_points, i_depth, i_parent)
        // Params:
        //  i_points:
        //   (array of Point)
        //   Points to add to the new tree
        //  i_depth:
        //   (integer number)
        //   Current depth in tree.
        //   For the root this should be 0, then be incremented for subsequent levels.
        //   Determines which dimension to sort and partition the points by
        //  i_parent:
        //   Either (Node)
        //   or (null)
        //    No parent.
        //
        // Returns:
        //  Either (null)
        //  or (Node)
        {
            // If no points to put in a tree, return null
            if (i_points.length === 0)
                return null;

            // Choose pivotal dimension for any node we create
            // ie. all points in left subtree will have lower values in this dimension, and all points in right subtree will have higher values in this dimension,
            // than the focal point of this node has in this dimension
            // Make it basically follow the current tree depth, wrapping around if we're deeper than the total number of dimensions in a point [does this ever happen?]
            var pivotDimensionNo = i_depth % i_dimensionPropertyNames.length;

            // If only one point, return a new node with it as the object, assigning current depth and parent,
            // but no need to make subtrees for other points
            if (i_points.length === 1)
                return new Node(i_points[0], pivotDimensionNo, i_parent);

            // Sort points by the pivot dimension
            i_points.sort(function (a, b) {
                return a[i_dimensionPropertyNames[pivotDimensionNo]] - b[i_dimensionPropertyNames[pivotDimensionNo]];
            });

            // Create a new node with the median point as the object, assigning current depth and parent,
            // then recursively run buildTree to make left and right subtrees at incremented depth and with the new node parent 
            var medianPointNo = Math.floor(i_points.length / 2);
            var node = new Node(i_points[medianPointNo], pivotDimensionNo, i_parent);
            node.left = buildTree(i_points.slice(0, medianPointNo), i_depth + 1, node);
            node.right = buildTree(i_points.slice(medianPointNo + 1), i_depth + 1, node);

            // Return the root of the tree we created
            return node;
        }

        // If points is an array, build a new tree from them
        if (Array.isArray(i_points))
        {
            this.root = buildTree(i_points, 0, null);
        }
        // Else if points is not an array, assume it's a pre-built tree
        else
        {
            this.root = i_points;

            // Restore all child-to-parent links ('i_parent')
            function fixParentLinksOfChildren(i_root)
            {
                if (i_root.left)
                {
                    i_root.left.parent = i_root;
                    fixParentLinksOfChildren(i_root.left);
                }

                if (i_root.right)
                {
                    i_root.right.parent = i_root;
                    fixParentLinksOfChildren(i_root.right);
                }
            }

            fixParentLinksOfChildren(this.root);
        }

        // + }}}

        // + Serialization {{{

        this.toJSON = function (i_src)
        // Convert to a JSON serializable structure
        // Recreate tree of nodes with empty 'parent' properties
        //
        // Params:
        //  i_src:
        //   Either (Node)
        //    Root of tree to recreate with empty 'parent' properties
        //   or (null or undefined)
        //    Use default of this.root
        //
        // Returns:
        //  (Node)
        //  Root of similarly-structured tree
        {
            // Apply default arguments
            if (!i_src)
                i_src = this.root;

            //
            var dest = new Node(i_src.obj, i_src.pivotDimensionNo, null);
            if (i_src.left)
                dest.left = this.toJSON(i_src.left);
            if (i_src.right)
                dest.right = this.toJSON(i_src.right);
            return dest;
        };

        // + }}}

        this.insert = function (i_point)
        // Params:
        //  i_point:
        //   (Point)
        {
            /*
            function innerSearch(i_searchIn, i_parent)
            // Search for i_point
            //
            // Params:
            //  i_searchIn:
            //   Either (Node)
            //   or (null)
            {
                if (i_searchIn === null)
                    return i_parent;

                var dimensionName = i_dimensionPropertyNames[i_searchIn.pivotDimensionNo];
                if (i_point[dimensionName] < i_searchIn.obj[dimensionName])
                    return innerSearch(i_searchIn.left, i_searchIn);
                else
                    return innerSearch(i_searchIn.right, i_searchIn);
            }

            var insertPosition = innerSearch(this.root, null);
            if (insertPosition === null)
            {
                this.root = new Node(i_point, 0, null);
                return;
            }
            */

            if (this.root === null)
            {
                this.root = new Node(i_point, 0, null);
                return;
            }

            //
            function innerSearch(i_searchIn)
            // Search for place to put i_point
            //
            // Params:
            //  i_searchIn:
            //   Either (Node)
            //   or (null)
            {
                var dimensionName = i_dimensionPropertyNames[i_searchIn.pivotDimensionNo];
                if (i_point[dimensionName] < i_searchIn.obj[dimensionName])
                {
                    if (i_searchIn.left === null)
                        return i_searchIn;
                    else
                        return innerSearch(i_searchIn.left);
                }
                else
                {
                    if (i_searchIn.right === null)
                        return i_searchIn;
                    else
                        return innerSearch(i_searchIn.right);
                }
            }

            var insertPosition = innerSearch(this.root);

            var newNode = new Node(i_point, (insertPosition.pivotDimensionNo + 1) % i_dimensionPropertyNames.length, insertPosition);
            var dimensionName = i_dimensionPropertyNames[insertPosition.pivotDimensionNo];

            if (i_point[dimensionName] < insertPosition.obj[dimensionName])
                insertPosition.left = newNode;
            else
                insertPosition.right = newNode;
        };

        var self = this;

        this.remove = function (i_point)
        // Params:
        //  i_point:
        //   (Point)
        {
            function nodeSearch(i_searchIn)
            // Search for node with same object as i_point
            //
            // Params:
            //  i_searchIn:
            //   Either (Node)
            //   or (null)
            {
                if (i_searchIn === null)
                    return null;

                if (i_searchIn.obj === i_point)
                    return i_searchIn;

                var dimensionName = i_dimensionPropertyNames[i_searchIn.pivotDimensionNo];
                if (i_point[dimensionName] < i_searchIn.obj[dimensionName])
                    return nodeSearch(i_searchIn.left);
                else
                    return nodeSearch(i_searchIn.right);
            }

            // Find the node with the same object as i_point
            // and if not found then return doing nothing
            var node = nodeSearch(self.root);
            if (node === null)
                return;

            //
            function removeNode(i_node)
            {
                function findMin(i_node, i_dimensionNo)
                {
                    if (i_node === null)
                        return null;

                    var dimensionName = i_dimensionPropertyNames[i_dimensionNo];

                    if (i_node.pivotDimensionNo === i_dimensionNo)
                    {
                        if (i_node.left !== null)
                            return findMin(i_node.left, i_dimensionNo);

                        return i_node;
                    }

                    var own = i_node.obj[dimensionName];
                    var left = findMin(i_node.left, i_dimensionNo);
                    var right = findMin(i_node.right, i_dimensionNo);
                    var min = i_node;

                    if (left !== null && left.obj[dimensionName] < own)
                        min = left;
                    if (right !== null && right.obj[dimensionName] < min.obj[dimensionName])
                        min = right;
                    return min;
                }

                // If both subtrees of the node to be removed are empty
                if (i_node.left === null && i_node.right === null)
                {
                    // Don't need to deal with children, just the parent

                    // If this node doesn't have a parent, ie. it's the root, then clear the tree 'root' property itself
                    if (i_node.parent === null)
                    {
                        self.root = null;
                        return;
                    }

                    // Else find whether this is the left or right child of the parent, and clear that property in the parent
                    var dimensionName = i_dimensionPropertyNames[i_node.parent.pivotDimensionNo];
                    if (i_node.obj[dimensionName] < i_node.parent.obj[dimensionName])
                        i_node.parent.left = null;
                    else
                        i_node.parent.right = null;
                    return;
                }

                // Else if left subtree is empty and right is not
                // If the right subtree is not empty, swap with the minimum element on the
                // node's dimension. If it is empty, we swap the left and right subtrees and
                // do the same.
                if (i_node.right !== null)
                {
                    var nextNode = findMin(i_node.right, i_node.pivotDimensionNo);
                    var nextObj = nextNode.obj;
                    removeNode(nextNode);
                    i_node.obj = nextObj;
                }
                // Else if right subtree is empty and left is not
                else
                {
                    var nextNode = findMin(i_node.left, i_node.pivotDimensionNo);
                    var nextObj = nextNode.obj;
                    removeNode(nextNode);
                    i_node.right = i_node.left;
                    i_node.left = null;
                    i_node.obj = nextObj;
                }
            }

            removeNode(node);
        };

        this.nearest = function (i_point, i_maxNodes, i_maxDistance)
        // Params:
        //  i_point:
        //   (Point)
        //  i_maxNodes:
        //   ...
        //  i_maxDistance:
        //   ...
        {
            var bestNodes = new BinaryMinHeap(
                function (e) {
                    return -e[1];
                }
            );

            function nearestSearch(i_node)
            {
                // Get the 'linear distance' between the target point (i_point) and the node's point along the node's pivot dimension,
                // by copying the node's point (position properties only) except in the pivot dimension copy the value from the target point,
                // (ie. projecting the target point into the plane perpendicular to the pivot dimension)
                // then calculate the distance between the node's point and this newly projected point
                var linearPoint = {};  // (Point)
                for (var dimensionNo = 0; dimensionNo < i_dimensionPropertyNames.length; ++dimensionNo)
                {
                    if (dimensionNo === i_node.pivotDimensionNo)
                        linearPoint[i_dimensionPropertyNames[dimensionNo]] = i_point[i_dimensionPropertyNames[dimensionNo]];
                    else
                        linearPoint[i_dimensionPropertyNames[dimensionNo]] = i_node.obj[i_dimensionPropertyNames[dimensionNo]];
                }
                var linearDistance = i_metric(linearPoint, i_node.obj);

                // Get the direct distance between the unprojected target point (i_point) and the current node's point
                var ownDistance = i_metric(i_point, i_node.obj);

                function saveNode(i_node, distance)
                {
                    bestNodes.push([i_node, distance]);
                    if (bestNodes.size() > i_maxNodes)
                        bestNodes.pop();
                }

                // If no children
                if (i_node.right === null && i_node.left === null)
                {
                    if (bestNodes.size() < i_maxNodes || ownDistance < bestNodes.peek()[1])
                        saveNode(i_node, ownDistance);
                    return;
                }

                // Choose which child to recurse into
                // depending on which side target point (i_point) is of the pivot,
                // or simply by which single child exists,
                // then recurse
                var dimensionName = i_dimensionPropertyNames[i_node.pivotDimensionNo];
                var bestChild;
                if (i_node.right === null)
                {
                    bestChild = i_node.left;
                }
                else if (i_node.left === null)
                {
                    bestChild = i_node.right;
                }
                else
                {
                    if (i_point[dimensionName] < i_node.obj[dimensionName])
                        bestChild = i_node.left;
                    else
                        bestChild = i_node.right;
                }
                nearestSearch(bestChild);

                // If there's still room in the bestNodes heap relative to i_maxNodes
                // or if the distance of this node is less than the tree minimum,
                // push it on
                if (bestNodes.size() < i_maxNodes || ownDistance < bestNodes.peek()[1]) {
                    saveNode(i_node, ownDistance);
                }

                var otherChild;
                if (bestNodes.size() < i_maxNodes || Math.abs(linearDistance) < bestNodes.peek()[1])
                {
                    if (bestChild === i_node.left)
                        otherChild = i_node.right;
                    else
                        otherChild = i_node.left;

                    if (otherChild !== null)
                        nearestSearch(otherChild);
                }
            }

            //
            if (i_maxDistance)
            {
                for (var nodeNo = 0; nodeNo < i_maxNodes; ++nodeNo)
                {
                    bestNodes.push([null, i_maxDistance]);
                }
            }

            //
            if (self.root)
                nearestSearch(self.root);

            var result = [];
            for (var i = 0; i < Math.min(i_maxNodes, bestNodes.compactArray.length); i += 1)
            {
                if (bestNodes.compactArray[i][0])
                    result.push([bestNodes.compactArray[i][0].obj, bestNodes.compactArray[i][1]]);
            }
            return result;
        };

        this.balanceFactor = function ()
        {
            function height(i_node)
            {
                if (i_node === null)
                    return 0;

                return Math.max(height(i_node.left), height(i_node.right)) + 1;
            }

            function count(i_node)
            {
                if (i_node === null)
                    return 0;

                return count(i_node.left) + count(i_node.right) + 1;
            }

            return height(self.root) / (Math.log(count(self.root)) / Math.log(2));
        };
    }

    this.kdTree = kdTree;

    exports.kdTree = kdTree;

    // + }}}

    // + BinaryMinHeap {{{

    // Type: Element
    //  (any)

    function BinaryMinHeap(i_scoreFunction)
    // Min-heap
    //
    // Implementation from:
    //  http://eloquentjavascript.net/appendix2.html
    //
    // Params:
    //  i_scoreFunction:
    //   (function)
    //   Function has
    //    Params:
    //     i_element:
    //      (Element)
    //    Returns:
    //     (number)
    {
        this.compactArray = [];
        // (array of Element)
        // Complete binary tree in compact array form

        this.scoreFunction = i_scoreFunction;
    }

    BinaryMinHeap.prototype.push = function (i_element)
    // Params:
    //  i_element:
    //   (Element)
    {
        // Add the new element to the end of the compact array
        this.compactArray.push(i_element);
        // Bubble it up
        this.bubbleUp(this.compactArray.length - 1);
    };

    BinaryMinHeap.prototype.pop = function ()
    // Returns:
    //  (Element)
    {
        // Copy the root element to be popped from the heap, from the start of the compact array
        var rv = this.compactArray[0];

        // Pop the last element from the compact array,
        // and if it isn't the same one we're popping from the heap itself (the case where there was only one element left)
        // put it in the hole left by the heap pop and sink it down
        var lastElement = this.compactArray.pop();
        if (this.compactArray.length > 0)
        {
            this.compactArray[0] = lastElement;
            this.sinkDown(0);
        }

        //
        return rv;
    };

    BinaryMinHeap.prototype.peek = function ()
    // Returns:
    //  (Element)
    {
        return this.compactArray[0];
    };

    BinaryMinHeap.prototype.remove = function (i_element)
    // Params:
    //  i_element:
    //   (Element)
    //   Remove the first element that is equal to this.
    //
    // Returns:
    //  Either (undefined)
    //   Removed successfuly
    //  or (throw Error)
    //   No element was found equal to i_element
    {
        // Search compact array for the first element that is equal to i_element
        for (var elementCount = this.compactArray.length, elementNo = 0; elementNo < elementCount; ++elementNo)
        {
            if (this.compactArray[elementNo] == i_element)
            {
                // Pop the last element from the compact array,
                // and if it isn't the same one we're popping from the heap itself (just found in search)
                // put it in the hole left by the heap pop and bubble it up or sink it down
                var lastElement = this.compactArray.pop();
                if (elementNo != elementCount - 1)
                {
                    this.compactArray[elementNo] = lastElement;
                    if (this.scoreFunction(lastElement) < this.scoreFunction(i_element))
                        this.bubbleUp(elementNo);
                    else
                        this.sinkDown(elementNo);
                }
                return;
            }
        }

        //
        throw new Error("Element not found.");
    };

    BinaryMinHeap.prototype.size = function ()
    // Returns:
    //  (integer number)
    {
        return this.compactArray.length;
    };

    // + + Bubbling and sinking {{{

    BinaryMinHeap.prototype.bubbleUp = function (i_bubblingElementNo)
    // Params:
    //  i_bubblingElementNo:
    //   (integer number)
    {
        // Fetch the element that has to be moved.
        var bubblingElement = this.compactArray[i_bubblingElementNo];

        // Loop, but stop if get to element 0, from where it can't go up any further
        while (i_bubblingElementNo > 0)
        {
            // Compute index of and fetch the parent element
            var parentElementNo = Math.floor((i_bubblingElementNo + 1) / 2) - 1;
            var parentElement = this.compactArray[parentElementNo];

            // If the parent element already has a lower score than the bubbling one,
            // stop here
            if (this.scoreFunction(parentElement) <= this.scoreFunction(bubblingElement))
                break;

            // Else if the bubbling element has a lower score than the parent element,
            // swap the elements
            this.compactArray[parentElementNo] = bubblingElement;
            this.compactArray[i_bubblingElementNo] = parentElement;

            // Update 'i_bubblingElementNo' to continue at the new position
            i_bubblingElementNo = parentElementNo;
        }
    };

    BinaryMinHeap.prototype.sinkDown = function (i_sinkingElementNo)
    // Params:
    //  i_sinkingElementNo:
    //   (integer number)
    {
        // Look up the target element and its score.
        var elementCount = this.compactArray.length;
        var sinkingElement = this.compactArray[i_sinkingElementNo];
        var sinkingElementScore = this.scoreFunction(sinkingElement);

        while (true)
        {
            // Compute indices of the child elements
            var child2ElementNo = (i_sinkingElementNo + 1) * 2;
            var child1ElementNo = child2ElementNo - 1;

            // For subsequent comparisons to decide whether want to sink this element to the left or right,
            // track the score of the top element and the position we may sink it to
            var thisStep_scoreAtTop = sinkingElementScore;
            var thisStep_sinkToPosition = null;

            // If the first child exists (is inside the array),
            // fetch it and compute its score,
            // and if it's less than the top element, set variables to prepare a swap
            if (child1ElementNo < elementCount)
            {
                var child1Element = this.compactArray[child1ElementNo];
                var child1ElementScore = this.scoreFunction(child1Element);
                if (child1ElementScore < thisStep_scoreAtTop)
                {
                    thisStep_sinkToPosition = child1ElementNo;
                    thisStep_scoreAtTop = child1ElementScore;
                }

                // If the second child also exists,
                // do the same
                if (child2ElementNo < elementCount)
                {
                    var child2Element = this.compactArray[child2ElementNo];
                    var child2ElementScore = this.scoreFunction(child2Element);
                    if (child2ElementScore < thisStep_scoreAtTop)
                    {
                        thisStep_sinkToPosition = child2ElementNo;
                        thisStep_scoreAtTop = child2ElementScore;
                    }
                }
            }

            // If nowhere to sink to, break to finish
            if (thisStep_sinkToPosition == null)
                break;

            // Else swap the elements
            this.compactArray[i_sinkingElementNo] = this.compactArray[thisStep_sinkToPosition];
            this.compactArray[thisStep_sinkToPosition] = sinkingElement;

            // Update 'i_sinkingElementNo' to continue at the new position
            i_sinkingElementNo = thisStep_sinkToPosition;
        }
    };

    exports.BinaryMinHeap = BinaryMinHeap;

    // + + }}}

    // + }}}
}));
