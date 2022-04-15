
const enemy1Arr = [
  'enemy1.png',
  'enemy1_down1.png',
  'enemy1_down2.png',
  'enemy1_down3.png',
  'enemy1_down4.png',
]
// 敌机2
const enemy2Arr = [
  'enemy2.png',
  'enemy2_down1.png',
  'enemy2_down2.png',
  'enemy2_down3.png',
  'enemy2_down4.png',
]
// 敌机3
const enemy3Arr = [
  'enemy3_n1.png',
  'enemy3_n2.png',
  'enemy3_hit.png',
  'enemy3_down1.png',
  'enemy3_down2.png',
  'enemy3_down3.png',
  'enemy3_down4.png',
  'enemy3_down5.png',
  'enemy3_down6.png',
]
// 游戏loading图
const loadingArr = [
  'game_loading1.png',
  'game_loading2.png',
  'game_loading3.png',
  'game_loading4.png',
]
// 玩家飞机图
const heroArr = [
  'hero1.png',
  'hero2.png',
  'hero_blowup_n1.png',
  'hero_blowup_n2.png',
  'hero_blowup_n3.png',
  'hero_blowup_n4.png',
]
const hulletImg = 'm1.png'
enum StateEnum {
  READY,
  PLAY,
  PAUSE,
  OVER,
}

interface planeIf {
  x: number
  y: number
  index: number
  life: number
  width: number
  height: number
}

interface heroIf extends planeIf {
  count: number
  hCount: number
  eCount: number
  n: number
  draw: (ctx: any, changeState: (arg0: StateEnum) => void,  hullets: hulletIf[], score: number, liveEnemy: enemyIf[]) => void
  hit: (liveEnemy: enemyIf[]) => void
  
}

interface enemyIf extends planeIf {
  speed: Number
  n: number
  enemy: null | {}
  removable: boolean
  die: boolean
  draw: (ctx: any, canvasHeight: number, canvasWidth: number,hullets: hulletIf[],gameScore:number ,changeScore:  (arg0: number) => void) => void
  hit: (ullets: hulletIf[],gameScore:number ,changeScore:  (arg0: number) => void) => void
}

interface hulletIf {
  n: number
  mx: number
  my: number
  width: number
  height: number
  removable: boolean
  draw: (ctx: any) => void
}
 class Hero implements heroIf {
  x: number
  y: number
  index: number
  count: number
  hCount: number
  eCount: number
  n: number
  life: number
  width: number
  height: number
  constructor(width: number, height: number) {
    // this.x = (width - heroImg[0].width) / 2 // hero的坐标
    // this.y = height - heroImg[0].height
    this.x = (width - 100) / 2 // hero的坐标
    this.y = height - 200
    this.index = 0 // 用于切换hero的图片
    this.count = 0 // 用于控制hero图片切换的频率
    this.hCount = 0 // 用于控制子弹发射的频率
    this.eCount = 0 // 用于控制敌机出现的频率
    this.n = 0
    this.life = 0
    this.width = 0
    this.height = 0
    uni.getImageInfo({
      src: `/static/img/${heroArr[this.index]}`,
      success: (res)=>{
        this.width = res.width;  // 子弹的宽和高
        this.height = res.height;
        this.x =(width - res.width) / 2 // hero的坐标
        this.y = height - res.height
      }
    })
  }

  draw(ctx: any, changePhase: (arg0: StateEnum) => void, hullets: hulletIf[], score: number, liveEnemy: enemyIf[]) {
    this.count++
    this.hit(liveEnemy)
    if (this.index > 4) {
      changePhase(StateEnum.OVER)
      this.index = 5
    }
    if (this.count % 3 == 0 && this.index <= 1) {
      // 切换hero的图片
      this.index = this.index == 0 ? 1 : 0
      this.count = 0
    }
    
    ctx.drawImage(`/static/img/${heroArr[this.index]}`, this.x, this.y)
    ctx.draw(true)

    

    this.hCount++
    if (this.hCount % 3 == 0) {
      // 同时生成三颗子弹
      this.n == 32 && (this.n = 0)
      hullets.push(new Hullet(this.n, this.x, this.y, this.width))
      this.n == 0 && (this.n = -32)
      hullets.push(new Hullet(this.n, this.x, this.y, this.width))
      this.n == -32 && (this.n = 32)
      hullets.push(new Hullet(this.n, this.x, this.y, this.width))
      this.hCount = 0
    }
    this.eCount++
    if (this.eCount % 8 == 0) {
      //生成敌机
      liveEnemy.push(new Enemy())
      this.eCount = 0
    }
  }
  hit(liveEnemy: enemyIf[]) {
    // 判断是自己是否被击中
    for (var i = 0; i < liveEnemy.length; i++) {
      var d = liveEnemy[i]
      // 敌机与自己的碰撞检测
      var px, py
      px = this.x <= d.x ? d.x : this.x
      py = this.y <= d.y ? d.y : this.y
      // 判断点
      if (
        px >= this.x &&
        px <= this.x + this.width &&
        py >= this.y &&
        py <= this.y + this.height &&
        px >= d.x &&
        px <= d.x + d.width &&
        py >= d.y &&
        py <= d.y + d.height
      ) {
        this.life++
        if (this.life > 30) {
          if (this.index <= 2) {
            this.index = 3
          }
          this.index++
          this.life = 0
        }
      }
    }
  }
 
}

class Enemy implements enemyIf {
  x: number
  y: number
  index: number
  speed: number
  width: number
  height: number
  n: number
  life: number
  enemy: null | string
  removable: boolean
  die: boolean
  constructor() {
    this.n = Math.random() * 20
    this.enemy = null // 保存敌机图片的数组
    this.speed = 0 // 敌机的速度
    this.life = 2 // 敌机的生命值
    if (this.n < 1) {
      // 不同大小的敌机随机出现
      this.enemy = enemy3Arr[0]
      this.speed = 2
      this.life = 50
    } else if (this.n < 6) {
      this.enemy = enemy2Arr[0]
      this.speed = 4
      this.life = 10
    } else {
      this.enemy = enemy1Arr[0]
      this.speed = 6
    }
  
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.index = 0
    this.removable = false
    // 标识敌机是否狗带，若狗带就画它的爆炸图(也就是遗像啦)
    this.die = false
  }
  draw(ctx: any, canvasHeight: number, canvasWidth: number, hullets: hulletIf[],gameScore:number ,changeScore:  (arg0: number) => void) {
    // 处理不同敌机的爆炸图轮番上阵
    if (this.speed == 2) {
      if (this.die) {
        if (this.index < 2) {
          this.index = 3
        }
        if (this.index < enemy3Arr.length) {
          this.enemy = enemy3Arr[this.index++]
        } else {
          this.removable = true
        }
      } else {
        this.enemy = enemy3Arr[this.index]
        this.index == 0 ? (this.index = 1) : (this.index = 0)
      }
    } else if (this.die) {
      if (this.index < enemy1Arr.length) {
        if (this.speed == 6) {
          this.enemy = enemy1Arr[this.index++]
        } else {
          this.enemy = enemy2Arr[this.index++]
        }
      } else {
        this.removable = true
      }
    }
    let that = this
    uni.getImageInfo({
      src: `/static/img/${this.enemy}`,
      success: function (image) {
        that.x = that.x ===0 ? (Math.random() * (canvasWidth - image.width)) : that.x 
        that.y = that.y ===0 ? -image.height : that.y
        that.width = image.width
        that.height = image.height
        ctx.drawImage(`/static/img/${that.enemy}`, that.x, that.y)
        ctx.draw(true)
        that.y += that.speed // 移动敌机
        that.hit(hullets, gameScore ,changeScore) //判断是否击中敌机
        if (that.y > canvasHeight) {
          // 若敌机飞出画布，就标识可移除
          that.removable = true
        }
      }
    })
   
  }
  hit(hullets: hulletIf[],gameScore:number ,changeScore:  (arg0: number) => void) {
    //判断是否击中敌机
    for (var i = 0; i < hullets.length; i++) {
      var h = hullets[i]
      // 敌机与子弹的碰撞检测，自己体会吧
      if (
        this.x + this.width >= h.mx &&
        h.mx + h.width >= this.x &&
        h.my + h.height >= this.y &&
        this.height + this.y >= h.my
      ) {
        if (--this.life == 0) {
          // 若生命值为零，标识为死亡
          this.die = true
          // 计分
          gameScore += this.speed == 6 ? 10 : this.speed == 4 ? 20 : 100
          changeScore(gameScore)
        }
        h.removable = true // 碰撞后的子弹标识为可移除
      }
    }
  }
}

class Hullet implements hulletIf {
  n: number
  mx: number
  my: number
  width: number
  height: number
  removable: boolean
  constructor(n: number, heroX: number, heroY: number, heroWidth: number) {
    this.n = n;  // 用于确定是左中右哪一颗子弹
    this.mx =0;
    this.my = 0;
    this.width = 0;
    this.height = 0;
    this.removable = false; // 标识子弹是否可移除了
    uni.getImageInfo({
      src: `/static/img/${hulletImg}`,
      success: (res)=>{
        this.width = res.width;  // 子弹的宽和高
        this.height = res.height;
        this.mx = heroX + (heroWidth - res.width) / 2 + this.n; 
        this.my = this.n == 0 ?heroY - res.height : heroY + res.height;
      }
    })
  }
  draw(ctx:any) {
    ctx.drawImage(`/static/img/${hulletImg}`, this.mx, this.my);
    ctx.draw(true);
    this.my -= 20;
    this.mx += this.n == 32 ? 3 : this.n == -32 ? -3 : 0;
    if (this.my < -this.height) {  // 如果子弹飞出画布，就标记为可移除
        this.removable = true;
    }; 
  }
  static drawHullet( ctx: any,hullets:hulletIf[]) {
    for (var i = 0; i < hullets.length; i++) { //在画布上画出所以子弹
      hullets[i].draw(ctx);
      if (hullets[i].removable) { // 如果为true就移除这颗子弹
          hullets.splice(i, 1);
      }
    }
  }
}

export{
  Hero,
  Enemy,
  enemyIf,
  heroIf,
  Hullet,
  hulletIf,
  StateEnum
}