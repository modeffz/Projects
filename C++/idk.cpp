#include <SFML/Audio.hpp>
#include <SFML/Graphics.hpp>

class Player {
private:
    sf::RectangleShape shape;
    float velocityY = 0;
    bool isJumping = false;
    const float gravity = 0.5f;
    const float jumpForce = -10.0f;
    const float moveSpeed = 5.0f;

public:
    Player() {
        shape.setSize(sf::Vector2f(50, 50));
        shape.setFillColor(sf::Color::Red);
        shape.setPosition(sf::Vector2f(400, 300));
    }

    void update() {
        // Гравитация
        velocityY += gravity;
        shape.move(sf::Vector2f(0, velocityY));

        // Ограничение по нижней границе экрана
        if (shape.getPosition().y > 500) {
            shape.setPosition(sf::Vector2f(shape.getPosition().x, 500));
            velocityY = 0;
            isJumping = false;
        }
    }

    void handleInput() {
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Key::Space) && !isJumping) {
            velocityY = jumpForce;
            isJumping = true;
        }
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Key::Left)) {
            shape.move(sf::Vector2f(-moveSpeed, 0));
        }
        if (sf::Keyboard::isKeyPressed(sf::Keyboard::Key::Right)) {
            shape.move(sf::Vector2f(moveSpeed, 0));
        }
    }

    void draw(sf::RenderWindow& window) {
        window.draw(shape);
    }
};

int main() {
    // Создаем окно
    sf::RenderWindow window(sf::VideoMode({800, 600}), "Platformer");
    window.setFramerateLimit(60);

    // Создаем игрока
    Player player;

    // Игровой цикл
    while (window.isOpen()) {
        // Обработка событий
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed)
                window.close();
        }

        // Обновление
        player.handleInput();
        player.update();

        // Отрисовка
        window.clear(sf::Color::Black);
        player.draw(window);
        window.display();
    }

    return 0;
}