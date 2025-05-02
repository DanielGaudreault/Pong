import pygame
import sys
from constants import *

def show_menu(screen):
    title_font = pygame.font.SysFont(None, 100)
    menu_font = pygame.font.SysFont(None, 50)
    
    title_text = title_font.render("PONG", True, WHITE)
    mode1_text = menu_font.render("1. 1 vs 1", True, WHITE)
    mode2_text = menu_font.render("2. 1 vs AI", True, WHITE)
    instruction_text = menu_font.render("Press 1 or 2 to select mode", True, WHITE)
    
    screen.fill(BLACK)
    screen.blit(title_text, (WIDTH // 2 - title_text.get_width() // 2, 100))
    screen.blit(mode1_text, (WIDTH // 2 - mode1_text.get_width() // 2, 250))
    screen.blit(mode2_text, (WIDTH // 2 - mode2_text.get_width() // 2, 320))
    screen.blit(instruction_text, (WIDTH // 2 - instruction_text.get_width() // 2, 450))
    
    pygame.display.flip()
    
    waiting = True
    while waiting:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_1:
                    return "1v1"
                elif event.key == pygame.K_2:
                    return "1vAI"

def show_game_over(screen, winner, game_mode):
    game_over_font = pygame.font.SysFont(None, 100)
    instruction_font = pygame.font.SysFont(None, 50)
    
    if winner == "player1":
        winner_text = game_over_font.render("Player 1 Wins!", True, WHITE)
    elif winner == "player2":
        if game_mode == "1v1":
            winner_text = game_over_font.render("Player 2 Wins!", True, WHITE)
        else:
            winner_text = game_over_font.render("AI Wins!", True, WHITE)
    
    instruction_text = instruction_font.render("Press ESC to return to menu", True, WHITE)
    
    screen.fill(BLACK)
    screen.blit(winner_text, (WIDTH // 2 - winner_text.get_width() // 2, HEIGHT // 2 - 50))
    screen.blit(instruction_text, (WIDTH // 2 - instruction_text.get_width() // 2, HEIGHT // 2 + 50))
    
    pygame.display.flip()
    
    waiting = True
    while waiting:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    waiting = False
