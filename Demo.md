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
  JSCPP.run(`@input`, "", {stdio: {write: s => { output += s.replace(/\n/g, "<br>");}}});
  output;
} catch (msg) {
  var error = new LiaError(msg, 1);
  var log = msg.match(/(.*)\nline (\d+) \(column (\d+)\):.*\n.*\n(.*)/);
  var info = log[1] + " " + log[4];

  if (info.length > 80)
    info = info.substring(0,76) + "..."

  error.add_detail(0, info, "error", log[2]-1, log[3]);

  throw error;
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
