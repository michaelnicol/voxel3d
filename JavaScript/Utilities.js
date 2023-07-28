import { HashStorage } from "./HashStorage.js";
import { VoxelStorage } from "./VoxelStorage.js";
import { Point2D } from "./Point2D.js";
import { PointFactoryMethods } from "./PointFactoryMethods.js";
import { BoundingBox2D } from "./BoundingBox2D.js";
export class Utilities {
    static pythagorean(p1, p2) {
        if (p1.dimensionCount() != p2.dimensionCount() || p1.dimensionCount() === 0 || p2.dimensionCount() === 0) {
            throw new Error(`Dimensions are not the same or dimension count is zero: p1 ${p1.dimensionCount()} verse p2 ${p2.dimensionCount()}`);
        }
        let d = 0;
        for (let i = 0; i < p1.dimensionCount(); i++) {
            d += Math.pow(Math.abs(p1.arr[i] - p2.arr[i]), 2);
        }
        return Math.sqrt(d);
    }
    static bresenham(p1, p2, returnType) {
        if (p1.dimensionCount() != p2.dimensionCount() || p1.dimensionCount() === 0 || p2.dimensionCount() === 0) {
            throw new Error(`Dimensions are not the same or dimension count is zero: p1 ${p1.dimensionCount()} verse p2 ${p2.dimensionCount()}`);
        }
        let coordinates = [];
        let voxelStorage = new VoxelStorage(p1.dimensionCount());
        let hashStorage = new HashStorage(p1.dimensionCount());
        let flag = true;
        const startPoint = p1.arr.map(x => Math.round(x));
        const endPoint = p2.arr.map(x => Math.round(x));
        for (let i = 0; i < startPoint.length; i++) {
            if (startPoint[i] != endPoint[i]) {
                flag = false;
            }
        }
        if (flag) {
            if (returnType === 0) {
                return [p1.factoryMethod(startPoint)];
            }
            else if (returnType === 1) {
                voxelStorage.addCoordinate(p1.factoryMethod(startPoint), false);
                return voxelStorage;
            }
            else if (returnType === 2) {
                hashStorage.addCoordinate(p1.factoryMethod(startPoint), false);
                return hashStorage;
            }
        }
        const currentPoint = [...startPoint];
        const differences = [];
        const increments = [];
        let indexOfGreatest = 0;
        const dimensions = p1.dimensionCount();
        for (let i = 0; i < dimensions; i++) {
            differences.push(Math.abs(endPoint[i] - startPoint[i]));
            if (endPoint[i] - startPoint[i] < 0) {
                increments.push(-1);
            }
            else {
                increments.push(1);
            }
            if (differences[i] > differences[indexOfGreatest]) {
                indexOfGreatest = i;
            }
        }
        let steppingValues = [];
        for (let i = 0; i < dimensions; i++) {
            steppingValues.push(2 * differences[i] - differences[indexOfGreatest]);
        }
        while (true) {
            if (!(startPoint[indexOfGreatest] < endPoint[indexOfGreatest] ? (currentPoint[indexOfGreatest] <= endPoint[indexOfGreatest]) : (currentPoint[indexOfGreatest] >= endPoint[indexOfGreatest]))) {
                if (returnType === 0) {
                    return coordinates;
                }
                else if (returnType === 1) {
                    return voxelStorage;
                }
                else {
                    return hashStorage;
                }
            }
            if (returnType === 0) {
                coordinates.push(p1.factoryMethod([...currentPoint]));
            }
            else if (returnType === 1) {
                voxelStorage.addCoordinate(p1.factoryMethod([...currentPoint]), false);
            }
            else {
                hashStorage.addCoordinate(p1.factoryMethod([...currentPoint]), false);
            }
            for (let i = 0; i < dimensions; i++) {
                if (i === indexOfGreatest) {
                    continue;
                }
                else if (steppingValues[i] < 0) {
                    steppingValues[i] += (2 * differences[i]);
                }
                else {
                    currentPoint[i] += increments[i];
                    steppingValues[i] += ((2 * differences[i]) - (2 * differences[indexOfGreatest]));
                }
            }
            currentPoint[indexOfGreatest] += increments[indexOfGreatest];
        }
    }
    static pointCenter(points) {
        let center = new Point2D(0, 0);
        points.forEach(value => {
            center.arr[0] += value.arr[0];
            center.arr[1] += value.arr[1];
        });
        center.arr[0] /= points.length;
        center.arr[1] /= points.length;
        return center;
    }
    static rotatePoint(point, center, rad) {
        const cx = center.arr[0];
        const cy = center.arr[1];
        const px = point.arr[0] - cx;
        const py = point.arr[1] - cy;
        return new Point2D(((px * Math.cos(rad)) - (py * Math.sin(rad))) + cx, ((px * Math.sin(rad)) + (py * Math.cos(rad))) + cy);
    }
    static pythagoreanSort(points, referencePoint) {
        return points.sort((a, b) => Utilities.pythagorean(referencePoint, a) - Utilities.pythagorean(referencePoint, b));
    }
    static #radToDegConstant = 180 / Math.PI;
    static polarSortCross(points, referencePoint) {
        const assertedRF = referencePoint == undefined ? new Point2D(0, 0) : referencePoint;
        return points.sort((a, b) => {
            let result = Utilities.cross2D(new Point2D(a.arr[0] - assertedRF.arr[0], a.arr[1] - assertedRF.arr[1]), new Point2D(b.arr[0] - assertedRF.arr[0], b.arr[1] - assertedRF.arr[1]));
            return result === 0 ? Utilities.pythagorean(a, assertedRF) - Utilities.pythagorean(b, assertedRF) : result;
        });
    }
    static polarSortAtan2(points, removeCollinear, referencePoint) {
        let sortedPoints = points.reduce((accumulator, cv) => {
            return accumulator.push(cv.clone()), accumulator;
        }, []);
        const assertedRF = referencePoint == undefined ? new Point2D(0, 0) : referencePoint;
        const polarMap = new Map();
        sortedPoints.forEach((value) => {
            let angle = Math.atan2((value.arr[1] - assertedRF.arr[1]), (value.arr[0] - assertedRF.arr[0])) * Utilities.#radToDegConstant;
            angle += angle < 0 ? 360 : 0;
            polarMap.has(angle) ? polarMap.get(angle)?.push(value) : polarMap.set(angle, [value]);
        });
        if (removeCollinear) {
            polarMap.forEach((value, key) => {
                value = [Utilities.pythagoreanSort(value, assertedRF)[0]];
            });
        }
        let sortedKeys = Object.keys(polarMap).map(value => Number(value)).sort((a, b) => a - b);
        let returnPoints = [];
        sortedKeys.forEach(value => returnPoints.push(polarMap.get(value)[0]));
        return returnPoints;
    }
    static pointOrientation = (p1, p2, p3) => {
        // returns slope from p1 to p2 minus p2 to p3
        return ((p2.arr[0] - p1.arr[0]) * (p3.arr[1] - p1.arr[1])) - ((p2.arr[1] - p1.arr[1]) * (p3.arr[0] - p1.arr[0]));
    };
    static cross2D = (p1, p2) => {
        return (p1.arr[0] * p2.arr[1]) - (p2.arr[0] * p1.arr[1]);
    };
    static convexHull(inputPoints) {
        let stack = [];
        // Sort the data set from lowest x value to highest
        let sortedPoints = inputPoints.reduce((accumulator, value) => {
            return accumulator.push(value.clone()), accumulator;
        }, []);
        sortedPoints.sort((a, b) => a.arr[0] - b.arr[0]).sort((a, b) => a.arr[1] - b.arr[1]);
        let referencePoint = sortedPoints[0];
        Utilities.polarSortCross(sortedPoints, referencePoint);
        stack = [];
        for (let i = 0; i < sortedPoints.length; i++) {
            let point = sortedPoints[i];
            if (stack.length > 1) {
                while (stack.length > 1 && Utilities.pointOrientation(stack[1], stack[0], point) >= 0) {
                    stack.shift();
                }
            }
            stack.unshift(point);
        }
        return stack;
    }
    /**
     * Finds the minimum bounding box for a convex hull. A convex hull is required because the rotation algorithm is based upon angles of convex line segments and the axes.
     *
     * The return structure includes the angle the convex hull (and the points the hull is based upon) must be rotated around the center to become the minimum bounding box.
     *
     * The angle is based upon JS atan2, so the angle is between each convex line segment and the positive x-axis (counter clockwise rotation)
     *
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2 | JavaScript atan2 Method}
     * @param convexHull Ordered convex hull points
     * @param gap If the resulting bounding box should have a gap around it.
     * @returns Format of MinimumRotationScheme
     */
    static minimumBoundingBox(convexHull, gap) {
        let bestArea = Number.MAX_VALUE;
        let bestAngle = 0;
        let bestHull = [];
        if (convexHull.length === 1) {
            return {
                "rotationAngle": 0,
                "rotationCenter": convexHull[0].clone(),
                "originalConvexHull": convexHull,
                "rotatedConvexHull": [convexHull[0].clone()],
                "rotatedBoundingBox": new BoundingBox2D(convexHull[0], convexHull[0], convexHull[0], convexHull[0], gap)
            };
        }
        /**
         * Default placeholder box. The bestArea is not tracked from this bestBox variable for this reason.
         */
        let bestBox = new BoundingBox2D(new Point2D(0, 0), new Point2D(0, 0), new Point2D(0, 0), new Point2D(0, 0), gap);
        // Find the center of rotation for the convex hull.
        let center = Utilities.pointCenter(convexHull);
        for (let i = 0; i < convexHull.length - 1; i++) {
            // Find the angle of this convex hull segment.
            let currentPoint = convexHull[i];
            let nextPoint = convexHull[i + 1];
            const angle = Math.atan2((nextPoint.arr[1] - currentPoint.arr[1]), (nextPoint.arr[0] - currentPoint.arr[0]));
            // Rotate all coordinates in the bounding box
            let newBoxCoordinates = convexHull.reduce((accumulator, current) => {
                // Rotating a point returns a new one.
                return accumulator.push(Utilities.rotatePoint(current, center, angle)), accumulator;
            }, []);
            let currentBox = BoundingBox2D.createFromExtremes(newBoxCoordinates, gap);
            if (currentBox.area < bestArea) {
                bestBox = currentBox;
                bestArea = currentBox.area;
                bestAngle = angle;
                bestHull = newBoxCoordinates;
            }
        }
        return {
            "rotationAngle": bestAngle,
            "rotationCenter": center,
            "originalConvexHull": convexHull,
            "rotatedConvexHull": bestHull,
            "rotatedBoundingBox": bestBox
        };
    }
    static convertDimensionHigher(p, insertionIndex, insertionValue, currentDimension) {
        let x = [...p.arr];
        x.splice(insertionIndex, 0, insertionValue);
        return PointFactoryMethods.getFactoryMethod(currentDimension + 1)(x);
    }
    /**
     * Creates a string of a given list of points that can be parsed into a new number[][] array or printed.
     *
     * Output Format: [[x1, y1], [x2, y2], [x3, y3], ...]
     *
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse | JavaScript JSON parse Method}
     * @param p List of Points
     * @returns Printable Array String
     */
    static printPointList(p) {
        let str = "[";
        for (let i = 0; i < p.length; i++) {
            if (i != 0) {
                str += ",";
            }
            str += p[i].toPrint();
        }
        return str + "]";
    }
    /**
     * Creates a string of a given list of points that can be copied into the Desmos 2D graphing software.
     *
     * Output Format: (x1, y1), (x2, y2), (x3, y3), ...
     *
     * {@link https://desmos.com/calculator}
     * @param p List of Points
     * @returns Printable Desmos String
     */
    static printPointListDesmos(p) {
        let str = "";
        for (let i = 0; i < p.length; i++) {
            if (i != 0) {
                str += ",";
            }
            str += p[i].toPrint().replace("[", "(").replace("]", ")");
        }
        return str + "";
    }
}
