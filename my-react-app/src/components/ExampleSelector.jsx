import React from 'react';

import { motion } from 'framer-motion';
import { Code2, Sparkles, Zap, Cpu, BookOpen, TrendingUp, Target, Lightbulb, Brain, RotateCcw } from 'lucide-react';

const examples = [
  {
    id: 'hello-world',
    title: 'Hello World - Your First Program',
    description: 'The classic first program every programmer writes',
    icon: <Sparkles className="w-5 h-5" />,
    difficulty: 'beginner',
    category: 'basics',
    code: `# Your very first Python program!
print("Hello, World!")
print("Welcome to Python programming! 🐍")

# Let's make it personal
print("What's your name?")
name = "Programmer"  # You can change this!
print(f"Nice to meet you, {name}!")

# Fun with emojis
print("Python is fun! 🎉")
print("Let's code together! 💻")
`,
  },
  {
    id: 'simple-calculator',
    title: 'Simple Calculator',
    description: 'Build a basic calculator with addition, subtraction, multiplication, and division',
    icon: <Target className="w-5 h-5" />,
    difficulty: 'beginner',
    category: 'basics',
    code: `# Simple Calculator
print("🧮 Welcome to Python Calculator!")
print("=" * 30)

# Let's do some math!
num1 = 10
num2 = 5

print(f"First number: {num1}")
print(f"Second number: {num2}")
print()

# Basic operations
addition = num1 + num2
subtraction = num1 - num2
multiplication = num1 * num2
division = num1 / num2

print("📊 Results:")
print(f"➕ {num1} + {num2} = {addition}")
print(f"➖ {num1} - {num2} = {subtraction}")
print(f"✖️  {num1} × {num2} = {multiplication}")
print(f"➗ {num1} ÷ {num2} = {division}")

# Try changing the numbers above and run again!
print("\\n💡 Tip: Change num1 and num2 values and run again!")
`,
  },
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    description: 'Calculate age and fun facts about birth year',
    icon: <Lightbulb className="w-5 h-5" />,
    difficulty: 'beginner',
    category: 'basics',
    code: `# Age Calculator with Fun Facts
print("🎂 Age Calculator & Fun Facts")
print("=" * 35)

# Your information (change these!)
birth_year = 2000
current_year = 2024
name = "Alex"

# Calculate age
age = current_year - birth_year

print(f"👋 Hello {name}!")
print(f"📅 Birth Year: {birth_year}")
print(f"📅 Current Year: {current_year}")
print(f"🎈 Your Age: {age} years old")

# Fun calculations
days_lived = age * 365
hours_lived = days_lived * 24
minutes_lived = hours_lived * 60

print("\\n🌟 Amazing Facts About You:")
print(f"📆 You've lived approximately {days_lived:,} days!")
print(f"⏰ That's about {hours_lived:,} hours!")
print(f"⏱️  Or {minutes_lived:,} minutes!")

# Age categories
if age < 13:
    category = "Child 👶"
elif age < 20:
    category = "Teenager 🧒"
elif age < 60:
    category = "Adult 👨‍💼"
else:
    category = "Senior 👴"

print(f"\\n🏷️  Age Category: {category}")
print("\\n💡 Try changing your birth_year and see the magic!")
`,
  },
  {
    id: 'number-guessing',
    title: 'Number Guessing Game',
    description: 'A fun guessing game with hints and scoring',
    icon: <Brain className="w-5 h-5" />,
    difficulty: 'beginner',
    category: 'basics',
    code: `# Number Guessing Game (Simulated)
import random

print("🎯 Welcome to the Number Guessing Game!")
print("=" * 40)
print("I'm thinking of a number between 1 and 10...")

# Computer picks a random number
secret_number = random.randint(1, 10)
print(f"🤖 (Psst... the secret number is {secret_number})")

# Simulate some guesses
guesses = [3, 7, 5, secret_number]
attempts = 0

for guess in guesses:
    attempts += 1
    print(f"\\n🎲 Attempt {attempts}: You guessed {guess}")
    
    if guess == secret_number:
        print("🎉 Congratulations! You got it!")
        print(f"✨ You won in {attempts} attempts!")
        if attempts == 1:
            print("🏆 AMAZING! First try!")
        elif attempts <= 3:
            print("👏 Great job!")
        else:
            print("👍 Well done!")
        break
    elif guess < secret_number:
        print("📈 Too low! Try a higher number.")
    else:
        print("📉 Too high! Try a lower number.")

print("\\n🎮 Thanks for playing!")
print("💡 Try changing the guesses list to play again!")
`,
  },
  {
    id: 'shopping-list',
    title: 'Smart Shopping List',
    description: 'Manage a shopping list with prices and totals',
    icon: <Code2 className="w-5 h-5" />,
    difficulty: 'beginner',
    category: 'basics',
    code: `# Smart Shopping List Manager
print("🛒 Smart Shopping List")
print("=" * 25)

# Shopping items with prices
shopping_list = {
    "🍎 Apples": 3.50,
    "🥛 Milk": 2.99,
    "🍞 Bread": 2.49,
    "🧀 Cheese": 4.99,
    "🥚 Eggs": 3.29,
    "🍌 Bananas": 1.99,
    "🥕 Carrots": 1.79
}

print("📝 Your Shopping List:")
print("-" * 30)

total_cost = 0
item_count = 0

for item, price in shopping_list.items():
    print(f"{item:<15} \${price:>6.2f}")
    total_cost += price
    item_count += 1

print("-" * 30)
print(f"📊 Total Items: {item_count}")
print(f"💰 Total Cost: \${total_cost:.2f}")

# Calculate average price
average_price = total_cost / item_count
print(f"📈 Average Price: \${average_price:.2f}")

# Find most and least expensive items
most_expensive = max(shopping_list.items(), key=lambda x: x[1])
least_expensive = min(shopping_list.items(), key=lambda x: x[1])

print(f"💎 Most Expensive: {most_expensive[0]} (\${most_expensive[1]:.2f})") 
print(f"💵 Least Expensive: {least_expensive[0]} (\${least_expensive[1]:.2f})")

# Budget check
budget = 20.00
print(f"\\n🎯 Budget: \${budget:.2f}")
if total_cost <= budget:
    savings = budget - total_cost
    print(f"✅ Within budget! You save \${savings:.2f}")
else:
    overspend = total_cost - budget
    print(f"⚠️  Over budget by \${overspend:.2f}")

print("\\n💡 Try adding or removing items from the shopping_list!")
`,
  },
  {
    id: 'grade-calculator',
    title: 'Student Grade Calculator',
    description: 'Calculate grades, GPA, and generate report cards',
    icon: <BookOpen className="w-5 h-5" />,
    difficulty: 'beginner',
    category: 'basics',
    code: `# Student Grade Calculator
print("🎓 Student Grade Calculator")
print("=" * 30)

# Student information
student_name = "Alice Johnson"
student_id = "STU001"

# Subject grades (out of 100)
grades = {
    "📚 Mathematics": 85,
    "🔬 Science": 92,
    "📖 English": 78,
    "🌍 History": 88,
    "🎨 Art": 95,
    "💻 Computer Science": 90
}

print(f"👤 Student: {student_name}")
print(f"🆔 ID: {student_id}")
print("\\n📊 Grade Report:")
print("-" * 35)

total_points = 0
subject_count = 0

for subject, grade in grades.items():
    # Determine letter grade
    if grade >= 90:
        letter = "A"
        emoji = "🌟"
    elif grade >= 80:
        letter = "B"
        emoji = "👍"
    elif grade >= 70:
        letter = "C"
        emoji = "👌"
    elif grade >= 60:
        letter = "D"
        emoji = "😐"
    else:
        letter = "F"
        emoji = "😞"
    
    print(f"{subject:<20} {grade:>3}% ({letter}) {emoji}")
    total_points += grade
    subject_count += 1

# Calculate GPA (4.0 scale)
average = total_points / subject_count

if average >= 90:
    gpa = 4.0
    performance = "Excellent! 🏆"
elif average >= 80:
    gpa = 3.0
    performance = "Good Job! 👏"
elif average >= 70:
    gpa = 2.0
    performance = "Keep Trying! 💪"
else:
    gpa = 1.0
    performance = "Need Improvement 📚"

print("-" * 35)
print(f"📈 Overall Average: {average:.1f}%")
print(f"🎯 GPA: {gpa:.1f}/4.0")
print(f"🏅 Performance: {performance}")

# Find best and worst subjects
best_subject = max(grades.items(), key=lambda x: x[1])
worst_subject = min(grades.items(), key=lambda x: x[1])

print(f"\\n⭐ Best Subject: {best_subject[0]} ({best_subject[1]}%)")
print(f"📝 Needs Work: {worst_subject[0]} ({worst_subject[1]}%)")

print("\\n💡 Try changing the grades and see how it affects the GPA!")
`,
  },
  {
    id: 'weather-simulator',
    title: 'Weather Report Simulator',
    description: 'Generate weather reports with conditions and recommendations',
    icon: <TrendingUp className="w-5 h-5" />,
    difficulty: 'beginner',
    category: 'basics',
    code: `# Weather Report Simulator
import random

print("🌤️  Weather Report Simulator")
print("=" * 30)

# City data
cities = ["New York", "London", "Tokyo", "Sydney", "Paris"]
city = random.choice(cities)

# Generate random weather data
temperature = random.randint(-10, 35)  # Celsius
humidity = random.randint(30, 90)      # Percentage
wind_speed = random.randint(5, 25)     # km/h

# Weather conditions based on temperature
if temperature < 0:
    condition = "Freezing ❄️"
    clothing = "Heavy winter coat, gloves, hat"
elif temperature < 10:
    condition = "Cold 🧥"
    clothing = "Warm jacket, long pants"
elif temperature < 20:
    condition = "Cool 🍂"
    clothing = "Light jacket or sweater"
elif temperature < 30:
    condition = "Warm ☀️"
    clothing = "T-shirt, shorts"
else:
    condition = "Hot 🔥"
    clothing = "Light clothing, stay hydrated!"

# Humidity comfort level
if humidity < 40:
    humidity_level = "Dry"
elif humidity < 70:
    humidity_level = "Comfortable"
else:
    humidity_level = "Humid"

# Wind description
if wind_speed < 10:
    wind_desc = "Light breeze 🍃"
elif wind_speed < 20:
    wind_desc = "Moderate wind 💨"
else:
    wind_desc = "Strong wind 🌪️"

# Display weather report
print(f"📍 Location: {city}")
print(f"🌡️  Temperature: {temperature}°C ({temperature * 9/5 + 32:.1f}°F)")
print(f"💧 Humidity: {humidity}% ({humidity_level})")
print(f"💨 Wind Speed: {wind_speed} km/h ({wind_desc})")
print(f"🌈 Condition: {condition}")

print("\\n👕 Clothing Recommendation:")
print(f"   {clothing}")

# Activity suggestions
print("\\n🎯 Activity Suggestions:")
if temperature > 20 and humidity < 70:
    print("   🏃‍♂️ Perfect for outdoor activities!")
    print("   🚴‍♀️ Great day for cycling or jogging")
elif temperature < 5:
    print("   🏠 Stay indoors and keep warm")
    print("   ☕ Perfect weather for hot chocolate")
elif humidity > 80:
    print("   🏢 Indoor activities recommended")
    print("   🎬 Good day for movies or reading")
else:
    print("   🚶‍♂️ Nice day for a walk in the park")
    print("   📚 Comfortable weather for any activity")

# Weather forecast (next 3 days)
print("\\n📅 3-Day Forecast:")
for day in range(1, 4):
    future_temp = temperature + random.randint(-5, 5)
    future_condition = random.choice(["Sunny ☀️", "Cloudy ☁️", "Rainy 🌧️", "Partly Cloudy ⛅"])
    print(f"   Day {day}: {future_temp}°C, {future_condition}")

print("\\n💡 Run the program again for a different city and weather!")
`,
  },
  {
    id: 'basic-print',
    title: 'Basic Print Statements',
    description: 'Learn how to display text and use print function',
    icon: <Sparkles className="w-5 h-5" />,
    difficulty: 'beginner',
    category: 'basics',
    code: `# Basic Print Statements
print("Hello, World!")
print("Welcome to Python!")

# Printing different types
print(42)          # Number
print(3.14)        # Decimal
print(True)        # Boolean

# Multiple items in one print
print("My age is", 25)
print("Python", "is", "awesome!")

# Using f-strings (formatted strings)
name = "Alice"
age = 30
print(f"Hello, my name is {name} and I am {age} years old")

# Print with separators
print("apple", "banana", "cherry", sep=", ")
print("Line 1", "Line 2", sep="\\n")  # New line separator
`,
  },
  {
    id: 'variables-basics',
    title: 'Variables and Data Types',
    description: 'Understanding variables, numbers, strings, and booleans',
    icon: <Code2 className="w-5 h-5" />,
    difficulty: 'beginner',
    category: 'basics',
    code: `# Variables and Data Types

# Numbers
age = 25
height = 5.9
temperature = -10

print("Age:", age)
print("Height:", height)
print("Temperature:", temperature)

# Strings (text)
first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name

print("First name:", first_name)
print("Last name:", last_name)
print("Full name:", full_name)

# Booleans (True/False)
is_student = True
is_working = False

print("Is student:", is_student)
print("Is working:", is_working)

# Getting type of variables
print("Type of age:", type(age))
print("Type of name:", type(first_name))
print("Type of is_student:", type(is_student))
`,
  },
  {
    id: 'basic-math',
    title: 'Basic Math Operations',
    description: 'Learn arithmetic operations and math functions',
    icon: <Target className="w-5 h-5" />,
    difficulty: 'beginner',
    category: 'basics',
    code: `# Basic Math Operations

# Basic arithmetic
a = 10
b = 3

print("Addition:", a + b)        # 13
print("Subtraction:", a - b)     # 7
print("Multiplication:", a * b)  # 30
print("Division:", a / b)        # 3.333...
print("Floor Division:", a // b) # 3 (whole number)
print("Remainder:", a % b)       # 1
print("Power:", a ** b)          # 1000 (10 to the power of 3)

# Order of operations (PEMDAS)
result = 2 + 3 * 4
print("2 + 3 * 4 =", result)    # 14 (not 20!)

result_with_parentheses = (2 + 3) * 4
print("(2 + 3) * 4 =", result_with_parentheses)  # 20

# Useful math functions
import math

number = 16
print("Square root of", number, "is", math.sqrt(number))
print("Pi =", math.pi)
print("Ceiling of 4.3:", math.ceil(4.3))  # 5
print("Floor of 4.7:", math.floor(4.7))   # 4
`,
  },
  {
    id: 'input-basics',
    title: 'Getting User Input',
    description: 'Learn how to get input from users and convert types',
    icon: <Lightbulb className="w-5 h-5" />,
    difficulty: 'beginner',
    category: 'basics',
    code: `# Getting User Input (Simulated)
# Note: In this playground, we'll simulate user input

# Simulating user input
def simulate_input(prompt, value):
    print(prompt, end="")
    print(value)  # Show what user "typed"
    return value

# Getting text input
name = simulate_input("What's your name? ", "Alice")
print(f"Hello, {name}!")

# Getting number input (need to convert)
age_text = simulate_input("What's your age? ", "25")
age = int(age_text)  # Convert string to integer
print(f"You are {age} years old")
print(f"Next year you'll be {age + 1}")

# Getting decimal number
height_text = simulate_input("What's your height in feet? ", "5.8")
height = float(height_text)  # Convert string to float
print(f"Your height is {height} feet")

# Simple calculator
num1_text = simulate_input("Enter first number: ", "10")
num2_text = simulate_input("Enter second number: ", "5")

num1 = float(num1_text)
num2 = float(num2_text)

print(f"{num1} + {num2} = {num1 + num2}")
print(f"{num1} - {num2} = {num1 - num2}")
print(f"{num1} * {num2} = {num1 * num2}")
if num2 != 0:
    print(f"{num1} / {num2} = {num1 / num2}")
`,
  },
  {
    id: 'conditions-basics',
    title: 'If Statements and Conditions',
    description: 'Learn how to make decisions in your code',
    icon: <Brain className="w-5 h-5" />,
    difficulty: 'beginner',
    category: 'basics',
    code: `# If Statements and Conditions

# Basic if statement
age = 18
if age >= 18:
    print("You are an adult!")

# If-else statement
temperature = 75
if temperature > 80:
    print("It's hot outside!")
else:
    print("It's not too hot")

# If-elif-else statement
score = 85
if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
elif score >= 60:
    print("Grade: D")
else:
    print("Grade: F")

# Multiple conditions
age = 25
has_license = True

if age >= 18 and has_license:
    print("You can drive!")
elif age >= 18 and not has_license:
    print("You need to get a license first")
else:
    print("You're too young to drive")

# Checking if something is in a list
fruits = ["apple", "banana", "orange"]
fruit = "banana"

if fruit in fruits:
    print(f"Yes, {fruit} is in the list!")
else:
    print(f"No, {fruit} is not in the list")

# Checking for empty values
name = ""
if name:
    print(f"Hello, {name}!")
else:
    print("Please enter your name")
`,
  },
  {
    id: 'loops-basics',
    title: 'Loops - For and While',
    description: 'Learn how to repeat code with loops',
    icon: <RotateCcw className="w-5 h-5" />,
    difficulty: 'beginner',
    category: 'basics',
    code: `# Loops - For and While

# For loop with range
print("Counting from 1 to 5:")
for i in range(1, 6):
    print(f"Count: {i}")

# For loop with list
fruits = ["apple", "banana", "cherry", "date"]
print("\\nFruits in the list:")
for fruit in fruits:
    print(f"- {fruit}")

# For loop with enumerate (get index and value)
print("\\nFruits with their positions:")
for index, fruit in enumerate(fruits):
    print(f"{index + 1}. {fruit}")

# While loop
print("\\nCountdown:")
count = 5
while count > 0:
    print(f"{count}...")
    count = count - 1  # Same as: count -= 1
print("Blast off! 🚀")

# While loop with user input simulation
print("\\nGuessing game:")
secret_number = 7
guesses = [5, 8, 7]  # Simulated guesses
guess_index = 0

while guess_index < len(guesses):
    guess = guesses[guess_index]
    print(f"Guess: {guess}")
    
    if guess == secret_number:
        print("Correct! You won!")
        break  # Exit the loop
    elif guess < secret_number:
        print("Too low!")
    else:
        print("Too high!")
    
    guess_index += 1

# Nested loops (loop inside a loop)
print("\\nMultiplication table:")
for i in range(1, 4):
    for j in range(1, 4):
        result = i * j
        print(f"{i} x {j} = {result}")
    print()  # Empty line after each row
`,
  },
  {
    id: 'hello',
    title: 'Hello World',
    description: 'A classic first program with variables and f-strings',
    icon: <Sparkles className="w-5 h-5" />,
    difficulty: 'beginner',
    category: 'basics',
    code: `# Welcome to Python Playground!
print("Hello, World!")
print("Python is awesome! 🐍")

name = "Developer"
age = 25
print(f"Hello, {name}! You are {age} years old.")

# Let's do some basic math
x = 10
y = 5
print(f"{x} + {y} = {x + y}")
print(f"{x} * {y} = {x * y}")
`,
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    description: 'Generate the famous mathematical sequence',
    icon: <Zap className="w-5 h-5" />,
    difficulty: 'intermediate',
    category: 'algorithms',
    code: `# Fibonacci sequence generator
def fibonacci(n):
    """Generate Fibonacci number at position n"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

def fibonacci_sequence(count):
    """Generate first 'count' Fibonacci numbers"""
    sequence = []
    for i in range(count):
        sequence.append(fibonacci(i))
    return sequence

# Generate and display the sequence
print("Fibonacci sequence:")
numbers = fibonacci_sequence(12)
for i, num in enumerate(numbers):
    print(f"F({i}) = {num}")

print(f"\\nThe 10th Fibonacci number is: {fibonacci(10)}")
`,
  },
  {
    id: 'primes',
    title: 'Prime Numbers',
    description: 'Find prime numbers using the Sieve of Eratosthenes',
    icon: <Cpu className="w-5 h-5" />,
    difficulty: 'intermediate',
    category: 'algorithms',
    code: `# Prime number finder using Sieve of Eratosthenes
def sieve_of_eratosthenes(limit):
    """Find all prime numbers up to limit using the sieve algorithm"""
    if limit < 2:
        return []
    
    # Create a boolean array and initialize all entries as True
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False
    
    p = 2
    while p * p <= limit:
        if is_prime[p]:
            # Mark all multiples of p as not prime
            for i in range(p * p, limit + 1, p):
                is_prime[i] = False
        p += 1
    
    # Collect all prime numbers
    primes = [i for i in range(2, limit + 1) if is_prime[i]]
    return primes

# Find primes up to 100
limit = 100
primes = sieve_of_eratosthenes(limit)

print(f"Prime numbers up to {limit}:")
print(primes)
print(f"\\nFound {len(primes)} prime numbers")
print(f"Largest prime: {max(primes)}")
`,
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis',
    description: 'Analyze sample sales data with statistics',
    icon: <TrendingUp className="w-5 h-5" />,
    difficulty: 'advanced',
    category: 'data-science',
    code: `# Sales data analysis with statistics
import statistics
import math

# Sample sales data (monthly sales in thousands)
sales_data = [120, 340, 180, 290, 410, 150, 380, 220, 350, 280, 195, 425]
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

print("📊 Sales Data Analysis Report")
print("=" * 40)

# Basic statistics
total_sales = sum(sales_data)
mean_sales = statistics.mean(sales_data)
median_sales = statistics.median(sales_data)
mode_sales = statistics.mode(sales_data) if len(set(sales_data)) < len(sales_data) else "No mode"
std_dev = statistics.stdev(sales_data)

print(f"📈 Summary Statistics:")
print(f"   Total Sales: ${'{'}total_sales:,{'}'}k")
print(f"   Average Sales: ${'{'}mean_sales:.2f{'}'}k")
print(f"   Median Sales: ${'{'}median_sales{'}'}k")
print(f"   Standard Deviation: ${'{'}std_dev:.2f{'}'}k")
print(f"   Highest Month: {'{'}months[sales_data.index(max(sales_data))]{'}'}  (${'{'}max(sales_data){'}'} k)")
print(f"   Lowest Month: {'{'}months[sales_data.index(min(sales_data))]{'}'}  (${'{'}min(sales_data){'}'} k)")

# Growth analysis
print(f"\\n📊 Monthly Performance:")
for i, (month, sales) in enumerate(zip(months, sales_data)):
    if i > 0:
        growth = ((sales - sales_data[i-1]) / sales_data[i-1]) * 100
        print(f"   {'{'}month{'}'}: ${'{'}sales{'}'}k {'{'}trend{'}'} ({'{'}growth:+.1f{'}'}%)")
    else:
        print(f"   {'{'}month{'}'}: ${'{'}sales{'}'}k (baseline)")
`,
  },
  {
    id: 'classes',
    title: 'Object-Oriented Programming',
    description: 'Learn classes, inheritance, and polymorphism',
    icon: <Code2 className="w-5 h-5" />,
    difficulty: 'advanced',
    category: 'oop',
    code: `# Object-Oriented Programming Example
class Animal:
    """Base class for all animals"""
    def __init__(self, name, species):
        self.name = name
        self.species = species
        self.energy = 100
    
    def speak(self):
        return f"{self.name} makes a sound"
    
    def move(self):
        self.energy -= 10
        return f"{self.name} moves around"
    
    def rest(self):
        self.energy = min(100, self.energy + 20)
        return f"{self.name} is resting"

class Dog(Animal):
    """Dog class inheriting from Animal"""
    def __init__(self, name, breed):
        super().__init__(name, "Canine")
        self.breed = breed
        self.tricks = []
    
    def speak(self):
        return f"{self.name} barks: Woof! Woof!"
    
    def learn_trick(self, trick):
        self.tricks.append(trick)
        return f"{self.name} learned to {trick}!"
    
    def perform_trick(self):
        if self.tricks:
            trick = self.tricks[-1]  # Latest trick
            self.energy -= 5
            return f"{self.name} performs: {trick}! 🎪"
        return f"{self.name} doesn't know any tricks yet"

class Cat(Animal):
    """Cat class inheriting from Animal"""
    def __init__(self, name, color):
        super().__init__(name, "Feline")
        self.color = color
        self.lives = 9
    
    def speak(self):
        return f"{self.name} meows: Meow! 🐱"
    
    def climb(self):
        self.energy -= 15
        return f"{self.name} climbs up high!"

# Create some animals
dog = Dog("Buddy", "Golden Retriever")
cat = Cat("Whiskers", "Orange")

print("🐕 Dog Activities:")
print(dog.speak())
print(dog.learn_trick("sit"))
print(dog.learn_trick("roll over"))
print(dog.perform_trick())
print(f"Energy: {dog.energy}/100")

print("\\n🐱 Cat Activities:")
print(cat.speak())
print(cat.climb())
print(cat.move())
print(f"Energy: {cat.energy}/100")

print("\\n🔄 Polymorphism Demo:")
animals = [dog, cat]
for animal in animals:
    print(f"{animal.name} ({animal.species}): {animal.speak()}")
`,
  },
  {
    id: 'file-handling',
    title: 'File Operations',
    description: 'Working with files and data processing',
    icon: <BookOpen className="w-5 h-5" />,
    difficulty: 'intermediate',
    category: 'file-io',
    code: `# File operations and data processing simulation
import json
from datetime import datetime

# Simulate file operations (since we can't actually write files)
def simulate_file_operations():
    """Simulate common file operations"""
    
    # Sample data to work with
    student_data = [
        {"name": "Alice Johnson", "age": 20, "grade": 85, "major": "Computer Science"},
        {"name": "Bob Smith", "age": 19, "grade": 92, "major": "Mathematics"},
        {"name": "Carol Davis", "age": 21, "grade": 78, "major": "Physics"},
        {"name": "David Wilson", "age": 20, "grade": 88, "major": "Computer Science"},
        {"name": "Eva Brown", "age": 22, "grade": 95, "major": "Mathematics"}
    ]
    
    print("📁 File Operations Simulation")
    print("=" * 35)
    
    # Simulate writing JSON data
    print("✍️  Writing student data to JSON format...")
    json_data = json.dumps(student_data, indent=2)
    print("✅ Data serialized successfully!")
    
    # Simulate reading and processing data
    print("\\n📖 Reading and processing data...")
    
    # Calculate statistics
    total_students = len(student_data)
    average_grade = sum(student["grade"] for student in student_data) / total_students
    average_age = sum(student["age"] for student in student_data) / total_students
    
    # Group by major
    majors = {}
    for student in student_data:
        major = student["major"]
        if major not in majors:
            majors[major] = []
        majors[major].append(student)
    
    print(f"📊 Statistics:")
    print(f"   Total Students: {total_students}")
    print(f"   Average Grade: {average_grade:.1f}%")
    print(f"   Average Age: {average_age:.1f} years")
    
    print(f"\\n📚 Students by Major:")
    for major, students in majors.items():
        avg_grade = sum(s["grade"] for s in students) / len(students)
        print(f"   {major}: {len(students)} students (avg grade: {avg_grade:.1f})")
    
    # Find top performers
    top_student = max(student_data, key=lambda x: x["grade"])
    print(f"\\n🏆 Top Performer: {top_student['name']} ({top_student['grade']}%)")
    
    # Simulate log entry
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] Processed {total_students} student records"
    print(f"\\n📝 Log Entry: {log_entry}")
    
    return student_data

# Run the simulation
data = simulate_file_operations()

print("\\n🔍 Sample JSON Output:")
print(json.dumps(data[0], indent=2))
`,
  }
];

const ExampleSelector = ({ onSelectExample }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'advanced':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'basics':
        return 'bg-blue-500/10 text-blue-400';
      case 'algorithms':
        return 'bg-purple-500/10 text-purple-400';
      case 'data-science':
        return 'bg-emerald-500/10 text-emerald-400';
      case 'oop':
        return 'bg-orange-500/10 text-orange-400';
      case 'file-io':
        return 'bg-pink-500/10 text-pink-400';
      default:
        return 'bg-slate-500/10 text-slate-400';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-2">Code Examples</h3>
        <p className="text-slate-400 text-sm">Click any example to load it into the editor</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="space-y-4"
      >
        {examples.map((example, index) => (
          <motion.button
            key={example.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 30px rgba(16, 185, 129, 0.15)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectExample(example.code)}
            className="group w-full p-5 bg-slate-800/50 hover:bg-slate-700/50 rounded-2xl border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 text-left backdrop-blur-sm"
          >
            <div className="flex items-start space-x-4">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-all duration-300"
              >
                {example.icon}
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white group-hover:text-emerald-300 transition-colors text-lg">
                    {example.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs border capitalize ${getDifficultyColor(example.difficulty)}`}>
                      {example.difficulty}
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors mb-3 leading-relaxed">
                  {example.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(example.category)}`}>
                    {example.category}
                  </span>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="text-emerald-400 text-sm font-medium"
                  >
                    Click to load →
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="text-center pt-4 border-t border-slate-700/50"
      >
        <p className="text-slate-500 text-xs">
          ✨ More examples coming soon!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ExampleSelector;