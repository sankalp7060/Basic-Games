import tkinter as tk
import random
from tkinter import messagebox

player_score = 0
computer_score = 0
ties = 0

def determine_winner(player_selection):
    global player_score, computer_score, ties
    
    options = ['rock', 'paper', 'scissors']
    computer_selection = random.choice(options)
    
    game_result = ""

    if player_selection == computer_selection:
        game_result = "It's a Tie!"
        ties += 1
    elif (player_selection == 'rock' and computer_selection == 'scissors') or \
         (player_selection == 'paper' and computer_selection == 'rock') or \
         (player_selection == 'scissors' and computer_selection == 'paper'):
        game_result = "You Win!"
        player_score += 1
    else:
        game_result = "Computer Wins!"
        computer_score += 1
    
    result_label.config(text=f"Computer chose: {computer_selection}\n{game_result}")
    score_label.config(text=f"Player Score: {player_score}  |  Computer Score: {computer_score}  |  Ties: {ties}")

def reset_game():
    global player_score, computer_score, ties
    player_score = 0
    computer_score = 0
    ties = 0
    
    result_label.config(text="")
    score_label.config(text="Player Score: 0  |  Computer Score: 0  |  Ties: 0")

def show_instructions():
    instructions_text = (
        "Welcome to Rock, Paper, Scissors!\n\n"
        "Choose Rock, Paper, or Scissors to play.\n"
        "The system will randomly select one, and the winner is determined as follows:\n"
        "- Rock beats Scissors\n"
        "- Scissors beats Paper\n"
        "- Paper beats Rock\n\n"
        "The game keeps track of your score and the computer's score."
    )
    messagebox.showinfo("Instructions", instructions_text)

def on_exit():
    exit_confirmation = messagebox.askyesno("Exit Game", "Are you sure you want to exit?")
    if exit_confirmation:
        root.quit()

root = tk.Tk()
root.title("Rock, Paper, Scissors Game")
root.geometry("500x400")
root.config(bg="#f0f0f0")

font_style = ("Arial", 14)

rock_button = tk.Button(root, text="Rock", width=20, height=2, font=font_style, command=lambda: determine_winner('rock'))
rock_button.pack(pady=10)

paper_button = tk.Button(root, text="Paper", width=20, height=2, font=font_style, command=lambda: determine_winner('paper'))
paper_button.pack(pady=10)

scissors_button = tk.Button(root, text="Scissors", width=20, height=2, font=font_style, command=lambda: determine_winner('scissors'))
scissors_button.pack(pady=10)

result_label = tk.Label(root, text="", font=("Arial", 16), bg="#f0f0f0")
result_label.pack(pady=20)

score_label = tk.Label(root, text="Player Score: 0  |  Computer Score: 0  |  Ties: 0", font=("Arial", 12), bg="#f0f0f0")
score_label.pack(pady=10)

reset_button = tk.Button(root, text="Reset Game", width=20, height=2, font=font_style, command=reset_game)
reset_button.pack(pady=10)

instructions_button = tk.Button(root, text="Instructions", width=20, height=2, font=font_style, command=show_instructions)
instructions_button.pack(pady=10)

exit_button = tk.Button(root, text="Exit", width=20, height=2, font=font_style, command=on_exit)
exit_button.pack(pady=10)

root.mainloop()
