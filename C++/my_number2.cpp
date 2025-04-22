#include <iostream>
#include <cstdlib> 
#include <ctime>    

using namespace std;

class Game {
private:
    int userNumber; 
    int randomNumber; 
    int lives; 

public:
    void difficult();
    void play(int maxNumber, int maxAttempts);
};

void Game::difficult() {
    int choice;
    do {
        cout << "Выберите уровень сложности:\n";
        cout << "1. Легкий (Число от 1 до 50, 10 попыток)\n";
        cout << "2. Средний (Число от 1 до 100, 7 попыток)\n";
        cout << "3. Тяжелый (Число от 1 до 500, 5 попыток)\n";
        cout << "4. Выход\n";
        cout << "Ваш выбор: ";
        cin >> choice;

        switch (choice) {
            case 1:
                play(50, 10); 
                break;
            case 2:
                play(100, 7);
                break;
            case 3:
                play(500, 5); 
                break;
            case 4:
                cout << "Выход из игры...\n";
                break;
            default:
                cout << "Некорректный выбор. Попробуйте снова.\n";
        }

    } while (choice != 4);
}

void Game::play(int maxNumber, int maxAttempts) {
    srand(static_cast<unsigned int>(time(0))); // Инициализация случайного числа
    randomNumber = rand() % maxNumber + 1;

    lives = 0;
    do {
        cout << "Введите число: ";
        cin >> userNumber;
        lives++;

        if (userNumber < randomNumber) {
            cout << "Ваше число меньше загаданного.\n";
        } else if (userNumber > randomNumber) {
            cout << "Ваше число больше загаданного.\n";
        }

    } while (userNumber != randomNumber && lives < maxAttempts);

    // Проверка на победу или поражение
    if (userNumber == randomNumber) {
        cout << "Поздравляем! Вы угадали число за " << lives << " попыток.\n";
    } else {
        cout << "Вы проиграли. Загаданное число было: " << randomNumber << endl;
    }
}

int main() {
    Game game;
    game.difficult();
    return 0;
}
