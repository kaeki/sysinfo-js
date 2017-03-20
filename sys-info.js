const os =  require('os');
const spawnSync = require('child_process').spawnSync;

// Color codes for logging
const colors = {
    Reset: '\x1b[0m',
    Bright: '\x1b[1m',
    Dim: '\x1b[2m',
    Underscore: '\x1b[4m',
    Blink: '\x1b[5m',
    Reverse: '\x1b[7m',
    Hidden: '\x1b[8m',
    fg: {
        Black: '\x1b[30m',
        Red: '\x1b[31m',
        Green: '\x1b[32m',
        Yellow: '\x1b[33m',
        Blue: '\x1b[34m',
        Magenta: '\x1b[35m',
        Cyan: '\x1b[36m',
        White: '\x1b[37m',
        Crimson: '\x1b[38m'
    },
    bg: {
        Black: '\x1b[40m',
        Red: '\x1b[41m',
        Green: '\x1b[42m',
        Yellow: '\x1b[43m',
        Blue: '\x1b[44m',
        Magenta: '\x1b[45m',
        Cyan: '\x1b[46m',
        White: '\x1b[47m',
        Crimson: '\x1b[48m'
    }
};

const memory = {
    format: function(memory, GB){
        if(GB){
            return Math.round(memory/1024/1024/1024);
        }else{
            return Math.round(memory/1024/1024);
        }
    },
    getFreeRam: function(){
        const command = "awk '/Mem:/ {print $7}' <(free -b)";
        const bash = spawnSync('bash', ['-c', command]);
        return Number(bash.stdout.toString())
    },
    getRamString: function(totalMemory){
        const freeRam = this.getFreeRam();
        const usedMB = this.format((totalMemory - freeRam), false);
        const totalMB = this.format(totalMemory, false);
        const percentageWithMeter = percents.getString(usedMB, totalMB, true);

        return usedMB + 'MB / ' + totalMB + 'MB '+percentageWithMeter;
    }
};

const percents = {
    calculatePercents: function(x, y){
        return Math.round(x/y*100);
    },
    getColor: function(percentage){
        let color = colors.fg.Green;
        if(percentage > 50 && percentage < 80){
            color = colors.fg.Yellow;
        }
        else if(percentage > 80){
            color = color.fg.Red;
        }
        return color;
    },
    getMeter: function(percentage, color){
        const value = Math.round(percentage/10);
        const utfBoxChar = String.fromCharCode(9638);
        let meter = { fill: '', empty: '' };
        let i = 0;
        while(i <= 10){
            if(i <= value){
                meter.fill += utfBoxChar;
            }else{
                meter.empty += utfBoxChar;
            }
            i++;
        }
        return color + meter.fill + colors.fg.White + meter.empty + colors.Reset;
    },
    getString: function(free, total, withMeter){
        const percentage = this.calculatePercents(free, total);
        const color = this.getColor(percentage);
        const value = '(' + color + percentage + colors.Reset + ')';
        const meter = this.getMeter(percentage, color);
        if(withMeter){
            return value+' '+meter;
        }
        else{
            return value;
        }
    }
};

const uptimeFormatter = function(uptime){
    let formatted = '';
    let seconds, hours, days;
    formatted = uptime+'sec';
    if(uptime > 60){
        minutes = Math.floor(uptime/60);
        seconds = uptime - (minutes*60);
        formatted = minutes+'min '+seconds+'sec';
        if(minutes > 60){
            hours = Math.floor(minutes/60);
            minutes = minutes-(hours*60);
            formatted = hours+'h '+minutes+'min '+seconds+'sec';
            if(hours > 24){
                days = Math.floor(hours/24);
                hours = hours-(days*24);
                formatted = days+'d '+hours+'h '+minutes+'min '+seconds+'sec';
            }
        }
    }
    return formatted;
};

const sysInfo = {
    init: function(){
        this.header = colors.fg.Cyan +
            '###################~~SYSTEM INFO~~##################' + 
            colors.Reset;
        this.footer = colors.fg.Cyan +
            '####################################################' + 
            colors.Reset;
        this.device = colors.fg.Magenta+os.hostname()+colors.Reset;
        this.platform = os.platform()+' '+os.release();
        this.uptime = uptimeFormatter(os.uptime());
        this.memory = memory.getRamString(os.totalmem());
        this.print();
    },
    print: function(){
        console.log(this.header);
        console.log('Device: \t'+this.device);
        console.log('Platform: \t'+this.platform);
        console.log('Uptime: \t'+this.uptime);
        console.log('Memory: \t'+this.memory);
        console.log(this.footer);
    }
}

sysInfo.init();
