# Test Python - Assignment 13

## 1. Write a program that generates and prints 50 random integers.
```python
import random

# ? Generate and print 50 random integers between a specified range (e.g., 1 to 100)
random_integers = [random.randint(1, 100) for _ in range(50)]
print("50 Random Integers:", random_integers)
```

## 2. Write a program that generates a random number, x, between 1 and 50, and a random number y between 2 and 5, and computes x y.
```python
import random

x = random.randint(1, 50)

y = random.randint(2, 5)

result = x ** y
print(f"Randomly selected x: {x}, y: {y}")
print(f"{x} raised to the power of {y} is: {result}")
```

## 3. Write a program that creates an anagram of a given word. An anagram of a word uses the same letters as the word but in a different order. For instance, two anagrams of the word there are three and ether. Don’t worry about whether the anagram is a real word or not. (Use shuffle() method of random module)
```python
import random

def create_anagram(word):
    
    letters = list(word)
    
    random.shuffle(letters)
    
    anagram = ''.join(letters)
    return anagram

word = "there"
anagram = create_anagram(word)
print(f"Original word: {word}")
print(f"Anagram: {anagram}")
```

## 4. Write a simple quiz game that has a list of ten questions and a list of answers to those questions. The game should give the player four randomly selected questions to answer. It should ask the questions one-by-one, and tell the player whether they got the question right or wrong. At the end, it should print out how many out of four they got right.
```python
import random

questions = [
    "What is the capital of France?",  # Paris
    "What is the sum of 2 + 2?",  # 4
    "What is the chemical symbol for water?",  # H2O
    "What is the largest planet in our solar system?",  # Jupiter
    "Who wrote 'To Kill a Mockingbird'?",  # Harper Lee
    "What year did the Titanic sink?",  # 1912
    "What is the square root of 81?",  # 9
    "Who painted the Mona Lisa?",  # Leonardo da Vinci
    "What is the hardest natural substance on Earth?",  # Diamond
    "What is the capital of Japan?"  # Tokyo
]

answers = [
    "Paris", "4", "H2O", "Jupiter", 
    "Harper Lee", "1912", "9", 
    "Leonardo da Vinci", "Diamond", "Tokyo"
]

selected_indices = random.sample(range(10), 4)

correct_answers = 0
for i in selected_indices:
    user_answer = input(f"Question: {questions[i]} ")
    if user_answer.strip().lower() == answers[i].lower():
        print("Correct!")
        correct_answers += 1
    else:
        print(f"Wrong! The correct answer is: {answers[i]}")

print(f"\nYou got {correct_answers} out of 4 correct.")
```

## 5. Write a simple quote-of-the-day program. The program should contain a list of quotes, and when the user runs the program, a randomly selected quote should be printed.
```python
import random

quotes = [
    "The only limit to our realization of tomorrow is our doubts of today.",
    "The purpose of our lives is to be happy.",
    "Life is what happens when you're busy making other plans.",
    "Get busy living or get busy dying.",
    "You have within you right now, everything you need to deal with whatever the world can throw at you.",
    "The only way to do great work is to love what you do.",
    "The only thing we have to fear is fear itself.",
    "Nothing in life is to be feared, it is only to be understood.",
    "Great minds discuss ideas; average minds discuss events; small minds discuss people.",
    "The only thing we know about the future is that it will be different."
]

quote_of_the_day = random.choice(quotes)
print(f"Quote of the Day: {quote_of_the_day}")
```