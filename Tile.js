class Tile{
    constructor(obj, pos) {
        this.obj = obj;
        this.position = pos;

        //can only play on black tiles
        if( (this.position[0] + this.position[1])%2 ){
            this.available = true;
        }
        else{
            this.available = false;
        }
    };
    
};