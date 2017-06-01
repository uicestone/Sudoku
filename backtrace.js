const stdin = process.openStdin();
let map = [];
let tries = 0;

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    const line = d.toString().trim().split(/\s+/);
    map.push(line.map(digit => Number(digit)));

    if(map.length === 9) {
        main();
    }
});

function isPlace(count){
    let row = Math.floor(count / 9);
    let col = count % 9;
    let j;
    //同一行
    for(j = 0; j < 9; ++j){
        if(map[row][j] === map[row][col] && j !== col){
            return false;
        }
    }
    //同一列
    for(j = 0; j < 9; ++j){
        if(map[j][col] === map[row][col] && j !== row){
            return false;
        }
    }
    //同一小格
    let tempRow = Math.floor(row / 3) * 3;
    let tempCol = Math.floor(col / 3) * 3;
    for(j = tempRow; j < tempRow + 3;++j){
        for(let k = tempCol; k < tempCol + 3; ++k){
            if(map[j][k] === map[row][col] && j !== row && k !== col){
                return false;
            }
        }
    }
    return true;
}
function backtrace(count){
    tries++;
    if(count === 81){
        console.log("结果：");
        for(let i = 0; i < 9; ++i){
            console.log(map[i].join(" "));
        }
        return;
    }
    let row = Math.floor(count / 9);
    let col = count % 9;
    if(map[row][col] === 0){
        for(let i = 1; i <= 9; ++i){
            map[row][col] = i;//赋值
            if(isPlace(count)){//可以放
                backtrace(count+1);//进入下一层
            }
        }
        map[row][col] = 0;//回溯
    }else{
        backtrace(count+1);
    }
}
function main()
{
    console.log("开始搜寻数独解……");
    const start = Date.now();
    backtrace(0);
    console.log(`${tries} tries, time: ${Date.now() - start}`);
    process.exit();
}