#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

class Cipher {
public:
    void menu();
    string caesarEncrypt(const string& text, int shift);
    string caesarDecrypt(const string& text, int shift);
    string atbashCipher(const string& text);
};

// Основное меню
void Cipher::menu() {
    int cipherChoice, actionChoice;
    cout << "Выберите шифр:\n1. Шифр Цезаря\n2. Шифр Атбаш\nВыбор: ";
    cin >> cipherChoice;

    cout << "Введите действие:\n1. Зашифровать\n2. Расшифровать\nВыбор: ";
    cin >> actionChoice;

    cin.ignore(); // Очистка буфера
    string message;
    cout << "Введите сообщение: ";
    getline(cin, message);

    if (cipherChoice == 1) { // Шифр Цезаря
        int shift;
        cout << "Введите сдвиг: ";
        cin >> shift;

        if (actionChoice == 1) {
            cout << "Результат: " << caesarEncrypt(message, shift) << endl;
        } else {
            cout << "Результат: " << caesarDecrypt(message, shift) << endl;
        }
    } else if (cipherChoice == 2) { // Шифр Атбаш
        cout << "Результат: " << atbashCipher(message) << endl;
    } else {
        cout << "Неверный выбор!" << endl;
    }
}

// Шифрование Цезаря
string Cipher::caesarEncrypt(const string& text, int shift) {
    string result = text;
    for (char& c : result) {
        if (isalpha(c)) {
            char base = isupper(c) ? 'A' : 'a';
            c = base + (c - base + shift) % 26;
        }
    }
    return result;
}

// Расшифровка Цезаря
string Cipher::caesarDecrypt(const string& text, int shift) {
    string result = text;
    for (char& c : result) {
        if (isalpha(c)) {
            char base = isupper(c) ? 'A' : 'a';
            c = base + (c - base - shift + 26) % 26;
        }
    }
    return result;
}

// Шифр Атбаш
string Cipher::atbashCipher(const string& text) {
    string result = text;
    for (char& c : result) {
        if (isalpha(c)) {
            char base = isupper(c) ? 'A' : 'a';
            c = base + (25 - (c - base));
        }
    }
    return result;
}

int main() {
    Cipher cipher;
    cipher.menu();
    return 0;
}
