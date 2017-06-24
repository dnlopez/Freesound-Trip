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
    //  (array of number)
    //  One element for each dimension

    function Node(i_obj, i_dimension, i_parent)
    {
        this.obj = i_obj;
        this.left = null;
        this.right = null;
        this.parent = i_parent;
        this.dimension = i_dimension;
    }

    // + kdTree {{{

    function kdTree(i_points, i_metric, i_dimensions)
    {
        var self = this;

        function buildTree(i_points, i_depth, i_parent)
        // Params:
        //  i_points:
        //   (array of Point)
        //
        // Returns:
        //  Either (null)
        //  or (Node)
        {
            // If no points to put in a tree, return null
            if (i_points.length === 0)
                return null;

            // If only one point, return a new node with it as the object, assigning current depth and parent,
            // but no need to make subtrees for other points
            if (i_points.length === 1)
                return new Node(i_points[0], dim, i_parent);

            // Sort points by their i_depth'th dimension
            var dim = i_depth % i_dimensions.length;
            i_points.sort(function (a, b) {
                return a[i_dimensions[dim]] - b[i_dimensions[dim]];
            });

            // Create a new node with the median point as the object, assigning current depth and parent,
            // then recursively run buildTree to make left and right subtrees at incremented depth and with the new node parent 
            var medianPointNo = Math.floor(i_points.length / 2);
            var node = new Node(i_points[medianPointNo], dim, i_parent);
            node.left = buildTree(i_points.slice(0, medianPointNo), i_depth + 1, node);
            node.right = buildTree(i_points.slice(medianPointNo + 1), i_depth + 1, node);

            // Return the root of the tree we created
            return node;
        }

        function loadTree (i_data)
        // Reload a serialied tree
        {
            // Just need to restore the `i_parent` parameter
            self.root = i_data;

            function restoreParent (root) {
                if (root.left) {
                    root.left.parent = root;
                    restoreParent(root.left);
                }

                if (root.right) {
                    root.right.parent = root;
                    restoreParent(root.right);
                }
            }

            restoreParent(self.root);
        }

        // If points is not an array, assume we're loading a pre-built tree
        if (!Array.isArray(i_points))
            loadTree(i_points, i_metric, i_dimensions);
        else
            this.root = buildTree(i_points, 0, null);

        // Convert to a JSON serializable structure; this just requires removing
        // the `parent` property
        this.toJSON = function (i_src)
        {
            if (!i_src)
                i_src = this.root;
            var dest = new Node(i_src.obj, i_src.dimension, null);
            if (i_src.left)
                dest.left = self.toJSON(i_src.left);
            if (i_src.right)
                dest.right = self.toJSON(i_src.right);
            return dest;
        };

        this.insert = function (point)
        {
            function innerSearch(node, i_parent) {

                if (node === null) {
                    return i_parent;
                }

                var dimension = i_dimensions[node.dimension];
                if (point[dimension] < node.obj[dimension]) {
                    return innerSearch(node.left, node);
                } else {
                    return innerSearch(node.right, node);
                }
            }

            var insertPosition = innerSearch(this.root, null);
            if (insertPosition === null)
            {
                this.root = new Node(point, 0, null);
                return;
            }

            var newNode = new Node(point, (insertPosition.dimension + 1) % i_dimensions.length, insertPosition);
            var dimension = i_dimensions[insertPosition.dimension];

            if (point[dimension] < insertPosition.obj[dimension])
                insertPosition.left = newNode;
            else
                insertPosition.right = newNode;
        };

        this.remove = function (point)
        {
            var node;

            function nodeSearch(node) {
                if (node === null) {
                    return null;
                }

                if (node.obj === point) {
                    return node;
                }

                var dimension = i_dimensions[node.dimension];

                if (point[dimension] < node.obj[dimension]) {
                    return nodeSearch(node.left, node);
                } else {
                    return nodeSearch(node.right, node);
                }
            }

            function removeNode(node) {
                var nextNode;
                var nextObj;
                var pDimension;

                function findMin(node, dim) {
                    var dimension,
                        own,
                        left,
                        right,
                        min;

                    if (node === null) {
                        return null;
                    }

                    dimension = i_dimensions[dim];

                    if (node.dimension === dim) {
                        if (node.left !== null) {
                            return findMin(node.left, dim);
                        }
                        return node;
                    }

                    own = node.obj[dimension];
                    left = findMin(node.left, dim);
                    right = findMin(node.right, dim);
                    min = node;

                    if (left !== null && left.obj[dimension] < own) {
                        min = left;
                    }
                    if (right !== null && right.obj[dimension] < min.obj[dimension]) {
                        min = right;
                    }
                    return min;
                }

                if (node.left === null && node.right === null) {
                    if (node.parent === null) {
                        self.root = null;
                        return;
                    }

                    pDimension = i_dimensions[node.parent.dimension];

                    if (node.obj[pDimension] < node.parent.obj[pDimension]) {
                        node.parent.left = null;
                    } else {
                        node.parent.right = null;
                    }
                    return;
                }

                // If the right subtree is not empty, swap with the minimum element on the
                // node's dimension. If it is empty, we swap the left and right subtrees and
                // do the same.
                if (node.right !== null) {
                    nextNode = findMin(node.right, node.dimension);
                    nextObj = nextNode.obj;
                    removeNode(nextNode);
                    node.obj = nextObj;
                } else {
                    nextNode = findMin(node.left, node.dimension);
                    nextObj = nextNode.obj;
                    removeNode(nextNode);
                    node.right = node.left;
                    node.left = null;
                    node.obj = nextObj;
                }

            }

            node = nodeSearch(self.root);

            if (node === null) { return; }

            removeNode(node);
        };

        this.nearest = function (point, maxNodes, maxDistance) {
            var result;

            var bestNodes = new BinaryHeap(
                function (e) { return -e[1]; }
            );

            function nearestSearch(node)
            {
                var bestChild;
                var dimension = i_dimensions[node.dimension];
                var ownDistance = i_metric(point, node.obj);
                var linearPoint = {};
                var i;

                function saveNode(node, distance)
                {
                    bestNodes.push([node, distance]);
                    if (bestNodes.size() > maxNodes)
                        bestNodes.pop();
                }

                for (i = 0; i < i_dimensions.length; i += 1)
                {
                    if (i === node.dimension)
                        linearPoint[i_dimensions[i]] = point[i_dimensions[i]];
                    else
                        linearPoint[i_dimensions[i]] = node.obj[i_dimensions[i]];
                }

                var linearDistance = i_metric(linearPoint, node.obj);

                if (node.right === null && node.left === null)
                {
                    if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1])
                        saveNode(node, ownDistance);
                    return;
                }

                if (node.right === null)
                {
                    bestChild = node.left;
                }
                else if (node.left === null)
                {
                    bestChild = node.right;
                }
                else
                {
                    if (point[dimension] < node.obj[dimension])
                        bestChild = node.left;
                    else
                        bestChild = node.right;
                }

                nearestSearch(bestChild);

                if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()[1]) {
                    saveNode(node, ownDistance);
                }

                var otherChild;
                if (bestNodes.size() < maxNodes || Math.abs(linearDistance) < bestNodes.peek()[1])
                {
                    if (bestChild === node.left)
                        otherChild = node.right;
                    else
                        otherChild = node.left;

                    if (otherChild !== null)
                        nearestSearch(otherChild);
                }
            }

            if (maxDistance)
            {
                for (var nodeNo = 0; nodeNo < maxNodes; nodeNo += 1)
                {
                    bestNodes.push([null, maxDistance]);
                }
            }

            if (self.root)
                nearestSearch(self.root);

            result = [];
            for (var i = 0; i < Math.min(maxNodes, bestNodes.content.length); i += 1)
            {
                if (bestNodes.content[i][0])
                    result.push([bestNodes.content[i][0].obj, bestNodes.content[i][1]]);
            }
            return result;
        };

        this.balanceFactor = function () {
            function height(node) {
                if (node === null) {
                    return 0;
                }
                return Math.max(height(node.left), height(node.right)) + 1;
            }

            function count(node) {
                if (node === null) {
                    return 0;
                }
                return count(node.left) + count(node.right) + 1;
            }

            return height(self.root) / (Math.log(count(self.root)) / Math.log(2));
        };
    }

    this.kdTree = kdTree;

    exports.kdTree = kdTree;

    // + }}}

    // + BinaryHeap {{{

    // Binary heap implementation from:
    // http://eloquentjavascript.net/appendix2.html

    function BinaryHeap(i_scoreFunction)
    {
        this.content = [];
        this.scoreFunction = i_scoreFunction;
    }

    BinaryHeap.prototype.push = function (i_element)
    {
        // Add the new element to the end of the content array
        this.content.push(i_element);
        // Allow it to bubble up
        this.bubbleUp(this.content.length - 1);
    };

    BinaryHeap.prototype.pop = function ()
    {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it sink down.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.sinkDown(0);
        }
        return result;
    };

    BinaryHeap.prototype.peek = function ()
    {
        return this.content[0];
    };

    BinaryHeap.prototype.remove = function (node)
    {
        var len = this.content.length;
        // To remove a value, we must search through the array to find
        // it.
        for (var i = 0; i < len; i++) {
            if (this.content[i] == node) {
                // When it is found, the process seen in 'pop' is repeated
                // to fill up the hole.
                var end = this.content.pop();
                if (i != len - 1) {
                    this.content[i] = end;
                    if (this.scoreFunction(end) < this.scoreFunction(node))
                        this.bubbleUp(i);
                    else
                        this.sinkDown(i);
                }
                return;
            }
        }
        throw new Error("Node not found.");
    };

    BinaryHeap.prototype.size = function ()
    {
        return this.content.length;
    };

    BinaryHeap.prototype.bubbleUp = function (i_elementNo)
    {
        // Fetch the element that has to be moved.
        var element = this.content[i_elementNo];
        // When at 0, an element can not go up any further.
        while (i_elementNo > 0)
        {
            // Compute the parent element's index, and fetch it.
            var parentElementNo = Math.floor((i_elementNo + 1) / 2) - 1;
            var parentElement = this.content[parentElementNo];
            // If the bubbling element has a lower score than the parent element, swap the elements
            if (this.scoreFunction(element) < this.scoreFunction(parentElement))
            {
                this.content[parentElementNo] = element;
                this.content[i_elementNo] = parentElement;
                // Update 'i_elementNo' to continue at the new position.
                i_elementNo = parentElementNo;
            }
            // Found a parent that is less, no need to move it further.
            else
            {
                break;
            }
        }
    };

    BinaryHeap.prototype.sinkDown = function (i_elementNo)
    {
        // Look up the target element and its score.
        var length = this.content.length;
        var element = this.content[i_elementNo];
        var elemScore = this.scoreFunction(element);

        while (true)
        {
            // Compute the indices of the child elements.
            var child2N = (i_elementNo + 1) * 2, child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N],
                    child1Score = this.scoreFunction(child1);
                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore)
                    swap = child1N;
            }
            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N],
                    child2Score = this.scoreFunction(child2);
                if (child2Score < (swap == null ? elemScore : child1Score)){
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap != null)
            {
                this.content[i_elementNo] = this.content[swap];
                this.content[swap] = element;
                i_elementNo = swap;
            }
            // Otherwise, we are done.
            else
            {
                break;
            }
        }
    };

    exports.BinaryHeap = BinaryHeap;

    // + }}}
}));
