#include <iostream>
#include <string>

using namespace std;

string encrypt(const string& text, int shift) {
    string encrypted = "";

    for (char c : text) {
        if (isupper(c)) {
            // Сдвиг для заглавных букв
            encrypted += 'A' + (c - 'A' + shift) % 26;
        } else if (islower(c)) {
            // Сдвиг для строчных букв
            encrypted += 'a' + (c - 'a' + shift) % 26;
        } else {
            // Неизменные символы
            encrypted += c;
        }
    }
    
    return encrypted;
}

int main() {
    string message;
    int shift;

    cout << "Введите сообщение: ";
    getline(cin, message);
    cout << "Введите значение сдвига: ";
    cin >> shift;

    string encryptedMessage = encrypt(message, shift);
    cout << "Зашифрованное сообщение: " << encryptedMessage << endl;

    return 0;
}
 