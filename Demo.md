<!--

author:   André Dietrich
email:    andre.dietrich@ovgu.de
version:  0.2.0
language: en
narrator: US English Female

import:   https://raw.githubusercontent.com/liaScript/jscpp_template/master/README.md

-->


# LiaScript Example

## Coding C++


```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 12;
    int rslt = 0;
    for(int i=1; i<a; ++i) {
        rslt += i;
        cout << "rslt: " << rslt << endl;
    }
    cout << "final result = " << rslt << endl;
    return 0;
}
```
@JSCPP.eval


## Graphics

                Simple-Signal Plot
      |  R G B
    y |          
    - |rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
 axis |      ***         ***
      |   ***   ***   ***   ***   ***
      |***         ***         ***
      +-------------------------------
      1            x-axis        100.5



## Quizzes


[[ ]] Add as many elements as you want?
[[X]] The X marks the correct answer!
[[ ]] ... this is wrong ...
[[X]] ... this has to be selected too ...
