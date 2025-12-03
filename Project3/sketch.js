let world;
let snowflakes = [];

function setup() {
  noCanvas();

  // 创建世界
  world = new World('VRScene');
  world.setBackground(170, 200, 255);  // 冬季天空蓝

  // 使用已有相机，只调整玩家初始位置
  world.setUserPosition(0, 1.6, 5);

  // ---- 地面（雪地） ----
  let ground = new Plane({
    x: 0, y: 0, z: 0,
    width: 200, height: 200,
    rotationX: -90,
    red: 240, green: 240, blue: 255
  });
  world.add(ground);

  // ---- 圣诞树 ----
  makeChristmasTree(0, 0, -5);
  // ---- 雪人 Snowman ----
makeSnowman(2, 0, -5);

  // ---- 装饰球 ----
  for (let i = 0; i < 20; i++) {
    let ball = new Sphere({
      x: 0 + random(-1, 1),
      y: 1.2 + random(-0.5, 2),
      z: -5 + random(-1, 1),
      radius: 0.12,
      red: random(100,255),
      green: random(100,255),
      blue: random(100,255)
    });
    world.add(ball);
  }
}

function draw() {


  if (frameCount % 2 === 0) {
    createSnowflake();
  }


  for (let flake of snowflakes) {
    flake.y -= 0.03;                     // 掉落速度
    flake.x += random(-0.02, 0.02);      // 左右飘动

 

    // 更新位置
    flake.setPosition(flake.x, flake.y, flake.z);

    // 到达地面就删除
    if (flake.y < 0.1) {
      world.remove(flake);
      snowflakes.splice(snowflakes.indexOf(flake), 1);
    }
  }
}


// === 创建圣诞树 ===
function makeChristmasTree(x, y, z) {

  // 树干
  let trunk = new Cylinder({
    x: x,
    y: y + 0.5,
    z: z,
    radius: 0.2,
    height: 2,
    red: 110, green: 70, blue: 50
  });
  world.add(trunk);

  // 三层绿树冠
  for (let i = 0; i < 3; i++) {
    let cone = new Cone({
      x: x,
      y: y + 2 + i * 0.8,
      z: z,
      height: 1.4,
      radiusBottom: 1.2 - i * 0.3,
      radiusTop: 0,
      red: 30,
      green: 150 + i * 20,
      blue: 30
    });
    world.add(cone);
  }
}
function makeSnowman(x, y, z) {

  // 身体（3 层雪球）
  let bottom = new Sphere({
    x: x,
    y: y + 0.6,
    z: z,
    radius: 0.6,
    red: 255, green: 255, blue: 255
  });
  world.add(bottom);

  let middle = new Sphere({
    x: x,
    y: y + 1.3,
    z: z,
    radius: 0.45,
    red: 255, green: 255, blue: 255
  });
  world.add(middle);

  let head = new Sphere({
    x: x,
    y: y + 1.8,
    z: z,
    radius: 0.3,
    red: 255, green: 255, blue: 255
  });
  world.add(head);

  // 眼睛
  let leftEye = new Sphere({
    x: x - 0.1,
    y: y + 1.88,
    z: z + 0.25,
    radius: 0.03,
    red: 0, green: 0, blue: 0
  });
  let rightEye = new Sphere({
    x: x + 0.1,
    y: y + 1.88,
    z: z + 0.25,
    radius: 0.03,
    red: 0, green: 0, blue: 0
  });
  world.add(leftEye);
  world.add(rightEye);

  // 鼻子（胡萝卜）
  let nose = new Cone({
    x: x,
    y: y + 1.8,
    z: z + 0.3,
    height: 0.25,
    radiusBottom: 0.05,
    radiusTop: 0,
    red: 255, green: 128, blue: 0,
    rotationX: 90
  });
  world.add(nose);

  // 按钮
  for (let i = 0; i < 3; i++) {
    let btn = new Sphere({
      x: x,
      y: y + 1.2 - i * 0.25,
      z: z + 0.45,
      radius: 0.04,
      red: 0, green: 0, blue: 0
    });
    world.add(btn);
  }
}


// === 创建雪花 ===
function createSnowflake() {

  // 位置更近，更容易看到雪
  let flake = new Sphere({
    x: random(-5, 5),
    y: random(5, 8),
    z: random(-5, 5),
    radius: 0.15,         // 更大，明显得多
    red: 255, green: 255, blue: 255
  });

  flake.spin = 0;

  snowflakes.push(flake);
  world.add(flake);
}
