word="abcdefghijklmnopqrstuvwxyz"
characters=" !@#$%^&*_-=+?><.0123456789"
encodedchar = word.upper()+word+characters
Text={}
N=100
import string
import random
import numpy


def RandomCode():    
    N = 7
    res = ''.join(random.choices(string.ascii_uppercase +
                                string.digits, k = N))
    return str(res)

for i in range(N):
    print(i/N)
    str_var = list(encodedchar)
    numpy.random.shuffle(str_var)
    suffle =''.join(str_var) 
    Map=[{},{}]
    for i in range(len(encodedchar)):
        Map[0][encodedchar[i]] = suffle[i]
        Map[1][suffle[i]] = encodedchar[i]
    Text[RandomCode()]=Map
with open('secure.txt', 'w') as f:
    f.write(str(Text))
