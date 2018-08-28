<!--

author:   Andre Dietrich
email:    dietrich@ivs.cs.uni-magdeburg.de
version:  1.0.0
language: en_US
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


# jscpp_template

Template for applying the JavaScript C++ Interpreter
[JSCPP](https://felixhao28.github.io/JSCPP) that was implemented by Felix Hao.

If you are on github, then see the rendered version
[here](https://liascript.github.io/course/?https://raw.githubusercontent.com/liaScript/jscpp_template/master/README.md)

github-project: https://github.com/liaScript/jscpp_template


                               --{{0}}--
If you want to change some of the following code snippets, simply double-click
on them to enter the edit mode.

## JavaScript


```c_cpp
#include <iostream>s
using namespace std;

int main() {
    int a = 120;
    int rslt = 0;
    for(int i=1; i<a; ++i) {
        rslt += i;
        cout << "rslt: " << rslt << endl;
    }
    cout << "final result = " << rslt << endl;
    return 0;
}
```
<script>
  try {
    var output = "";
    JSCPP.run(`@code`, "", {stdio: {write: s => { output += s.replace(/\n/g, "<br>");}}});
    output;
  } catch (error) {
    error;
  }
</script>

## Macro

```c_cpp
#include <iostream>
using namespace std;

int main() {
    int a = 120;
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

               Test diagram
    10| r
      |  rrr  *
    y |   * rrr  *           RRRRR
    - | *      rrr   RRR *   *    *
scale |*          rrr
      +----------------------------
      -1          (x scale)              10
