const os =  require('os');
const spawn = require('child_process').spawn;

// Color codes for logging
const colors = {
 Reset: "\x1b[0m",
 Bright: "\x1b[1m",
 Dim: "\x1b[2m",
 Underscore: "\x1b[4m",
 Blink: "\x1b[5m",
 Reverse: "\x1b[7m",
 Hidden: "\x1b[8m",
 fg: {
  Black: "\x1b[30m",
  Red: "\x1b[31m",
  Green: "\x1b[32m",
  Yellow: "\x1b[33m",
  Blue: "\x1b[34m",
  Magenta: "\x1b[35m",
  Cyan: "\x1b[36m",
  White: "\x1b[37m",
  Crimson: "\x1b[38m"
},
bg: {
  Black: "\x1b[40m",
  Red: "\x1b[41m",
  Green: "\x1b[42m",
  Yellow: "\x1b[43m",
  Blue: "\x1b[44m",
  Magenta: "\x1b[45m",
  Cyan: "\x1b[46m",
  White: "\x1b[47m",
  Crimson: "\x1b[48m"
 } 
 

 
};

// MAIN

function main(){

    getFreeRam(function(freeRam){
        console.log(colors.fg.Cyan,
        "###################~~SYSTEM INFO~~##################", colors.Reset);
        console.log("Device: \t"+ colors.fg.Magenta,os.hostname(), colors.Reset);
        console.log("Platform: \t "+os.platform()+" "+os.release());
        console.log("Uptime: \t "+upTimeFormatter(os.uptime()));
        console.log("Memory: \t "+
            (memoryFormatter(os.totalmem(), false)-
            memoryFormatter(freeRam, false)+"MB / "+
            memoryFormatter(os.totalmem(), false)+"MB ("+
            logPercentage(percents(freeRam, os.totalmem())) +")"+
            percentageMeter(percents(freeRam, os.totalmem()))
            ));
        console.log(colors.fg.Cyan,"####################################################", colors.Reset);
    })  
}
main();
// FUNCTIONS

function memoryFormatter(memory, gb){
    if(gb){
        return Math.round(memory/1024/1024/1024);
    }else{
        return Math.round(memory/1024/1024);
    }
}

function getFreeRam(callBack){
    var command = "awk '/Mem:/ {print $7}' <(free -b)";

    var bash = spawn('bash', ['-c', command]);

    bash.stdout.on('data', function (data) {
        callBack(data);
    });

    bash.stderr.on('data', function (data) {
        console.error('stderr: ' + data);
        return null;
    });
}
function percents(x, y){
    return Math.round((y-x)/y*100);
}
function percentageMeter(percents){
    const max = 10;
    const value = Math.round(percents/max);
    var color = colors.fg.Green;
    if(percents > 50 && percent < 80){
        color = colors.fg.Yellow;
    }
    else if(percents > 80 ){
        color = color.fg.Red;
    }
    var meterFill = "";
    var meterEmpty = "";
    var i = 0;
    while(i <= max){
        if(i <= value){
            meterFill += String.fromCharCode(9638);
        }else{
            meterEmpty += String.fromCharCode(9638);
        }
        i++;
    }

    return color + meterFill + colors.fg.White + meterEmpty + colors.Reset;
}

function upTimeFormatter(uptime){
    var formatted = "";
    var seconds,hours, days;
    formatted = uptime+"sec"
    if(uptime > 60){
        minutes = Math.floor(uptime/60);
        seconds = uptime - (minutes*60);
        formatted = minutes+"min "+seconds+"sec";
        if(minutes > 60){
            hours = Math.floor(minutes/60);
            minutes = minutes-(hours*60);
            formatted = hours+"h "+minutes+"min "+seconds+"sec";
            if(hours > 24){
                days = Math.floor(hours/24);
                hours = hours-(days*24);
                formatted = days+"d "+hours+"h "+minutes+"min "+seconds+"sec";
            }
        }
    }
    return formatted;
}

function logPercentage(percentage){
    if(percentage > 50 && percentage < 80){
        return colors.fg.Yellow + percentage + "%"+ colors.Reset;
    }
    else if(percentage > 80){
        return colors.fg.Red + percentage + "%"+ colors.Reset;
    }else{
        return colors.fg.Green+  percentage + "%"+ colors.Reset;
    }
}