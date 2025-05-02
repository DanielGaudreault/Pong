import pygame
import sys
import random
import time

# Initialize pygame
pygame.init()

# Constants
WIDTH, HEIGHT = 800, 600
PADDLE_WIDTH, PADDLE_HEIGHT = 15, 100
BALL_SIZE = 15
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
FPS = 60

# Game variables
player1_score = 0
player2_score = 0
game_mode = None  # Will be set to "1v1" or "1vAI"

# Create the screen
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Pong")
clock = pygame.time.Clock()

# Font
font = pygame.font.SysFont(None, 74)

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
    
    def draw(self):
        pygame.draw.rect(screen, WHITE, self.rect)

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
        
        # Ball collision with paddles
        if self.rect.colliderect(player1.rect) or self.rect.colliderect(player2.rect):
            self.dx *= -1.1  # Increase speed slightly on each hit
            self.dy *= 1.1
        
        # Ball out of bounds
        if self.rect.left <= 0:
            self.reset()
            return "player2"
        if self.rect.right >= WIDTH:
            self.reset()
            return "player1"
        return None
    
    def draw(self):
        pygame.draw.rect(screen, WHITE, self.rect)

# Create game objects
player1 = Paddle(20, HEIGHT // 2 - PADDLE_HEIGHT // 2)
player2 = Paddle(WIDTH - 20 - PADDLE_WIDTH, HEIGHT // 2 - PADDLE_HEIGHT // 2)
ball = Ball()

def draw_score():
    player1_text = font.render(str(player1_score), True, WHITE)
    player2_text = font.render(str(player2_score), True, WHITE)
    screen.blit(player1_text, (WIDTH // 4, 20))
    screen.blit(player2_text, (3 * WIDTH // 4 - player2_text.get_width(), 20))

def draw_center_line():
    for y in range(0, HEIGHT, 20):
        pygame.draw.rect(screen, WHITE, (WIDTH // 2 - 2, y, 4, 10))

def show_menu():
    global game_mode
    
    title_font = pygame.font.SysFont(None, 100)
    menu_font = pygame.font.SysFont(None, 50)
    
    title_text = title_font.render("PONG", True, WHITE)
    mode1_text = menu_font.render("1. 1 vs 1", True, WHITE)
    mode2_text = menu_font.render("2. 1 vs AI", True, WHITE)
    instruction_text = menu_font.render("Press 1 or 2 to select mode", True, WHITE)
    
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
                    game_mode = "1v1"
                    waiting = False
                elif event.key == pygame.K_2:
                    game_mode = "1vAI"
                    waiting = False

def game_loop():
    global player1_score, player2_score
    
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    return "menu"
        
        # Move paddles
        player1.move(pygame.K_w, pygame.K_s)
        if game_mode == "1v1":
            player2.move(pygame.K_UP, pygame.K_DOWN)
        else:
            player2.ai_move(ball)
        
        # Move ball and check for scoring
        score = ball.move()
        if score == "player1":
            player1_score += 1
        elif score == "player2":
            player2_score += 1
        
        # Drawing
        screen.fill(BLACK)
        draw_center_line()
        player1.draw()
        player2.draw()
        ball.draw()
        draw_score()
        
        pygame.display.flip()
        clock.tick(FPS)

def show_game_over(winner):
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

def main():
    global player1_score, player2_score, game_mode
    
    while True:
        player1_score = 0
        player2_score = 0
        
        show_menu()
        result = game_loop()
        
        if player1_score >= 5:
            show_game_over("player1")
        elif player2_score >= 5:
            show_game_over("player2")
        else:
            continue

if __name__ == "__main__":
    main()
