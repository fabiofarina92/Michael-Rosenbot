class Queue {
    songQueue: string[];
    volume: number;
    index: number;
    connection: null;

    constructor(connection){}

    add(song) {
        this.songQueue.push(song);
    }

    remove() {        
        this.songQueue.splice(this.index, 1);
        if(this.songQueue.length < this.index) {
            this.index = 0; // End of playlist
        } else {
            this.index++;
        }
    }

    

}