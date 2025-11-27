import mysql from "mysql2"
import dotenv from 'dotenv'
dotenv.config();


const db = mysql.createConnection({
    HOST: process.env.DB_HOST,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB
    
    
})

db.connect()




/* this is the skill which takes a lot time to understand that's why I don't why, today I have learnt this skill

if you wanted to be in that top 1percent developers I wanted you to start with difference project and start building

at least 10projects which are of the full stack and  learn to design the ux and write the code by your hands

while you are building the project I wanted you to guys to make enough mistakes while coding, and make sure tht you learn the concept

while like this, I didn't came here to just build a basic portiflio site and get the intership that i wanted to get not like this

I came here to break the barries of a what a man can do, to make the impossible possible I camhere, what ia m building ia m building
a consistency cycle whcih is uncreakable for the next few years.
I had this crazy thought no it's going to become the reality soon,

becuase I do read a lot of book that give a lot expsoreuabout theterminology, what did i understood

it's good it write the code in a single day youc an write a lot of code
.. it's good do the manual world sometimes, 

.. spent more and more time on debugging the existing system how to do you actually learn that skill

?? I am shaking, I am not chasing the anything, I amjust becoming  the person for whom everything will chase
// for that i am putting the relentless effort I am writing the code by the hand it'sef
// I am learning the skillsthat willl last for the life time

// what's laglgling ramu, you have everything, you have the access to internet, and computer and this one thign is 

more than enough for you build and solve aproblem, that' really add value to the people life

// I am trying to add new and new feature into the website, and figuring the difference ways to build a onesingle website

// I have built  a voice bot and I have someother frames works which will blow your mind


*/