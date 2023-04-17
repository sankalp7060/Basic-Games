import time
import timer
import random
for i in range(80):
    print('-',end='')
    time.sleep(0)
print('***Welcome To Kaun Banega Crorepati***'.center(80))
for i in range(80):
    print('-',end='')
    time.sleep(0)
name=(input('                     Enter Your Name: '))
for i in range(80):
    print('-',end='')
    time.sleep(0)
amount=0
m=0
flag=0
e=70000000
price=[1000,2000,3000,5000,10000,20000,40000,80000,160000,320000,640000,1250000,2500000,5000000,10000000,70000000]
ques=['When was C language discover?','When was Python language discover?','Who make zen of Python?','Sets are ____?','Who win the T20 world cup of 2022?','Who win the T20 world cup of 2021?','When was Gandhiji started Quit India movement?','Who is the Prime Minister of UK?','When was India become Independent?','When was second world war started?','When was first world war started?','Which country win the 2003 world cup?','At which age sachin tendulkar played his first international match?','When was India win the first T20 world cup?','Which city is the capital of Jharkhand?','Who is the Chief Minister of Uttar Pradesh?','Which of the following are mutable?','Which of the following is not the method of list?','Which of the following is a method of set?','Dictionaries are ____?','How many keywords are there in python?','How many keywords are there in C language?','Which type of variable is defined within a function?','Which type of variable is defined outside a function?']
ans=[[1970,1972,1971,1973,2],[1993,1991,1989,1992,2],['Tim Peters','Charles Babbage','Denis Ritchie','None of the above',1],['Ordered','Immutable','Unordered','None',3],['India','New Zealand','Australia','England',4],['Pakistan','England','Australia','New Zealand',3],[1947,1940,1937,1942,4],['Rishi Sunak','Narendra Modi','Joe Biden','Vladmir Putin',1],[1950,1949,1945,1947,4],[1935,1939,1940,1945,2],[1910,1912,1914,1911,3],['India','New Zealand','Australia','South Africa',3],[16,20,22,19,1],[2009,2008,2007,2011,3],['Raipur','Ranchi','Bokaro','Ratnagiri',2],['Amit Shah','Yogi Aditya Nath','Rahul Gandhi','Narendra Modi',2],['Tuple','String','Set','None',3],['sort()','pop()','del','None',3],['isdisjoint()','clear()','add()','All',4],['Immutable','Ordered','Unordered','None',2],[32,34,33,31,3],[32,34,33,31,1],['Local variable','Global variable','static variable','dynamic variable',1],['Local variable','Global variable','static variable','dynamic variable',2]]
for i in range(len(ques)):
    print(f'Question for Rupees {price[i]} is on your screen:\n'.center(80))
    b=random.choice(ques)
    qi=ques.index(b)
    ca=ans[qi]
    ques.remove(b)
    ans.remove(ca)
    print(f'Your current winning amount is: {amount}'.center(80))
    print('\n')
    print(b.center(80))
    print('\n')
   
    l=           f'''                         1.{ca[0]}         2.{ca[1]}
                         3.{ca[2]}         4.{ca[3]}'''
    print(l.center(80))
    print('\n')
    correct=ca[-1]
    l=(input(f'         Enter Your Answer or Press 0 for Quit or Press 5 for Lifeline: '))
    print('\n')
    if(int(l)==correct):
        print('                         ',f'Congratulation! You win {price[i]}')
        amount+=price[i]
        for j in range(80):
            print('~',end='')
        if(i==4):
            m=10000
        elif(i==9):
            m=320000
        elif(i==14):
            m=10000000
    elif(int(l)==0):
        print(f'Congratulation! Your take home money is: {amount}'.center(80))
        flag=1
        for j in range(80):
            print('~',end='')
            time.sleep(0)
        break
    elif(int(l)!=correct):
        print('You Loss'.center(80))
        break
    if(price[i]==e):
        print('                  ',f'Congratulation! Your take home money is: {amount}')
        flag=2
        break
if(flag!=1 and flag!=2):
     print('                      ',f'Oops! Your take home money is: {m}')
     for j in range(80):
            print('~',end='')
            time.sleep(0)
