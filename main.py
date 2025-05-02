import pygame
import sys
from menu import show_menu, show_game_over
from game import Game
from constants import *

def main():
    # Initialize pygame
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Pong")
    
    while True:
        # Show menu and get game mode
        game_mode = show_menu(screen)
        
        # Create and run game
        game = Game(screen, game_mode)
        winner = game.run()
        
        # Show game over screen
        show_game_over(screen, winner, game_mode)

if __name__ == "__main__":
    main()
