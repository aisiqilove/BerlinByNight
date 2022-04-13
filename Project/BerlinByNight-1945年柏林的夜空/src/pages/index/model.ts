
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
enum StateEnum {
  DOWNLOAD,
  READY,
  LOADING,
  PLAY,
  PAUSE,
  OVER,
}

interface planeIf {
  x: number
  y: number
  index: number
  life: number
}

interface heroIf extends planeIf {
  count: number
  hCount: number
  eCount: number
  n: number
  draw: (ctx: any, changeState: (arg0: StateEnum) => void) => void
  hit: () => void
  move: () => void
}

interface enemyIf extends planeIf {
  speed: number
  width: number
  height: number
  n: number
  enemy: null | {}
  removable: boolean
  die: boolean
  draw: (ctx: any, canvasHeight: number) => void
  hit: (hullet: {mx:number, my:number, width: number, height:number, removable: boolean}[],gameScore:number ,changeScore:  (arg0: number) => void) => void
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
  constructor(width: number, height: number) {
    // this.x = (width - heroImg[0].width) / 2 // hero的坐标
    // this.y = height - heroImg[0].height
    this.x = (width - 100) / 2 // hero的坐标
    this.y = height - 200
    this.index = 1 // 用于切换hero的图片
    this.count = 0 // 用于控制hero图片切换的频率
    this.hCount = 0 // 用于控制子弹发射的频率
    this.eCount = 0 // 用于控制敌机出现的频率
    this.n = 0
    this.life = 0
  }

  draw(ctx: any, changePhase: (arg0: StateEnum) => void) {
    this.count++
    this.hit()
    if (this.index > 4) {
      // curState = StateEnum.OVER
      changePhase(StateEnum.OVER)
      this.index = 5
    }
    if (this.count % 3 == 0 && this.index <= 1) {
      // 切换hero的图片
      this.index = this.index == 2 ? 1 : 2
      this.count = 0
    }
    let that = this
    uni.downloadFile({
      url: `/static/img/hero${this.index}.png`,
      success: function (res) {
        console.log('that.x, that.y ==', that.x, that.y)

        ctx.drawImage(res.tempFilePath, that.x, that.y)
        ctx.fillText('SCORE:' + 200, 10, 30)
        ctx.draw(true)
      },
    })

    this.hCount++
    if (this.hCount % 3 == 0) {
      // 同时生成三颗子弹
      // this.n == 32 && (this.n = 0)
      // hullet.push(new Hullet(this.n))
      // this.n == 0 && (this.n = -32)
      // hullet.push(new Hullet(this.n))
      // this.n == -32 && (this.n = 32)
      // hullet.push(new Hullet(this.n))
      // this.hCount = 0
    }
    this.eCount++
    if (this.eCount % 8 == 0) {
      //生成敌机
      // liveEnemy.push(new Enemy())
      // this.eCount = 0
    }
  }
  hit() {
    //判断是自己是否被击中
    // for (var i = 0; i < liveEnemy.length; i++) {
    //   var d = liveEnemy[i]
    //   // 敌机与自己的碰撞检测
    //   var px, py
    //   px = this.x <= d.x ? d.x : this.x
    //   py = this.y <= d.y ? d.y : this.y
    //   // 判断点
    //   if (
    //     px >= this.x &&
    //     px <= this.x + heroImg[0].width &&
    //     py >= this.y &&
    //     py <= this.y + heroImg[0].height &&
    //     px >= d.x &&
    //     px <= d.x + d.width &&
    //     py >= d.y &&
    //     py <= d.y + d.height
    //   ) {
    //     this.life++
    //     if (this.life > 30) {
    //       if (this.index <= 2) {
    //         this.index = 3
    //       }
    //       this.index++
    //       this.life = 0
    //     }
    //   }
    // }
  }

  move() {
    // if (curPhase == PHASE_PLAY || curPhase == PHASE_PAUSE) {
    //   curPhase = PHASE_PLAY
    //   var offsetX = e.offsetX || e.touches[0].pageX
    //   var offsetY = e.offsetY || e.touches[0].pageY
    //   var w = heroImg[0].width,
    //     h = heroImg[0].height
    //   var nx = offsetX - w / 2,
    //     ny = offsetY - h / 2
    //   nx < 20 - w / 2
    //     ? (nx = 20 - w / 2)
    //     : nx > canvas.width - w / 2 - 20
    //     ? (nx = canvas.width - w / 2 - 20)
    //     : 0
    //   ny < 0
    //     ? (ny = 0)
    //     : ny > canvas.height - h / 2
    //     ? (ny = canvas.height - h / 2)
    //     : 0
    //   hero.x = nx
    //   hero.y = ny
    //   hero.count = 2
    // }
  }
  // // 绑定鼠标移动和手指触摸事件，控制hero移动
  // canvas.addEventListener('mousemove', move, false)
  // canvas.addEventListener('touchmove', move, false)
  // // 鼠标移除时游戏暂停
  // canvas.onmouseout = function (e) {
  //   if (curPhase == PHASE_PLAY) {
  //     curPhase = PHASE_PAUSE
  //   }
  // }
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
  constructor(ctx: any, width: number) {
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
    this.x = Math.random() * (width - 100)
    // uni.downloadFile({
    //   url: `/static/img/${this.enemy}.png`,
    //   success: function (res) {
    //     console.log('res ==', res)
        // uni.getImageInfo({
        //   src: `/static/img/${this.enemy}`,
        //   success: function (image) {
        //     console.log('image ===', image)
        //   }
        // })
        // ctx.drawImage(res.tempFilePath, that.x, that.y)
        // ctx.fillText('SCORE:' + 200, 10, 30)
        // ctx.draw(true)
      // },
    // })
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.index = 0
    this.removable = false
    // 标识敌机是否狗带，若狗带就画它的爆炸图(也就是遗像啦)
    this.die = false
  }
  draw(ctx: any, canvasHeight: number) {
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
        console.log('image ===', image)
        that.x = (Math.random() * (that.width - image.width))
        that.y = -image.height
        that.width = image.width
        that.height = image.height
        console.log('that.x, that.y ==', that.x, that.y)
        ctx.drawImage(`/static/img/${that.enemy}`, that.x, that.y)
        ctx.draw(true)
        that.y += that.speed // 移动敌机
        // this.hit() //判断是否击中敌机
        if (that.y > canvasHeight) {
          // 若敌机飞出画布，就标识可移除
          that.removable = true
        }
      }
    })
   
  }
  hit(hullet: {mx:number, my:number, width: number, height:number, removable: boolean}[],gameScore:number ,changeScore:  (arg0: number) => void) {
    //判断是否击中敌机
    for (var i = 0; i < hullet.length; i++) {
      var h = hullet[i]
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

export{
  Hero,
  Enemy,
  enemyIf,
  heroIf
}