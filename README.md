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

this [^1](is a footnote) inline


    --{{1 Russian Female}}--
Первоначально создан в 2004 году Джоном Грубером (англ. John Gruber) и Аароном
Шварцем. Многие идеи языка были позаимствованы из существующих соглашений ...

## Footnotes

    --{{0}}--
There are two types of footnotes, either inline or divided ones (into two
parts).

1. Inline Footnote[^1](explanation in one line) => `[^1](explanation in one line)`
2. Divided into a marker[^2] => `[^2]`, that can appeare every where and an
   explanation at the bottom of a section.

   ```md
   [^2]: This is an explanation, than
         can consist of multiple blocks.
   ```

[^2]: This is an explanation, than
      can consist of multiple blocks.


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
