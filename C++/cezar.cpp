#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

class Cezar {
private:
    string message;
    int shift;      
public:
    void shifr(); 
    void unshif(); 
    void menu();   
};

void Cezar::shifr() {
    cout << "Введите сообщение для шифрования: ";
    cin.ignore();
    getline(cin, message);

    cout << "Введите значение сдвига (1-25): ";
    cin >> shift;

    string encrypted = "";
    for (char c : message) {
        if (isupper(c)) {
            encrypted += 'A' + (c - 'A' + shift) % 26;
        } else if (islower(c)) {
            encrypted += 'a' + (c - 'a' + shift) % 26;
        } else {
            encrypted += c;
        }
    }
    
    cout << "Зашифрованное сообщение: " << encrypted << endl;
}

void Cezar::unshif() {
    cout << "Введите сообщение для расшифрования: ";
    cin.ignore();
    getline(cin, message);

    cout << "Введите значение сдвига (1-25): ";
    cin >> shift;

    string decrypted = "";
    for (char c : message) {
        if (isupper(c)) {
            decrypted += 'A' + (c - 'A' - shift + 26) % 26;
        } else if (islower(c)) {
            decrypted += 'a' + (c - 'a' - shift + 26) % 26;
        } else {
            decrypted += c;
        }
    }

    cout << "Расшифрованное сообщение: " << decrypted << endl;
}

void Cezar::menu() {
    int choise;
    do {
        cout << "1. Зашифровать\n2. Расшифровать\n3. Выйти\nВыберите действие: ";
        cin >> choise;
        switch (choise) {
            case 1:
                shifr();
                break;
            case 2:
                unshif();
                break;
            case 3:
                cout << "Exiting...\n";
                break;
            default:
                cout << "Неверный выбор. Попробуйте еще раз.\n";
        }
    } while (choise != 3);
}

int main() {
    Cezar C;
    C.menu();
    return 0;
}
