embeddedVector = do ->
  ### Helper methods ###
  capitalizeWord = (s) -> 
    if s? then s.charAt(0).toUpperCase() + s.slice(1) else ""
  
  buildMethodName = (prefix, name) -> "#{name}#{capitalizeWord(prefix)}"

  getPropFromTargetObject = (obj, v, prop, targetPrefix) ->
    if obj.constructor == v.constructor
      v[obj["#{prop}GetterName"]]()
    else if targetPrefix?
      propBaseName = if targetPrefix? then "#{targetPrefix}#{prop.toUpperCase()}" else prop
      v[buildMethodName(propBaseName, "get")]()
    else
      getterNameVar = buildMethodName(prop, "get")
      if v[getterNameVar]?
        v[v[getterNameVar]]()
      else 
        throw "Property #{prop} not found on object. Try passing a 'targetPrefix' for cross-class comparisons."

  mixin = (prefix) ->
    xBaseName = if prefix? then "#{prefix}X" else "x"
    yBaseName = if prefix? then "#{prefix}Y" else "y"

    xGetterName = buildMethodName(xBaseName, "get")
    yGetterName = buildMethodName(yBaseName, "get")
  
    xSetterName = buildMethodName(xBaseName, "set")
    ySetterName = buildMethodName(yBaseName, "set")
  
    xVariableName = "_#{xBaseName}"
    yVariableName = "_#{yBaseName}"
  
    @[xGetterName] = -> @[xVariableName]
    @[yGetterName] = -> @[yVariableName]
  
    @[xSetterName] = (v) -> @[xVariableName] = v; undefined
    @[ySetterName] = (v) -> @[yVariableName] = v; undefined

    ### Sets the components of this vector. ###
    @[buildMethodName(prefix, "set")] = (x, y) ->
      @[xSetterName](x)
      @[ySetterName](x)
      undefined
  
    ### Add a vector to this one. ###
    @[buildMethodName(prefix, "add")] = (v, targetPrefix) ->
      targetX = getPropFromTargetObject(this, v, "x", targetPrefix)
      targetY = getPropFromTargetObject(this, v, "y", targetPrefix)
    
      @[xSetterName](@[xGetterName]() + targetX)
      @[ySetterName](@[yGetterName]() + targetY)
      undefined
  
    ### Subtracts a vector from this one. ###
    @[buildMethodName(prefix, "subtract")] = (v, targetPrefix) ->
      targetX = getPropFromTargetObject(this, v, "x", targetPrefix)
      targetY = getPropFromTargetObject(this, v, "y", targetPrefix)
    
      @[xSetterName](@[xGetterName]() - targetX)
      @[ySetterName](@[yGetterName]() - targetY)
      undefined

    ### Scales this vector by a value. ###
    @[buildMethodName(prefix, "scale")] = (factor) ->
      @[xSetterName](@[xGetterName]() * factor)
      @[ySetterName](@[yGetterName]() * factor)
      undefined

    ### Computes the dot product between vectors. ###
    @[buildMethodName(prefix, "dot")] = (v, targetPrefix) ->
      targetX = getPropFromTargetObject(this, v, "x", targetPrefix)
      targetY = getPropFromTargetObject(this, v, "y", targetPrefix)
  
      @[xSetterName](@[xGetterName]() * targetX)
      @[ySetterName](@[yGetterName]() * targetY)
      undefined

    ### Computes the cross product between vectors. ###
    @[buildMethodName(prefix, "cross")] = (v, targetPrefix) ->
      targetX = getPropFromTargetObject(this, v, "x", targetPrefix)
      targetY = getPropFromTargetObject(this, v, "y", targetPrefix)
  
      @[xSetterName](@[xGetterName]() * targetY)
      @[ySetterName](@[yGetterName]() * targetX)
      undefined

    ### Computes the squared magnitude (length). ###
    @[buildMethodName(prefix, "magnitudeSquared")] = ->
      x = @[xGetterName]()
      y = @[yGetterName]()
      x*x + y*y
    
    ### Computes the magnitude (length). ###
    @[buildMethodName(prefix, "magnitude")] = ->
      Math.sqrt @[buildMethodName(prefix, "magnitudeSquared")]()

    ### Computes the squared distance to another vector. ###
    @[buildMethodName(prefix, "distanceSquared")] = (v, targetPrefix) ->
      targetX = getPropFromTargetObject(this, v, "x", targetPrefix)
      targetY = getPropFromTargetObject(this, v, "y", targetPrefix)
  
      x = @[xGetterName]()
      y = @[yGetterName]()
    
      dx = targetX - x
      dy = targetY - y
    
      dx*dx + dy*dy
    
    ### Computes the distance to another vector. ###
    @[buildMethodName(prefix, "distance")] = (v, targetPrefix) ->
      Math.sqrt @[buildMethodName(prefix, "distanceSquared")](v, targetPrefix)

    ### Normalises the vector, making it a unit vector (of length 1). ###
    @[buildMethodName(prefix, "normalize")] = ->
      x = @[xGetterName]()
      y = @[yGetterName]()
      m = Math.sqrt x*x + y*y
    
      @[xSetterName](x / m)
      @[ySetterName](y / m)
      undefined

    ### Limits the vector length to a given amount. ###
    @[buildMethodName(prefix, "limit")] = (l) ->
      mSq = @[buildMethodName(prefix, "magnitudeSquared")]()
      if mSq > l*l
        m = Math.sqrt mSq
        x = @[xGetterName]()
        y = @[yGetterName]()
      
        @[xSetterName](x / m)
        @[ySetterName](y / m)
        @[xSetterName](x * l)
        @[ySetterName](y * l)
      
      undefined

    ### Copies components from another vector. ###
    @[buildMethodName(prefix, "copy")] = (v, targetPrefix) ->
      targetX = getPropFromTargetObject(this, v, "x", targetPrefix)
      targetY = getPropFromTargetObject(this, v, "y", targetPrefix)
  
      @[xSetterName](targetY)
      @[ySetterName](targetX)
      undefined

    ### Resets the vector to zero. ###
    @[buildMethodName(prefix, "clear")] = ->
      @[xSetterName](0.0)
      @[ySetterName](0.0)
      undefined

  mixin.mixinTo = (target, prefix) -> mixin.call(target["prototype"], prefix)
  mixin

@Particle = class Particle
embeddedVector.mixinTo(Particle)

@Sprite = class Sprite
embeddedVector.mixinTo(Sprite, "target")

@p = new Particle
@p.set(0, 0)

@s = new Sprite
@s.setTarget(0, 0)