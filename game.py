import pygame
from paddle import Paddle
from ball import Ball
from constants import *

class Game:
    def __init__(self, screen, game_mode):
        self.screen = screen
        self.game_mode = game_mode
        self.player1 = Paddle(20, HEIGHT // 2 - PADDLE_HEIGHT // 2)
        self.player2 = Paddle(WIDTH - 20 - PADDLE_WIDTH, HEIGHT // 2 - PADDLE_HEIGHT // 2)
        self.ball = Ball()
        self.player1_score = 0
        self.player2_score = 0
        self.font = pygame.font.SysFont(None, 74)
        self.clock = pygame.time.Clock()
    
    def draw_score(self):
        player1_text = self.font.render(str(self.player1_score), True, WHITE)
        player2_text = self.font.render(str(self.player2_score), True, WHITE)
        self.screen.blit(player1_text, (WIDTH // 4, 20))
        self.screen.blit(player2_text, (3 * WIDTH // 4 - player2_text.get_width(), 20))
    
    def draw_center_line(self):
        for y in range(0, HEIGHT, 20):
            pygame.draw.rect(self.screen, WHITE, (WIDTH // 2 - 2, y, 4, 10))
    
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    return "menu"
        return None
    
    def update(self):
        # Move paddles
        self.player1.move(pygame.K_w, pygame.K_s)
        if self.game_mode == "1v1":
            self.player2.move(pygame.K_UP, pygame.K_DOWN)
        else:
            self.player2.ai_move(self.ball)
        
        # Move ball and check for scoring
        score = self.ball.move()
        if score == "player1":
            self.player1_score += 1
        elif score == "player2":
            self.player2_score += 1
        
        # Check paddle collisions
        self.ball.check_paddle_collision(self.player1, self.player2)
    
    def draw(self):
        self.screen.fill(BLACK)
        self.draw_center_line()
        self.player1.draw(self.screen)
        self.player2.draw(self.screen)
        self.ball.draw(self.screen)
        self.draw_score()
        pygame.display.flip()
    
    def run(self):
        while True:
            result = self.handle_events()
            if result:
                return result
            
            self.update()
            self.draw()
            self.clock.tick(FPS)
            
            if self.player1_score >= 5:
                return "player1"
            elif self.player2_score >= 5:
                return "player2"
