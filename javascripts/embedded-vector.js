/*jshint forin:true, eqnull:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, undef:true, curly:true, node:true, sub:true, latedef:true, newcap:true, indent:2, maxerr:50 */
(function () {
  // Whether or not Object.defineProperty is supported
  var canDefineProperty = (function () {
    var canRedefineProperties, defProp;
    defProp = Object.defineProperty;
    if (defProp) {
      try {
        defProp({}, 'a', {
          get: function () {}
        });
      } catch (e) {
        defProp = null;
      }
    }
    if (defProp) {
      canRedefineProperties = (function () {
        var obj;
        obj = {};
        defProp(obj, 'a', {
          configurable: true,
          enumerable: true,
          get: function () {},
          set: function () {}
        });
        defProp(obj, 'a', {
          configurable: true,
          enumerable: true,
          writable: true,
          value: true
        });
        return obj.a === true;
      })();
      if (!canRedefineProperties) { defProp = null; }
    }
    return defProp;
  })();

  // Helper methods
  function capitalizeWord(s) {
    if (s != null) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    } else {
      return "";
    }
  }

  function buildMethodName(prefix, name) {
    return name + capitalizeWord(prefix);
  }

  function getPropFromTargetObject(obj, v, prop, targetPrefix) {
    var getterNameVar, propBaseName;
    if (obj.constructor === v.constructor) {
      return v[obj["" + prop + "GetterName"]]();
    } else if (targetPrefix != null) {
      propBaseName = targetPrefix != null ? "" + targetPrefix + (prop.toUpperCase()) : prop;
      return v[buildMethodName(propBaseName, "get")]();
    } else {
      getterNameVar = buildMethodName(prop, "get");
      if (v[getterNameVar] != null) {
        return v[v[getterNameVar]]();
      } else {
        throw "Property " + prop + " not found on object. Try passing a 'targetPrefix' for cross-class comparisons.";
      }
    }
  }

  // Core Mixin
  function Vector(prefix, options) {
    var atan2 = Math.atan2,
        sqrt  = Math.sqrt,
        sin   = Math.sin,
        cos   = Math.cos,
        PI    = Math.PI,
        RAD_TO_DEGREE = PI / 180;
      
    if (options == null) { options = {}; }
  
    if (options.defaultX == null) { options.defaultX = 0.0; }
    if (options.defaultY == null) { options.defaultY = 0.0; }
  
    if (options.nativeGettersAndSetters == null) {
      options.nativeGettersAndSetters = false;
    }
  
    var xBaseName = prefix != null ? "" + prefix + "X" : "x",
        yBaseName = prefix != null ? "" + prefix + "Y" : "y",
  
        xVariableName = "_" + xBaseName,
        yVariableName = "_" + yBaseName;
  
    this[xVariableName] = options.defaultX;
    this[yVariableName] = options.defaultY;
  
    function getX() {
      return this[xVariableName];
    }
  
    function getY() {
      return this[yVariableName];
    }
  
    function setX(v) {
      return this[xVariableName] = v;
    }
  
    function setY(v) {
      return this[yVariableName] = v;
    }
  
    // Support native Getters and Setters if requested and supported
    if (options.nativeGettersAndSetters && canDefineProperty) {
      Object.defineProperty(this, xBaseName, {
        get: getX,
        set: setX
      });
      Object.defineProperty(this, yBaseName, {
        get: getY,
        set: setY
      });
    }
  
    // Sets the components of this vector.
    function set(x, y) {
      setX.call(this, x);
      setY.call(this, y);
    }
  
    // Add a vector to this one.
    function add(v, targetPrefix) {
      var targetX = getPropFromTargetObject(this, v, "x", targetPrefix),
          targetY = getPropFromTargetObject(this, v, "y", targetPrefix);
      setX.call(this, getX.call(this) + targetX);
      setY.call(this, getY.call(this) + targetY);
    }
  
    // Subtracts a vector from this one.
    function subtract(v, targetPrefix) {
      var targetX = getPropFromTargetObject(this, v, "x", targetPrefix),
          targetY = getPropFromTargetObject(this, v, "y", targetPrefix);
      setX.call(this, getX.call(this) - targetX);
      setY.call(this, getY.call(this) - targetY);
    }
    
    // Multiply a vector by this one.
    function multiply(v, targetPrefix) {
      var targetX = getPropFromTargetObject(this, v, "x", targetPrefix),
          targetY = getPropFromTargetObject(this, v, "y", targetPrefix);
      setX.call(this, getX.call(this) * targetX);
      setY.call(this, getY.call(this) * targetY);
    }
    
    // Divide a vector by this one.
    function divide(v, targetPrefix) {
      var targetX = getPropFromTargetObject(this, v, "x", targetPrefix),
          targetY = getPropFromTargetObject(this, v, "y", targetPrefix);
      setX.call(this, getX.call(this) / targetX);
      setY.call(this, getY.call(this) / targetY);
    }
    
    // Scales this vector by a value.
    function scale(factor) {
      setX.call(this, getX.call(this) * factor);
      setY.call(this, getY.call(this) * factor);
    }
  
    // Computes the dot product between vectors.
    function dot(v, targetPrefix) {
      var targetX = getPropFromTargetObject(this, v, "x", targetPrefix),
          targetY = getPropFromTargetObject(this, v, "y", targetPrefix);
      setX.call(this, getX.call(this) * targetX);
      setY.call(this, getY.call(this) * targetY);
    }
  
    // Computes the cross product between vectors.
    function cross(v, targetPrefix) {
      var targetX = getPropFromTargetObject(this, v, "x", targetPrefix),
          targetY = getPropFromTargetObject(this, v, "y", targetPrefix);
      setX.call(this, getX.call(this) * targetY);
      setY.call(this, getY.call(this) * targetX);
    }
  
    // Computes the squared magnitude (length).
    function magnitudeSquared() {
      var x = getX.call(this),
          y = getY.call(this);
      return x * x + y * y;
    }
  
    // Computes the magnitude (length).
    function magnitude() {
      return sqrt(this[buildMethodName(prefix, "magnitudeSquared")]());
    }
  
    // Computes the squared distance to another vector.
    function distanceSquared(v, targetPrefix) {
      var targetX = getPropFromTargetObject(this, v, "x", targetPrefix),
          targetY = getPropFromTargetObject(this, v, "y", targetPrefix),
          x = getX.call(this),
          y = getY.call(this),
          dx = targetX - x,
          dy = targetY - y;
      return dx * dx + dy * dy;
    }
  
    // Computes the distance to another vector.
    function distance(v, targetPrefix) {
      return sqrt(this[buildMethodName(prefix, "distanceSquared")](v, targetPrefix));
    }
  
    // Computes angle between two vectors
    function angle(v, targetPrefix) {
      var targetX = getPropFromTargetObject(this, v, "x", targetPrefix),
          targetY = getPropFromTargetObject(this, v, "y", targetPrefix),
          x = getX.call(this),
          y = getY.call(this);
          
      return atan2(targetY - y, targetX - x) * 180 / PI;
    }
    
    // Rotate vector (optionally around another vector)
    function rotate(angle, v, targetPrefix) {
      var radAngle = angle * RAD_TO_DEGREE,
          x = getX.call(this),
          y = getY.call(this),
          targetX, targetY;
        
      if (typeof v !== "undefined") {
        targetX = getPropFromTargetObject(this, v, "x", targetPrefix);
        targetY = getPropFromTargetObject(this, v, "y", targetPrefix);
        
        x -= targetX;
        y -= targetY;
      }
      
      var s = sin(angle),
          c = cos(angle),
          resultX = x * c - y * s,
          resultY = y * c + x * s;

      if (targetX || targetY) {
        resultX += targetX;
        resultY += targetY;
      }
      
      setX.call(this, resultX);
      setY.call(this, resultY);
    }
    
    // Normalises the vector, making it a unit vector (of length 1).
    function normalize() {
      var x = getX.call(this),
          y = getY.call(this),
          m = sqrt(x * x + y * y);
      setX.call(this, x / m);
      setY.call(this, y / m);
    }
  
    // Limits the vector length to a given amount.
    function limit(l) {
      var mSq = this[buildMethodName(prefix, "magnitudeSquared")]();
      if (mSq > l * l) {
        var m = sqrt(mSq),
            x = getX.call(this),
            y = getY.call(this);
        x /= m;
        y /= m;
        x *= l;
        y *= l;
        
        setX.call(this, x);
        setY.call(this, y);
      }
    }
  
    // Copies components from another vector.
    function copy(v, targetPrefix) {
      var targetX = getPropFromTargetObject(this, v, "x", targetPrefix),
          targetY = getPropFromTargetObject(this, v, "y", targetPrefix);
      setX.call(this, targetY);
      setY.call(this, targetX);
    }
  
    // Resets the vector to zero.
    function clear() {
      setX.call(this, 0.0);
      setY.call(this, 0.0);
    }
    
    // Assign methods to passed-in Object
    
    this[buildMethodName(xBaseName, "get")]           = getX;
    this[buildMethodName(yBaseName, "get")]           = getY;
    this[buildMethodName(xBaseName, "set")]           = setX;
    this[buildMethodName(yBaseName, "set")]           = setY;
    
    this[buildMethodName(prefix, "set")]              = set;
    this[buildMethodName(prefix, "add")]              = add;
    this[buildMethodName(prefix, "subtract")]         = subtract;
    this[buildMethodName(prefix, "multiply")]         = multiply;
    this[buildMethodName(prefix, "divide")]           = divide;
    this[buildMethodName(prefix, "scale")]            = scale;
    this[buildMethodName(prefix, "dot")]              = dot;
    this[buildMethodName(prefix, "cross")]            = cross;
    this[buildMethodName(prefix, "magnitudeSquared")] = magnitudeSquared;
    this[buildMethodName(prefix, "magnitude")]        = magnitude;
    this[buildMethodName(prefix, "distanceSquared")]  = distanceSquared;
    this[buildMethodName(prefix, "distance")]         = distance;
    this[buildMethodName(prefix, "angle")]            = angle;
    this[buildMethodName(prefix, "rotate")]           = rotate;
    this[buildMethodName(prefix, "normalize")]        = normalize;
    this[buildMethodName(prefix, "limit")]            = limit;
    this[buildMethodName(prefix, "copy")]             = copy;
    this[buildMethodName(prefix, "clear")]            = clear;
  }

  // Convenience mixinTo alias
  Vector["mixinTo"] = function mixinTo(target, prefix) {
    return Vector.call(target.prototype, prefix);
  };
  
  // Find a point somewhere between two numbers
  Vector["mix"] = function mix(start, end, percentage) {
    return start * (1.0 - percentage) + end * percentage;
  };

  // Export mixin
  var root = typeof exports !== "undefined" && exports !== null ? exports : this;
  root["Vector"] = Vector;
})();