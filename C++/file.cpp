#include <iostream>
#include <fstream>
#include <string>

using namespace std;

int main() {
    fstream file("file.txt", ios::out);

    if (!file) {
        cerr << "Ошибка открытия файла!\n";
        return 1;
    }

    string name;
    int age;
    float average;

    cout << "\nИмя: ";
    cin >> name;
    cout << "\nВозраст: ";
    cin >> age;
    cout << "\nСредний балл: ";
    cin >> average;

    file << name << endl;
    file << age << endl;
    file << average << endl;

    file.close();

    cout << "\nДанные записаны в файл.\n";
    return 0;
}

