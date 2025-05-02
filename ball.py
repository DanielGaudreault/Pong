import pygame
import random
from constants import *

class Ball:
    def __init__(self):
        self.reset()
        self.rect = pygame.Rect(WIDTH // 2 - BALL_SIZE // 2, HEIGHT // 2 - BALL_SIZE // 2, BALL_SIZE, BALL_SIZE)
    
    def reset(self):
        self.rect.x = WIDTH // 2 - BALL_SIZE // 2
        self.rect.y = HEIGHT // 2 - BALL_SIZE // 2
        self.dx = 5 * random.choice((1, -1))
        self.dy = 5 * random.choice((1, -1))
        self.speed = 5
    
    def move(self):
        self.rect.x += self.dx
        self.rect.y += self.dy
        
        # Ball collision with top and bottom
        if self.rect.top <= 0 or self.rect.bottom >= HEIGHT:
            self.dy *= -1
        
        # Ball out of bounds
        if self.rect.left <= 0:
            self.reset()
            return "player2"
        if self.rect.right >= WIDTH:
            self.reset()
            return "player1"
        return None
    
    def check_paddle_collision(self, paddle1, paddle2):
        if self.rect.colliderect(paddle1.rect) or self.rect.colliderect(paddle2.rect):
            self.dx *= -1.1  # Increase speed slightly on each hit
            self.dy *= 1.1
    
    def draw(self, screen):
        pygame.draw.rect(screen, WHITE, self.rect)
