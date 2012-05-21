module("Basics and Options");

test("Defaults to 0x0", function() {
  function Plain() {}
  Vector.mixinTo(Plain);

  var p1 = new Plain();
  equal(p1.getX(), 0, "X equals 0");
  equal(p1.getY(), 0, "Y equals 0");
});

test("Alternative Default", function() {
  function Plain() {}
  Vector.mixinTo(Plain, null, {
    defaultX: 10,
    defaultY: 20
  });

  var p1 = new Plain();
  equal(p1.getX(), 10, "X equals 10");
  equal(p1.getY(), 20, "Y equals 20");
});

test("No getters and setters by default", function() {
  function Plain() {}
  Vector.mixinTo(Plain, null, {
    
  });

  var p1 = new Plain();
  equal(p1.x, undefined, ".x is undefined");
});


module("Get and Set");

test("Get and Set", function() {
  function Plain() {}
  Vector.mixinTo(Plain);

  var p1 = new Plain();
  equal(p1.getX(), 0, ".x is 0");
  equal(p1.getY(), 0, ".y is 0");
  
  p1.setX(10);
  p1.setY(20);
  equal(p1.getX(), 10, ".x is 10");
  equal(p1.getY(), 20, ".y is 20");
  
  p1.set(30, 40);
  equal(p1.getX(), 30, ".x is 30");
  equal(p1.getY(), 40, ".y is 40");
});

test("Getters and setters", function() {
  function Plain() {}
  Vector.mixinTo(Plain, null, {
    nativeGettersAndSetters: true
  });

  var p1 = new Plain();
  equal(p1.x, 0, ".x is 0");
  equal(p1.y, 0, ".y is 0");
  
  p1.x = 10;
  p1.y = 20;
  equal(p1.x, 10, ".x is 10");
  equal(p1.y, 20, ".y is 20");
});

module("Add");
test("Add same classes", function() {
  function Plain() {}
  Vector.mixinTo(Plain);

  var p1 = new Plain();
  
  var p2 = new Plain();
  p2.set(10, 20);
  
  p1.add(p2);
  equal(p1.getX(), 10, ".x is 10");
  equal(p1.getY(), 20, ".y is 20");
});

test("Add same different classes", function() {
  function Plain() {}
  Vector.mixinTo(Plain, "velocity");
  
  function Plain2() {}
  Vector.mixinTo(Plain2, "position");

  var p1 = new Plain();
  
  var p2 = new Plain2();
  p2.setPosition(10, 20);
  
  p1.addVelocity(p2, "position");
  equal(p1.getVelocityX(), 10, ".x is 10");
  equal(p1.getVelocityY(), 20, ".y is 20");
});

module("Subtract");
test("Subtract same classes", function() {
  function Plain() {}
  Vector.mixinTo(Plain);

  var p1 = new Plain();
  
  var p2 = new Plain();
  p2.set(10, 20);
  
  p1.subtract(p2);
  equal(p1.getX(), -10, ".x is -10");
  equal(p1.getY(), -20, ".y is -20");
});

test("Subtract same different classes", function() {
  function Plain() {}
  Vector.mixinTo(Plain, "velocity");
  
  function Plain2() {}
  Vector.mixinTo(Plain2, "position");

  var p1 = new Plain();
  
  var p2 = new Plain2();
  p2.setPosition(10, 20);
  
  p1.subtractVelocity(p2, "position");
  equal(p1.getVelocityX(), -10, ".x is -10");
  equal(p1.getVelocityY(), -20, ".y is -20");
});

module("Multiply");
test("Multiply same classes", function() {
  function Plain() {}
  Vector.mixinTo(Plain);

  var p1 = new Plain();
  p1.set(1, 2);
  
  var p2 = new Plain();
  p2.set(10, 10);
  
  p1.multiply(p2);
  equal(p1.getX(), 10, ".x is 210");
  equal(p1.getY(), 20, ".y is 20");
});

test("Multiply same different classes", function() {
  function Plain() {}
  Vector.mixinTo(Plain);
  Vector.mixinTo(Plain, "velocity");
  
  function Plain2() {}
  Vector.mixinTo(Plain2, "position");

  var p1 = new Plain();
  p1.setVelocity(1, 2);
  
  var p2 = new Plain2();
  p2.setPosition(10, 10);
  
  p1.multiplyVelocity(p2, "position");
  equal(p1.getVelocityX(), 10, ".x is 10");
  equal(p1.getVelocityY(), 20, ".y is 20");
});

module("Divide");
test("Divide same classes", function() {
  function Plain() {}
  Vector.mixinTo(Plain);

  var p1 = new Plain();
  p1.set(10, 20);
  
  var p2 = new Plain();
  p2.set(1, 2);
  
  p1.divide(p2);
  equal(p1.getX(), 10, ".x is 10");
  equal(p1.getY(), 10, ".y is 10");
});

test("Divide same different classes", function() {
  function Plain() {}
  Vector.mixinTo(Plain, "velocity");
  
  function Plain2() {}
  Vector.mixinTo(Plain2, "position");

  var p1 = new Plain();
  p1.setVelocity(10, 20);
  
  var p2 = new Plain2();
  p2.setPosition(1, 2);
  
  p1.divideVelocity(p2, "position");
  equal(p1.getVelocityX(), 10, ".x is 10");
  equal(p1.getVelocityY(), 10, ".y is 10");
});

module("Scale");
test("Scale vector", function() {
  function Plain() {}
  Vector.mixinTo(Plain);

  var p1 = new Plain();
  p1.set(1, 2);
  
  p1.scale(10);
  equal(p1.getX(), 10, ".x is 10");
  equal(p1.getY(), 20, ".y is 20");
});

module("Dot product");
test("Dot product same classes", function() {
  function Plain() {}
  Vector.mixinTo(Plain);

  var p1 = new Plain();
  p1.set(10, 20);
  
  var p2 = new Plain();
  p2.set(1, 2);
  
  p1.dot(p2);
  equal(p1.getX(), 10, ".x is 10");
  equal(p1.getY(), 40, ".y is 40");
});

test("Dot product same different classes", function() {
  function Plain() {}
  Vector.mixinTo(Plain, "velocity");
  
  function Plain2() {}
  Vector.mixinTo(Plain2, "position");

  var p1 = new Plain();
  p1.setVelocity(10, 20);
  
  var p2 = new Plain2();
  p2.setPosition(1, 2);
  
  p1.dotVelocity(p2, "position");
  equal(p1.getVelocityX(), 10, ".x is 10");
  equal(p1.getVelocityY(), 40, ".y is 40");
});

module("Cross product");
test("Cross product same classes", function() {
  function Plain() {}
  Vector.mixinTo(Plain);

  var p1 = new Plain();
  p1.set(10, 20);
  
  var p2 = new Plain();
  p2.set(1, 2);
  
  p1.cross(p2);
  equal(p1.getX(), 20, ".x is 20");
  equal(p1.getY(), 20, ".y is 20");
});

test("Cross product same different classes", function() {
  function Plain() {}
  Vector.mixinTo(Plain, "velocity");
  
  function Plain2() {}
  Vector.mixinTo(Plain2, "position");

  var p1 = new Plain();
  p1.setVelocity(10, 20);
  
  var p2 = new Plain2();
  p2.setPosition(1, 2);
  
  p1.crossVelocity(p2, "position");
  equal(p1.getVelocityX(), 20, ".x is 20");
  equal(p1.getVelocityY(), 20, ".y is 20");
});