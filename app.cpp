// http://blog.csdn.net/cannel_2020/article/details/7483372
#include <iostream>  
#include <algorithm>  
using namespace std;  
int map[9][9];
int tries = 0;
bool isPlace(int count){  
    int row = count / 9;  
    int col = count % 9;  
    int j;  
    //同一行  
    for(j = 0; j < 9; ++j){  
        if(map[row][j] == map[row][col] && j != col){  
            return false;  
        }  
    }  
    //同一列  
    for(j = 0; j < 9; ++j){  
        if(map[j][col] == map[row][col] && j != row){  
            return false;  
        }  
    }  
    //同一小格  
    int tempRow = row / 3 * 3;  
    int tempCol = col / 3 * 3;  
    for(j = tempRow; j < tempRow + 3;++j){  
        for(int k = tempCol; k < tempCol + 3; ++k){  
            if(map[j][k] == map[row][col] && j != row && k != col){  
                return false;  
            }  
        }  
    }  
    return true;  
}  
void backtrace(int count){  
    tries++;
    if(count == 81){  
        cout<<"结果："<<endl;  
        for(int i = 0; i < 9; ++i){  
            for(int j =  0; j < 9; ++j){  
                cout<<map[i][j]<<" ";  
            }  
            cout<<endl;  
        }  
        return;  
    }  
    int row = count / 9;  
    int col = count % 9;  
    if(map[row][col] == 0){  
        for(int i = 1; i <= 9; ++i){  
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
int main()  
{  
    for(int i = 0; i < 9; ++i){  
        for(int j = 0; j < 9; ++j){  
            cin>>map[i][j];  
        }  
    }
    auto start = std::chrono::high_resolution_clock::now();
    backtrace(0);  
    auto elapsed = std::chrono::high_resolution_clock::now() - start;
    long long microseconds = std::chrono::duration_cast<std::chrono::microseconds>(elapsed).count();
    cout<<tries<<" tries, time: "<<microseconds<<endl;
    return 0;  
}  