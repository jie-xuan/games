var bird ={
    step:2,
    skypositionX:0,
    birdTop:220,
    startColor:'blue',
    startFalg: false,
    dropStepY:0,
    minTop:0,
    maxTop:570,
    pipeLength:7,
    pipeArr:[],
    lastpipeindex:6,
    score:0,
    

   

     setScore:function(){
            this.scoreArr.push({
                score :this.score,
                time :this.gettime()
            });
                this.scoreArr.sort(function(a,b){ return b.score - a.score});
         setLocal('score',this.scoreArr);

     },

     getScoreArr:function(){

        //localStorage.clear();清除缓存
        //localStorage.remove('score') 移除指定内容

        var scoreArr = getLocal('score');
       
       
        return scoreArr ? scoreArr : [];
    },

     gettime:function(){
        var date = new Date();
        var year = date.getFullYear();
        
        var month = formatNumber(date.getMonth()+1);
        var d = formatNumber(date.getDate());
        var hours = formatNumber(date.getHours());
        var minute = formatNumber(date.getMinutes());
        var second = formatNumber(date.getSeconds());

        return `${year}.${month}.${d}.${hours}:${minute}:${second}`;
     },

   
      

    init:function(){
        this.initDate();
        this.animate();
        this.handle();
        if(sessionStorage.getItem('play')){
            this.start();
              
        }
    },

    initDate:function(){
        this.el = document.getElementsByClassName('game')[0];
        this.oBird = this.el.getElementsByClassName('bird')[0];
        this.oStart= this.el.getElementsByClassName('start')[0];
        this.oScore=this.el.getElementsByClassName('score')[0];
        this.oMask = this.el.getElementsByClassName('mask')[0];
        this.oEnd =this.el.getElementsByClassName('end')[0];
        this.ofinalScore = this.el.getElementsByClassName('final-score')[0];
        this.rank = this.el.getElementsByClassName('ranking')[0];
        
        this.oreStart =this.el.getElementsByClassName('restart')[0];
        this.scoreArr =this.getScoreArr();

       

    },

    animate:function(){

        var self = this;
        var count = 0;
     this.timer = setInterval(function(){

            self.move();
          if(self.startFalg){
            self.birdDrop();
            self.movePipe();
           }
            
            if(++ count % 10 === 0){

                if(!self.startFalg){
                    self.birdJump();
                    self.startbound();
                   
                }
              
                self.birdfly(count);
                
            }
            },30)
       
      },

    move:function(){
       
            this.skypositionX -= this.step;
            this.el.style.backgroundPositionX = this.skypositionX +"px";
                  },

    birdJump:function(){
    
            this.birdTop = this.birdTop === 220 ? 260:220;
            this.oBird.style.top = this.birdTop + 'px';  
                     },
     startbound:function(){
         var prevstart = this.startColor;   
         this.startColor = this.startColor==='blue' ? 'white':'blue';
         this.oStart.classList.remove('start-'+ prevstart);
         this.oStart.classList.add('start-'+ this.startColor); 

     } ,
     
     birdfly:function(count){

        this.oBird.style.backgroundPositionX = count % 3 *-30 +'px';

     },
     handle:function(){
         this.handleStart();
         this.handleClick();
         this.handlereStart();
       
     },
     handlereStart:function(){
        this.oreStart.onclick= function(){
          
            sessionStorage.setItem('play',true);
            window.location.reload();
           
                 
        }
 },

     handleStart:function(){
        

         this.oStart.onclick = this.start.bind(this);
           
     },

     start:function(){

        var self = this;

        self.startFalg = true;
        self.oBird.style.left = '80px';
        self.oBird.style.transition = 'none';
        self.oStart.style.display = 'none';
        self.oScore.style.display = 'block';
        self.step = 5;

        for(var i=0; i<self.pipeLength;i++){
            var x = 300*(i+1);

        self.createPipe(x);}
       
     },


     handleClick:function(){
            var self =this;
            this.el.onclick = function(e){
              if(!e.target.classList.contains('start')){

                        self.dropStepY = -10;
                 

              }
            }
     },

        createPipe:function(x){
          
            var upHeight =50 + Math.floor(Math.random()*175);
            var downHeight = 600 - 150 - upHeight;

             
            var upPipe =createEle('div',['pipe','pipe-up'],
            { height:upHeight+'px',
               left:x +'px' });
            var downPipe =createEle('div',['pipe','pipe-bottom'],
            {height:downHeight +'px',
               left:x +'px'});
            
           this.el.appendChild(upPipe);
           this.el.appendChild(downPipe);
           this.pipeArr.push({updom:upPipe,downdom:downPipe,y:[upHeight,upHeight + 150]});

        },

        movePipe:function(){
                for(var i=0;i<this.pipeLength;i++){
                    var upOpipe =this.pipeArr[i].updom;
                    var downOpipe = this.pipeArr[i].downdom;
                    var x = upOpipe.offsetLeft - this.step;

                    if(x< -52){
                        var lastpipe = this.pipeArr[this.lastpipeindex].updom.offsetLeft;
                        upOpipe.style.left = lastpipe + 300 +'px';
                        downOpipe.style.left = lastpipe +300 + 'px';
                        this.lastpipeindex = ++this.lastpipeindex % this.pipeLength;
                        
                        upOpipe.style.height = this.getPipeHeight().up + 'px';
                        downOpipe.style.height =this.getPipeHeight().down +'px';

                       


                        continue;
                    }
                    upOpipe.style.left = x +'px';
                    downOpipe.style.left = x +'px';
                    
                }


        },


        getPipeHeight:function(){
             var upHeight = 50 + Math.floor(Math.random()*175);
             var downHeight = 600 - 150 - upHeight;


             return { up:upHeight, down:downHeight}
            
        },

     birdDrop:function(){

        this.birdTop += ++this.dropStepY;
        
        this.oBird.style.top = this.birdTop + 'px';
       

        //碰撞检测
        this.judgeKnock();


     },

     judgeKnock:function(){
         this.judgeBoundary();
         this.judgePipe();
         this.addScore();

     },
     
     judgeBoundary:function(){

        if (this.birdTop < this.minTop || this.birdTop > this.maxTop){
            
             this.failGame();
        }



     },

    
     judgePipe:function(){

        var index = this.score % this.pipeLength;
        var birdY = this.birdTop;
        var pipeX = this.pipeArr[index].updom.offsetLeft;
        var pipeY = this.pipeArr[index].y;
         

         if((pipeX <=95 && pipeX >=13)&& (birdY <= pipeY[0] || pipeY[1]<= birdY )){
            
             this.failGame();

         }

     },

     addScore:function(){
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].updom.offsetLeft;

        if(pipeX<13){
           this.oScore.innerText = ++this.score;
        }

     },

   

     failGame:function(){
        clearInterval(this.timer);
        this.setScore();
        
        this.oMask.style.display = 'block';
        this.oEnd.style.display ='block';
        this.oScore.style.display ='none';
        this.oBird.style.display = 'none';
        this.ofinalScore.innerText = this.score;
        this.rendering();


     },


rendering:function(){
    var template ='';
   
    for(var i=0 ;i < 8; i++){
        var degreeClass='';
        switch(i){
            case 0: degreeClass = 'first' ;break;

            case 1: degreeClass = 'second'; break;
            case 2: degreeClass = 'third';  break;
        }

      

        template += `<li>
        
        <span class="rank-degree ${degreeClass}">${i +1}</span>
        <span class="rank-score">${this.scoreArr[i].score}</span>
        <span class="time">${this.scoreArr[i].time}</span>
    </li>`;

  
     this.rank.innerHTML = template;
    }

},

}