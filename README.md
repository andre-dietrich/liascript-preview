<!--

author:   Andre Dietrich
email:    dietrich@ivs.cs.uni-magdeburg.de
version:  1.0.0
language: en
narrator: US English Female

script:   https://felixhao28.github.io/JSCPP/dist/JSCPP.es5.min.js

@JSCPP
<script>
  try {
    var output = "";
    JSCPP.run(`@code`, "", {stdio: {write: s => { output += s.replace(/\n/g, "<br>");}}});
    output;
  } catch (error) {
    error;
  }
</script>
@end
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
@JSCPP


## Graphics

                Simple-Signal Plot
      |  R G B
  y   |          
  -   |  r  r  r  r  r  r  r  r  r  r
scale |      ***         ***
      |   ***   ***   ***   ***   ***
      |***         ***         ***
      +-------------------------------
      1         x-scale              100.5


## Quizzes

Do you like LiaScript?

    [[X]] *Yes!!!*
    [[X]] of course
    [[ ]] absolutely no
    *******************************************************
    LiaScript is the best solution for free online courses!

    Enjoy...
    *******************************************************

## and much more ...
