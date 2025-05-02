import pygame
from constants import *

class Paddle:
    def __init__(self, x, y):
        self.rect = pygame.Rect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.speed = 7
    
    def move(self, up_key, down_key):
        keys = pygame.key.get_pressed()
        if keys[up_key] and self.rect.top > 0:
            self.rect.y -= self.speed
        if keys[down_key] and self.rect.bottom < HEIGHT:
            self.rect.y += self.speed
    
    def ai_move(self, ball):
        # Simple AI: follow the ball with some delay
        if self.rect.centery < ball.rect.centery - 20 and self.rect.bottom < HEIGHT:
            self.rect.y += self.speed * 0.7
        elif self.rect.centery > ball.rect.centery + 20 and self.rect.top > 0:
            self.rect.y -= self.speed * 0.7
    
    def draw(self, screen):
        pygame.draw.rect(screen, WHITE, self.rect)
