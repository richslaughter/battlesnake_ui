var socketApi = require('./socketApi');
var config = require('./config.js');
const request = require('request');

const STATE_WAITING = 'waiting';
const STATE_COUNTDOWN = 'countdown';
const STATE_RUNNING = 'running';
const STATE_COMPLETE = 'complete';

class SnakeHandler {
    constructor() {
        this.game_start_time = null;
        this.state = {
            min_snakes: 2,
            max_snakes: 4,
            snake_queue: [],
            game_state: STATE_WAITING,
            game_id: null,
            seconds_to_start: null,
            auto_start: true
        }
        var self = this;
        socketApi.onNewClientCallback = function(){self.publishState();}
        console.debug('SnakeHandler initialised');
    }

    setConfig(autoStart){
        this.state.auto_start = autoStart === 'true' ? true : false;
        this.publishState();
    }

    addSnake(name, url){
        if(name === "" || url === "")
        return new Error ('Snake name and URL must be set');

        if(this.state.snake_queue.find(entry => entry.url === url) != null) {
            return new Error('url already in queue')
        } else {
            this.state.snake_queue.push({name: name, url: url})
            console.debug(`Queued ${name} (${url}). Queue size: ${this.state.snake_queue.length}`)
            this.publishState();
        }
    }

    removeSnake(url){
        try{
            for (var i=0; i < this.state.snake_queue.length; i++) {
                if (this.state.snake_queue[i].url === url) {
                    this.state.snake_queue.splice(i);
                    console.debug(`Removed ${url} from queue`)
                    this.publishState();
                    return;
                }
            }
        } catch(err) {
            return err;
        }
        return Error('Snake not found');
    }

    gotoState(enter_state){
        console.debug(`Entering state: ${enter_state}`);
        this.state.game_state = enter_state;
        this.publishState();
    }

    handleCurrentState(){
        if(this.state.game_state === STATE_WAITING){
            this.handleStateWaiting();
        } else if(this.state.game_state === STATE_COUNTDOWN) {
            this.handleStateCountdown();
        } else if(this.state.game_state === STATE_RUNNING) {
            this.handleStateRunning();
        } else if(this.state.game_state === STATE_COMPLETE) {
            this.handleStateComplete();
        }
    }

    handleStateWaiting(){
        if(!this.state.auto_start){
            return;
        }

        if(this.state.snake_queue.length >= this.state.min_snakes){
            this.game_start_time = Date.now() + 5000;
            this.state.seconds_to_start = 5;
            this.gotoState(STATE_COUNTDOWN);
        }
    }

    handleStateCountdown(){
        var ms = this.game_start_time - Date.now();
        this.state.seconds_to_start = Math.ceil(ms / 1000);
        this.publishState()
        if(ms < 0){
            this.startGame(); //start game and go to running
        }
    }

    handleStateRunning(){
        var state_uri = `${config.engineurl}/games/${this.state.game_id}`;
        var self = this;
        request.get({uri: state_uri, json: true},
        function(error, response){
            //todo: check error
            var gameState = response.body.Game.Status;
            console.debug(`Running game state is ${gameState}`);
            if(gameState === STATE_COMPLETE){
                self.gotoState(STATE_COMPLETE);
            }
        });
    }

    handleStateComplete(){
        this.gotoState(STATE_WAITING);
    }
    
    startGame(){
        console.debug('Starting game');
        var game_snakes = [];
        while(this.state.snake_queue.length > 0 && game_snakes.length <= 4){
            var snake_entry = this.state.snake_queue.shift();
            game_snakes.push(snake_entry);
        }

        var width = 15;
        var height = 15;
        var food = 5;

        var request_body = {
            width: width, height: height, food: food, snakes: game_snakes
        };

        var self = this;
        request.post({uri: "http://localhost:3005/games", body: request_body, json: true},
        function(error, response){
            //todo: check error
            const id = response.body.ID;
            console.log(id);
            self.state.game_id = id;

            request.post({uri:`http://localhost:3005/games/${id}/start`},
            function(error, response){
                //todo: check for error
                socketApi.broadcastGameStart(id);
                self.gotoState(STATE_RUNNING);
            });
        });
    }

    publishState(){
        socketApi.broadcast('state', this.state);
    }

    debugState(){
        console.debug(`current state is ${this.state.game_state} Queue size: ${this.state.snake_queue.length}, min snakes: ${this.state.min_snakes}`);
    }

    start(){
        var self = this;
        //setInterval(function(){ self.debugState(); }, 10000);
        setInterval(function(){ self.handleCurrentState(); }, 1000);
    }
};

module.exports = new SnakeHandler();