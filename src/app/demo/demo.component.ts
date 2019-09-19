import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  display;
  floor: number;
  floors = [0, 1, 2, 3, 4]
  onFloor;
  upStack = [];
  downStack = [];
  moving = false;
  up = false;
  down = false;
  openDoors = false;
  closeDoors = false;



  constructor() { }

  ngOnInit() {
    this.onFloor = [false, false, true, false, false]
    this.displayFloor(2);
  }

  displayFloor(floor: number) {
    if (floor == 0) {
      this.display = 'B';
    }
    else if (floor == 1) {
      this.display = 'G'
    }
    else {
      this.display = floor - 1;
    }
  }

  getDisplay() {
    if (this.display == 'B') {
      return 0;
    }
    if (this.display == 'G') {
      return 1
    }
    return this.display + 1;
  }

  changeFloor(floor: number) {
    // console.log('in change floor')
    this.floor = this.getDisplay();
    if (floor > this.floor) {
      this.up = true;
      this.upStack.push(floor);
      this.upStack.sort();
      this.upStack.reverse();
    }
    else if (floor < this.floor) {
      this.down = true;
      this.downStack.push(floor);
      this.downStack.sort();
    }
    if (this.downStack.length > 0 || this.upStack.length > 0) {
      this.moving = true;
      this.closeDoors = true;
      this.wait(1000).then(() => {
        this.closeDoors = false;
        // console.log('start start move')
        this.startMove();
      });
    }
  }

  async wait(ms) {
    await new Promise(resolve => {
      setTimeout(() => resolve(), ms);
    });
  }

  async doors() {
    await new Promise(resolve => {
      this.openDoors = true;
      this.wait(4000).then(() => {
        this.openDoors = false;
        this.closeDoors = true;
        this.wait(2000).then(() => {
          this.closeDoors = false;
          resolve();
        })
      })
    });
  }

  async doorClose() {
    await new Promise(resolve => {
      this.closeDoors = true;
      this.wait(2000).then(() => {
        this.closeDoors = false
        resolve();
      });
    })
  }

  upPop;
  downPop;

  startMove() {
    this.onFloor[this.getDisplay()] = false;
    let upStart = this.getDisplay();
    let downStart = this.getDisplay();
    if (this.upStack.length > 0) {
      // console.log('in up if')
      this.floors.sort();

      this.wait(2000).then(async () => {
        // console.log('in up wait')
        for (let num of this.floors) {
          if (this.upStack[this.upStack.length - 1] == num + 1){
            this.moving = false;
          }
          if (num >= upStart && num < 4) {
            if (this.upStack[this.upStack.length - 1] == num) {
              this.upPop = this.upStack.pop();
              
              if (this.upStack.length > 0){
                await this.doors();
                this.onFloor[num] = false;
                this.moving = true;
              }
            }
            if (num  < this.upStack[0]) {
              this.displayFloor(num + 1);              
              await this.wait(2000);  
            }

          }
        }
        this.up = false;
        this.upStack = [];
        await this.doors();
        // console.log('end up wait')
        return;
      });
      // console.log('out up if')
    }
    if (this.downStack.length > 0) {
      // console.log('in down if')
      this.floors.sort();
      this.floors.reverse();
      this.wait(2000).then(async () => {
        // console.log('in down wait')
        for (let num of this.floors) {
          if (this.downStack[this.downStack.length - 1] == num - 1){
            this.moving = false;
          }
          if (num <= downStart && num > -1) {
            if (this.downStack[this.downStack.length - 1] == num) {
              this.downPop = this.downStack.pop();
              if (this.downStack.length > 0){
                await this.doors();
                this.onFloor[num] = false;
                this.moving = true;
              }
            }
            if (num > this.downStack[0]) {
              this.displayFloor(num - 1);
              await this.wait(2000);
            }
          }
        }
        this.down = false;
        this.downStack = [];
        await this.doors();
        // console.log('end down wait')
        return;
      });
      // console.log('out down if')
    }
    // console.log('out start')
  }


  //   startMove() {
  //     setTimeout(() => {

  //       if (this.upStack.length > 0) {
  //         this.floors.sort();
  //         // console.log('upstack: ', this.upStack, 'upStack length: ', this.upStack.length, ' floors: ', this.floors);

  //         setTimeout(async () => {
  //           for (let num of this.floors) {
  //             if (num == this.getDisplay() && num != 4) {
  //               this.upPop = this.upStack.pop()
  //               // console.log('in up timeout upPop: ', this.upPop);
  //               // console.log('num: ', num);
  //               this.displayFloor(num + 1)
  //               await this.doors('up')           
  //             }
  //           }
  //         }, 2000);

  //       }
  //       else if (this.downStack.length > 0) {
  //         this.floors.sort();
  //         this.floors.reverse();
  //         // console.log('downstack: ', this.downStack, 'downStack length: ', this.downStack.length, ' floors: ', this.floors);
  //         for (let num of this.floors) {
  //             if (num == this.getDisplay()){
  //             setTimeout(() => {
  //               this.downPop = this.downStack.pop()
  //               // console.log('in down timeout downPop: ', this.downPop);
  //               // console.log('num: ', num);
  //               // this.displayFloor(num);
  //             }, 2000);
  //           }
  //         }
  //       }
  //       if (this.upStack.length != 0 || this.downStack.length != 0) {
  //         // console.log('recursive return')
  //         return this.startMove();
  //       }
  //       if (this.upStack.length == 0 && this.downStack.length == 0) {
  //         this.moving = false;
  //         this.up = false;
  //         this.down = false;
  //         // console.log('out return?');
  //         return;
  //       }

  //     }, 2000);
  //     // console.log('out?');
  //   }

}