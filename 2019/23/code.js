const comp = require('../computer');
const ShipComputer = comp.getShipComputer();
const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const dataSplit = data.split(',');
const input = dataSplit.map(line => parseInt(line, 10));

class Network{
    constructor(size, program){
        this.computers = [];
        for(let i = 0; i < size; i++){
            let shipComputer = new ShipComputer(program);
            shipComputer.addInputs([i, -1]);
            shipComputer.run(true);
            this.computers.push(shipComputer);
        }
        // queue of packets [dest, X, Y]
        this.queue = [];
        this.nat = new NAT();
    }

    isIdle(){
        return this.queue.length === 0 && this.computers.filter(computer => computer.outputs.length > 0).length === 0;
    }

    run(){
        let finished = false;
        while(!finished) {
            for (let [id, comp] of this.computers.entries()) {
                if (this.queue.length > 0) {
                    let packets = this.queue.filter(packet => packet[0] === id).map(packet => [packet[1], packet[2]]);
                    if(packets.length > 0){
                        for(let packet of packets){
                            comp.addInputs(packet);
                        }
                    } else {
                        comp.addInputs([-1])
                    }
                    comp.run(true);
                }
                this.queue = this.queue.filter(packet => packet[0] !== id);

                if (comp.outputs.length > 0) {
                    for (let i = 0; i < comp.outputs.length; i += 3) {
                        this.queue.push([comp.outputs[i], comp.outputs[i + 1], comp.outputs[i + 2]])
                    }
                    comp.clearOutputs();
                }

            }
            let packets255 = this.queue.filter(packet => packet[0] === 255);
            if(packets255.length > 0){
                for(let packet255 of packets255){
                    this.nat.receive(packet255[1], packet255[2]);
                }
                // answer to part1
                // finished = true;
                // console.log('z1', packets255);
                this.queue = this.queue.filter(packet => packet[0] !== 255);
            }
            if(this.isIdle()){
                let packet = this.nat.getPacketToSend();
                this.queue.push(packet);
                if(this.nat.lastDelivered[1] !== null && this.nat.lastDelivered[1] === packet[1] && this.nat.lastDelivered[2] === packet[2]){
                    // answer to part 2
                    finished = true;
                    console.log('z2', packet);
                }
                this.nat.setLastDelivered(...packet);
            }
        }
    }
}

class NAT{
    constructor(){
        this.X = null;
        this.Y = null;
        this.lastDelivered = [0,null, null]
    }

    receive(X, Y){
        this.X = X;
        this.Y = Y;
    }

    getPacketToSend(){
        return [0, this.X, this.Y];
    }

    setLastDelivered(addr, X, Y){
        this.lastDelivered = [addr, X, Y];
    }
}

let network = new Network(50, input);
network.run();