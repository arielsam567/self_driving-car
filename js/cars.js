class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=3;
        this.friction=0.05;
        this.angle=0;
        this.angleSpeed=0.03;

        this.sensor= new Sensor(this);
        this.controls= new Controls();
    }

    update(roadBorders){
        this.#controlsSpeedVertical();
        this.#controlsSpeedHorizontal();
        this.#move();
        this.polygon=this.#createPolygon();
        this.sensor.update(roadBorders);
    }

    #controlsSpeedHorizontal(){

        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=this.angleSpeed*flip;
            }
            if(this.controls.right){
                this.angle-=this.angleSpeed*flip;
            }
        }
    }

    #controlsSpeedVertical(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }
    }

    #move(){
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.height, this.width);
        points.push({
            x:this.x-Math.cos(this.angle-alpha)*rad,
            y:this.y-Math.sin(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.cos(this.angle+alpha)*rad,
            y:this.y-Math.sin(this.angle+alpha)*rad
        });

        points.push({
            x:this.x-Math.cos(Math.Pi + this.angle-alpha)*rad,
            y:this.y-Math.sin(Math.Pi + this.angle-alpha)*rad
        });

        points.push({
            x:this.x-Math.cos(Math.Pi + this.angle+alpha)*rad,
            y:this.y-Math.sin(Math.Pi + this.angle+alpha)*rad
        });

        return points;

    }

    draw(ctx){
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fillStyle="black";
        ctx.fill();
        this.sensor.draw(ctx);
    }
}