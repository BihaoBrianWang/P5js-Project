// Project Name : A Cat Who Makes Home Better - By Bihao Wang

// How to play: Explore different rooms by clicking the buttons, and figure out how to make your master wake up in the best shape before time runs out!

//PS:I use GPT to help me debug and learn how to code games like this, but I don’t use AI-generated code.

// ---------- Config ----------
const CANVAS_W = 1920;
const CANVAS_H = 900
const MARGIN = 26;
const CHOICE_W = 250;
const CHOICE_H = 50;
const CHOICE_GAP = 14;
const TEXT_SIZE = 20;
const TITLE_SIZE = 26;
const MAX_CHOICES_PER_ROW = 3;
const MAP_W = 230;
//Time Count Down Variable
const TOTAL_TIME_SEC = 24000;     
const TIMER_BAR_W = 260;         
const TIMER_BAR_H = 40 

//-----------Flow Background-----------
  let cols = 12, rows = 7;

// ---------- Game Data ----------
let game;
let choiceBoxes = [];
let mapButtons = [];

// ---------- Assets ----------
let sndMeow, sndCrash, sndWin;
let imgs = {};

function preload() {
  //Sound Resource
  sndMeow  = loadSound("Sound/Meow.wav");
  sndCrash = loadSound("Sound/GlassCrash.wav");
  sndWin   = loadSound("Sound/WinMeow.ogg");

  //Photoes for Locations
  imgs.imgEntrance   = loadImage("Image/imgEntrance.png");
  imgs.imgKitchen    = loadImage("Image/imgKitchen.png");
  imgs.imgLivingroom = loadImage("Image/imgLivingroom.png");
  imgs.imgDiningroom = loadImage("Image/imgDiningroom.png");
  
  
  imgs.imgHallway = loadImage("Image/imgHallway.png") ;
  imgs.imgBedroom = loadImage("Image/imgBedroom.png");
  imgs.imgGuestbedroom = loadImage("Image/imgGuestbedroom.png");
  imgs.imgStairs =loadImage("Image/imgStairs.png");
  
  imgs.imgJournal = loadImage("Image/imgJournal.png");
  
  
  //Photoes for Ending

  imgs.imgPerfect = loadImage("Image/imgPerfect.png");
  imgs.imgGetup = loadImage("Image/imgGetup.png");
  imgs.imgTrick = loadImage("Image/imgTrick.png");
  imgs.imgTimeout = loadImage("Image/imgTimeout.png");
  imgs.imgMisssomething = loadImage("Image/imgMisssomething.png");
  
}

// ---------- Locations ----------
const locations = {
  entrance:
  {
    title: "Entrance",
    text: "Here is the entrance, you can't open the door because your master not ready for that. You need to wake him up at least.",
    imgKey: "imgEntrance",
    state: { haveshoes:false },
    actions: [
      {
        label: g => locations.entrance.state.haveshoes?"You already put the shoes on the floor ":"Put down the shoes ",
        
        //shoes relative choices
        do: g => {
          console.log('test');
          if (hasItem(g,'Shoes')) 
          {
            g.lastFeedback = "You put the shoes on the floor, so you master can wear a shoes to date.";
            locations.entrance.state.haveshoes = true;
           } 
          else {
            g.lastFeedback = "You need to find master's shoes first.";
          }
        },
      },
      {
        label:g => "Open the door",
        do: g =>
        {
        g.lastFeedback = "No, you can't open the door, you are a cat! Please remember that.";
        }
      }
     
    ]
  },

  kitchen: 
  {
    title: "Kitchen",
    text: "The kitchen is a complete mess. Pots, pans, and yesterday’s leftovers are scattered everywhere, forming a battlefield of cooking chaos.",
    imgKey: "imgKitchen",
    
    state: { tookMug:false, coffeeBrewed:false, toastDone:false },
    actions: [
      {
        label: g => hasItem(g,'Mug') ? "Mug: in inventory" : "Take a mug",
        do: g => {
          if (!locations.kitchen.state.tookMug) {
            addItem(g,'Mug');
            locations.kitchen.state.tookMug = true;
            g.lastFeedback = "Handle secured.";
          } else {
            g.lastFeedback = "You already grabbed a mug.";
          }
        }
      },
      {
        label: g => locations.kitchen.state.coffeeBrewed ? "Coffee brewed ☕" : "Press coffee maker",
        do: g => {
          if (!locations.kitchen.state.coffeeBrewed) {
            locations.kitchen.state.coffeeBrewed = true;
            g.lastFeedback = "Burble… heavenly scent.";
          } else g.lastFeedback = "Still burbling.";
        }
      },
      {
        label: g => hasItem(g,'Coffee')? "Fill mug (done)" : "Fill mug with coffee",
        do: g => {
          if (hasItem(g,'Mug') && locations.kitchen.state.coffeeBrewed) {
            if (!hasItem(g,'Coffee')) {
              addItem(g,'Coffee');
              g.lastFeedback = "Piping hot.";
            } else g.lastFeedback = "Already filled.";
          } else g.lastFeedback = "Need mug and brewed coffee.";
        }
      },
      {
        label: g => locations.kitchen.state.toastDone ? "Toast is ready 🍞" : "Start toaster",
        do: g => {
          if (!locations.kitchen.state.toastDone) {
            locations.kitchen.state.toastDone = true;
            g.lastFeedback = "Click. Toast cycle begins.";
          } else g.lastFeedback = "It's ready.";
        }
      },
      {
        label: g => hasItem(g,'Toast')? "Take toast (done)" : "Take toast",
        do: g => {
          if (locations.kitchen.state.toastDone && !hasItem(g,'Toast')) {
            addItem(g,'Toast');
            g.lastFeedback = "Warm and crunchy.";
          } else if (hasItem(g,'Toast')) {
            g.lastFeedback = "Already took the toast.";
          } else {
            g.lastFeedback = "Toast isn't ready yet.";
          }
        }
      },
      {
        label:("Take the glass marble"),
        do:g=>
        {
          addItem(g,'GlassMarble');
          g.lastFeedback = "You got the Glass Marble. But where do you want to use it? ";
        }
      }
      
    ]
  },

  diningroom: 
  {
    title: "Dining Room",
    text: "The table stands empty—except for a few plates from last night’s dinner, still unwashed.Bedroom key in on the table.",
    imgKey: "imgDiningroom",
    state: { tookTray:false, tookFlower:false, breakfastReady:false,takeKey:false },
    actions: [
      {
        label: g => hasItem(g,'Tray')? "Tray: in inventory" : "Take a tray",
        do: g => {
          if (!locations.diningroom.state.tookTray) {
            addItem(g,'Tray');
            locations.diningroom.state.tookTray = true;
            g.lastFeedback = "A portable table!";
          } else g.lastFeedback = "Already took the tray.";
        }
      },
      
      {
        label: g => locations.diningroom.state.breakfastReady ? "Breakfast staged ✅" : "Assemble breakfast on tray",
        do: g => {
          if (hasAll(g,['Tray','Coffee','Toast'])) {
            locations.diningroom.state.breakfastReady = true;
            g.lastFeedback = "You arrange coffee+toast" + ". A masterpiece.";
          } 
          else g.lastFeedback = "You need Tray, Coffee, and Toast.";
        }
      },
      {
        label: () => "Take the key",
        do: g => {
          if(!locations.diningroom.state.takeKey)
            {
            g.lastFeedback = "You got the key";
            addItem(g,'Key');
            locations.diningroom.state.takeKey = true;
            }
          else
            {
              g.lastFeedback = "You already have the key.";
            }
        }
      }
    ]
  },

  livingroom: 
  {
    title: "Living Room",
    text: "The TV is still on, broadcasting some human news you don’t understand.On the sofa lies your master’s neatly folded coat—the nice suit he picked out just for today’s big date. Beside it, a pair of matching shoes waits patiently.",
    imgKey: "imgLivingroom",
    state: { shoesbetake:false, },
    actions: [
      {
        label: g => locations.livingroom.state.shoesbetake?"No shoes any more":"Get the fancy shoes",
        do: g => {
          if(!locations.livingroom.state.shoesbetake)//not yet take the shoes
            {
              addItem(g,'Shoes');
              g.lastFeedback = "You got the shoes";
              locations.livingroom.state.shoesbetake = true;
            }
          else
          {
            g.lastFeedback = "No shoes in here any more";
          }
          
        }
      },
      {
        label: g => locations.diningroom.state.breakfastReady? "You already prepare breakfast" : "Prepare breakfast (need it ready)",
        do: g => {
          if (locations.diningroom.state.breakfastReady) 
          {
            g.lastFeedback = "You gently mrrrp and tap the tray.";
          } 
          else g.lastFeedback = "You need to assemble breakfast first.";
        }
      },
    ]
  },
  
  hallway:
  {
    title:"Hall Way",
    text:"This is the second-floor hallway.In the middle stands a small table, and on it rests your master’s diary—perhaps it holds some clues.",
    imgKey:"imgHallway",
    state:{},
    actions:[
      {
        label:"Look your master's journal",
        do:g => 
        {
          locations.hallway.imgKey = "imgJournal";
          g.lastFeedback = "Oh, maybe you know what's she favorite gift now. It's Lord of the Rings!!!"
        }
      }
    ]
    
    
    
    
  },
  
  bedroom:
  {
    title:"Bedroom",
    text:"This is your master’s bedroom.The door is locked tight—you can’t open it.Maybe you’ll need to find the key first… and then wake him up.",
    imgKey:"imgBedroom",
    state:{},
    actions:
  [
    
    {
      label:"Open the door",
      do:g => 
      {
        if(hasItem(g,"Key"))
          {
            if(locations.entrance.state.haveshoes&&locations.diningroom.state.breakfastReady&&locations.guestbedroom.state.takerightgift)//Perfect Ending
              {
                goEnding(g,'ending_perfect');
              }
            else if (locations.entrance.state.haveshoes||locations.diningroom.state.breakfastReady)
              {
                goEnding(g,'ending_misssomething');
              }
            else
              {
                goEnding(g,'ending_getup');
              }
          }  
        else g.lastFeedback = "You must get the key to open this door.";
      }
    }
  ]
  },
  
  guestbedroom:
  {
    title:"Guest BedRoom",
    text:"Your master has prepared several gifts for his dream girl.But with so many to choose from, which one is the right gift?",
    imgKey:"imgGuestbedroom",
    state:{havetakegift:false,takerightgift:false},
    actions:
    [
      {
        label: g => !locations.guestbedroom.state.havetakegift ? "A box of chocolates 🍫":"You have a gift",
        do:g => 
        {
          if(!locations.guestbedroom.state.havetakegift) 
            {
          g.lastFeedback = "You get the gift, hope is her favorite.";
          locations.guestbedroom.state.havetakegift =true;
          addItem(g,'Chocolates');
            }
           else g.lastFeedback ="You already have one."
        }
        
      },
      {
        label: g => !locations.guestbedroom.state.havetakegift?"A bouquet of roses 🌹":"You have a gift",
        do:g =>
        {
          if(!locations.guestbedroom.state.havetakegift) 
            {
          g.lastFeedback = "You get the gift, hope is her favorite.";
          locations.guestbedroom.state.havetakegift =true;
          addItem(g,'Roses');
            }
          else g.lastFeedback ="You already have one."
          
        }
      },
     {
       label: g => !locations.guestbedroom.state.havetakegift?"A signed 'Lord of the Rings' collector's edition 📖":"You have a gift",
       do:g=>
       {
         if(!locations.guestbedroom.state.havetakegift) 
            {
         g.lastFeedback = "You get the gift, hope is her favorite.";
         locations.guestbedroom.state.havetakegift =true;
        locations.guestbedroom.state.takerightgift = true;
         addItem(g,'Lord Of the Rings');
            }
         else g.lastFeedback = "You already have one."
       }
     } ,
    ]
  },
  
  stairs:
  {
    title:"Stairs",
    text:"These stairs lead up to the second floor.But careful—one wrong step and you might end up tumbling down like a clumsy dog!",
    imgKey:"imgStairs",
    state:{},
    actions:
    [
      {
          label:"Make a trick.:)",
        do:g => 
        {
          if(hasItem(g,"GlassMarble"))
          goEnding(g,'ending_trick');
          else g.lastFeedback = "Maybe you need to find something to do that."
        }
        
       
      }
  
    ]
  }
};

// ---------- Endings ----------
const endings = {
  ending_perfect: 
  {
    title: "Wonderful Day",
    text: "A hand descends. Head scritches granted. You win.",// Good Ending1
    imgKey: "imgPerfect"
  },
  ending_misssomething: 
  {
    title: "Not bad",
    text: "Your master look good. But maybe he forgot something so his girl friend just look a little sad about that.(Maybe there are something you need to notice.)’",// Good Ending2
    imgKey: "imgMisssomething"
  },
  ending_getup:
  {
    title: "Hi",
    text: "'Hi.' He finally gets to see his dream girl. But he looks terrible... maybe this is his first and last chance. Next time, can you make him look better?",//NormalEnding
    imgKey: "imgGetup"
  },
  ending_trick: 
  {
    title: "Trick",
    text: "You nudge a glass marble onto the stairs.One step. One slip. One scream.Your master tumbles down, his leg broken, his plans ruined.Now he can’t leave the house.He’ll stay here, in this room... with you. Forever.",//TrickEnding
    imgKey: "imgTrick"
  },
  ending_timeout:
  {
  title:"Time runs out",
  text:"The time runs out, maybe you master needs to find a another chance. Or maybe he just need you to company with him. Wait ,so that's your plan?",//Time out ending
  imgKey:"imgTimeout"
  }
}

// ---------- Setup ----------
function setup(){
  createCanvas(CANVAS_W, CANVAS_H);
  colorMode(HSB, 360, 100, 100);
  rectMode(CENTER);
  textAlign(LEFT, TOP);
  initGame();
}

function initGame(){
  game = {
    //Reset the game state
    state: "menu",
    loc: 'entrance',
    inventory: [],
    lastFeedback: "",
    ending: null,
    
    //Reset the time count down.
    timeMsTotal: TOTAL_TIME_SEC * 1000,
    timeMsLeft:  TOTAL_TIME_SEC * 1000,
    _lastUpdateMs: null,   
    timerPaused: false,
  };
  //Reset every locations state to false
    locations.entrance.state.haveshoes = false,locations.kitchen.state.tookMug=false,locations.kitchen.state.coffeeBrewed =false,locations.kitchen.state.toastDonw = false,locations.diningroom.state.tookTray = false,locations.diningroom.state.breakfastReady = false,locations.diningroom.state.takeKey = false,locations.livingroom.state.shoesbetake = false,locations.guestbedroom.state.havetakegift = false, locations.guestbedroom.state.takerightgift = false;
}

// ---------- Draw ----------
function draw(){
  if(game.state ==="menu")
    {
      drawFlowBackground();
      drawMenu();
      
    }
  else if(game.state ==="playing")
    {
    background("#F2F2F2");
    drawFlowBackground();
    drawHeader();
    drawMap();
    drawLocationPanel();
    drawChoices();
    drawInventory();
    updateTimer();
    drawTimer();
    }
  
  
}

// ---------- UI ----------
//Draw the Menu page
function drawMenu() {
  fill("#1b2a44");
  rectMode(CENTER);
  rect(width/2, height/2, 600, 360, 20);
  rect(width/2-600,height/2,400,300,20);

  fill("#F2F2F2");
  textAlign(CENTER, CENTER);
  textSize(25);
  text("Main Goal",width/2-600,height/2-100);
  textSize(18);
  text("Open the bedroom's door and wake your master up\n\n"+"You can explore all locations for making your master looks better , having a good breakfast and get the right gift for his dream girl. ",width/2-600, height/2,400);
  textSize(30);
  text("🐾 A Cat Who Makes Home Better", width/2, height/2 - 120);

  textSize(18);
  text("\n Today is a big day.Your master has finally asked his dream girl out on a date.\n" +
       "However...Knock, knock.\n" +
       "She’s already outside the door—and your master is still falling asleep!\n\n" +
       "It’s up to you, little cute handsome cat, to help him get ready before it’s too late!", width/2, height/2 - 20, 480, 200);

  // Start Button
  const btnX = width/2;
  const btnY = height/2 + 120;
  const btnW = 180;
  const btnH = 50;

  const hover = pointInRect(mouseX, mouseY, {x: btnX, y: btnY, w: btnW, h: btnH});
  stroke(hover ? "#8fb3ff" : "#F25050");
  strokeWeight(2);
  fill(hover ? "#F2CB05" : "#172134");
  rect(btnX, btnY, btnW, btnH, 12);
  noStroke();
  fill("#e7e9ee");
  textSize(20);
  text("Start Game", btnX, btnY);
}
//Header Bar (Current Location & Inventroy System & Timer)
function drawHeader(){
  noStroke();
  fill("#5D90EA");
  rect(width/2, 30, width - MARGIN*2, 50, 10);
  fill("#FFFFFF");
  textSize(TITLE_SIZE);
  textAlign(CENTER, CENTER);
  const title = game.ending ? endings[game.ending].title : locations[game.loc].title;
  text(title, 120, 30);
  
}
//Draw Map panel
function drawMap(){
  const x = MARGIN, y = 70, w = MAP_W, h = CANVAS_H - y - 90;
  //Outer Rect
  noStroke();
  fill("#1b2a44");
  rectMode(CORNER); 
  rect(x, y, w, h, 12);
  //The text
  fill("#F2CB05"); textSize(25); text("Map", x+50, y+25);

  // Make a list of map
  const nodes = [
    {key:'entrance', label:'Entrance'},
    {key:'kitchen', label:'Kitchen'},
    {key:'diningroom', label:'Dining Room'},
    {key:'livingroom', label:'Living Room'},
    {key:'hallway',label:'Hall Way'},
    {key:'bedroom',label:'BedRoom'},
    {key:'guestbedroom',label:'Guest BedRoom'},
    {key:'stairs',label:'Stairs'}
    
  ];
  let ny = y + 75;
  mapButtons = [];
  for (const n of nodes){
    const isHere = (game.loc===n.key);
    
    fill(isHere?"#FFC107":"#1b2538");
    rect(x+12, ny, w-24, 36, 10);
    fill("#e7e9ee"); textSize(16);textAlign(CENTER, CENTER); text(n.label, x+w/2, ny+18);
    mapButtons.push({key:n.key, x:x+12, y:ny, w:w-24, h:36});
    ny += 50;
  }
}
//Draw Central and Left Panel
function drawLocationPanel(){
  const panelX = MARGIN + MAP_W + 14;
  const panelY = 70;
  const panelW = width - panelX - MARGIN;
  const panelH = 500;
  noStroke(); fill("#1b2230"); rect(panelX, panelY, panelW, panelH, 12);

  const halfW = panelW/2; 
  const cx = panelX + halfW/2; 
  const cy = panelY + panelH/2;
  const sc = game.ending ? endings[game.ending] : locations[game.loc];
//Draw Image
  if (sc.imgKey && imgs[sc.imgKey]) 
  {
    drawImageContain(imgs[sc.imgKey], cx, panelY + panelH/2, halfW, panelH-14, 10);
  }

  const pad = 18; const tx = panelX + halfW + pad+300; const ty = panelY + pad+100; const tw = halfW - pad*2;
  fill("#e7e9ee"); textSize(TEXT_SIZE);
  text(wrapText(sc.text, tw, TEXT_SIZE), tx, ty);
  if (game.lastFeedback && !game.ending){
    fill("#cfe4ff"); textSize(18);
    text(wrapText(game.lastFeedback, tw, 18), tx, ty + 170);
  }
}
//Draw Choices Panel
function drawChoices(){
  choiceBoxes.length = 0;
  const listX = MARGIN + MAP_W + 14, listY =600,listW = width - listX - MARGIN, listH = 200;
  noStroke(); 
  fill("#172134"); rect(listX, listY, listW, listH, 12);

  let choices = [];
  if (game.ending){
    choices = [{ label:"Play Again", onClick:()=>{ if(sndWin && sndWin.isLoaded()) sndWin.play(); initGame(); } }];
  } else {
    const loc = locations[game.loc];
    for (const act of loc.actions)
    {
      const label = (typeof act.label==='function')? act.label(game) : act.label;
      choices.push({label, onClick:()=>doAction(act)});
    }
  }

  const total = choices.length, cols = Math.min(MAX_CHOICES_PER_ROW, total);
  const rows = Math.ceil(total/cols);
  const gridW = cols * CHOICE_W + (cols-1)*CHOICE_GAP;
  const startX = listX + (listW - gridW)/2 + CHOICE_W/2;
  const startY = listY + listH/2 - (rows * CHOICE_H + (rows-1)*CHOICE_GAP)/2 + CHOICE_H/2;

  let i=0; rectMode(CENTER);
  for (const c of choices){
    const col = i % cols, row = Math.floor(i/cols);
    const x = startX + col*(CHOICE_W + CHOICE_GAP);
    const y = startY + row*(CHOICE_H + CHOICE_GAP);
    const hover = pointInRect(mouseX, mouseY, {x, y, w:CHOICE_W, h:CHOICE_H});
    stroke(hover?"#F2CB05":"#2f3b52"); strokeWeight(2);
    fill(hover?"#F25050":"#172134"); rect(x,y,CHOICE_W,CHOICE_H,12);
    noStroke(); fill("#e7e9ee"); textSize(16); textAlign(CENTER, CENTER);
    text(c.label, x, y, CHOICE_W-28, CHOICE_H-10);
    choiceBoxes.push({x,y,w:CHOICE_W,h:CHOICE_H,onClick:c.onClick});
    i++;
  }
}

//Draw Inventory on the header bar
function drawInventory(){
  const invX = 300, invY = 25;
  noStroke(); //fill("#1b2230"); 
  fill("#b7c3d9"); textSize(14); text("Inventory:", invX, invY);
  let ix = invX + 110, gap = 10, pillH = 28;
  // Inventroy Item
 for (const it of game.inventory)
 {
    const tw = textWidth(it) + 24;
    fill("#e7e9ee"); textAlign(LEFT, CENTER); text(it, ix + 12, invY);
    ix += tw + gap;
  }
}

//Draw Timer on the header bar
function drawTimer()
{
  const pad = 25;
  const x = width - pad - TIMER_BAR_W;  
  const y = 30;                          
 // fill
  const p = game.timeMsLeft / game.timeMsTotal; // 0..1
  fill(p > 0.3 ? "#79d279" : (p > 0.1 ? "#ffd166" : "#ff6b6b"));
  rect(x, y, TIMER_BAR_W * p, TIMER_BAR_H, 8);

  // text MM:SS
  const secs = Math.ceil(game.timeMsLeft / 1000);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  fill("#e7e9ee");
  textSize(14);
  textAlign(CENTER, CENTER);
  text(`${mm}:${ss}`, x - 8, y);
  text('Count Down',x-200,y);
}

// ---------- Interaction ----------
function mousePressed(){
 //When on the menu page
  if (game.state === "menu") {

    const btnX = width/2, btnY = height/2 + 120, btnW = 180, btnH = 50;
    if (pointInRect(mouseX, mouseY, {x: btnX, y: btnY, w: btnW, h: btnH})) {
      game.state = "playing";   // 
      game.timeMsLeft = 60000;  // 
    }
    return;
  }
  
  
  // Map clicks
  for (const mb of mapButtons){
    if (mouseX > mb.x && mouseX < mb.x + mb.w && mouseY > mb.y && mouseY < mb.y + mb.h){
      game.loc = mb.key;
      game.lastFeedback = "";
      return;
    }
  }

  // Choices
  for (const b of choiceBoxes){
    if (pointInRect(mouseX, mouseY, b)){
      b.onClick?.();
      return;
    }
  }
}

// ---------- Logic ----------
function doAction(act)
{ 
  act.do?.(game); 
}

function addItem(g, item)
{ 
  if (!g.inventory.includes(item)) g.inventory.push(item); 
}
function hasItem(g, item){ return g.inventory.includes(item); }
function hasAll(g, arr){ return arr.every(it => hasItem(g,it)); }

function goEnding(g,key){ g.ending = key; if (sndWin && sndWin.isLoaded()) sndWin.play(); }

// ---------- Utilities ----------
function pointInRect(px, py, r){ return (px >= r.x - r.w/2 && px <= r.x + r.w/2 && py >= r.y - r.h/2 && py <= r.y + r.h/2); }
function wrapText(str, maxWidth, size){
  textSize(size); const words = String(str).split(/\s+/);
  let line = "", out = "";
  for (const w of words){ const test = line? line+" "+w : w;
    if (textWidth(test) > maxWidth){ out += line + "\n"; line = w; }
    else line = test; }
  return out + line;
}
function drawImageContain(img, cx, cy, w, h, radius=0){
  const iw = img.width, ih = img.height, scale = Math.min(w / iw, h / ih);
  const dw = iw * scale, dh = ih * scale;
  if (radius > 0){ push(); drawingContext.save(); drawingContext.beginPath();
    roundedRectPath(drawingContext, cx - w/2, cy - h/2, w, h, radius);
    drawingContext.clip(); imageMode(CENTER); image(img, cx, cy, dw, dh);
    drawingContext.restore(); pop(); }
  else { imageMode(CENTER); image(img, cx, cy, dw, dh); }
}
function roundedRectPath(ctx,x,y,w,h,r){
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function updateTimer(){
  // Pause if in an ending or explicitly paused
  if (game.ending || game.timerPaused) { game._lastUpdateMs = millis(); return; }

  const now = millis();
  if (game._lastUpdateMs == null) { game._lastUpdateMs = now; return; }

  const dt = now - game._lastUpdateMs; // ms since last frame
  game._lastUpdateMs = now;

  game.timeMsLeft = Math.max(0, game.timeMsLeft - dt);

  if (game.timeMsLeft === 0 && !game.ending) {
    goEnding(game, 'ending_timeout');
  }
}
function drawFlowBackground(){
  background("rgb(255,255,255)")  
  let gapX = width / cols;
  let gapY = height / rows;
  const t = millis() * 0.002; 

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
       let x = (i + 0.5) * gapX;
       let y = (j + 0.5) * gapY;
       let hue = (i * 30 + j * 15 + t * 80) % 360;
       let pulse = 0.85 + 0.15 * sin(t + i * 0.6 + j * 0.8);
       let r = min(gapX, gapY) * 0.45 * pulse;

      fill(hue, 70, 95);
      rect(x-20, y-20, r * 2);
    }
  }
}
