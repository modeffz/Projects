#include<iostream>
#include<string>
#include <vector>

using namespace std;

class massa {
private:
    vector<int> arr;
public:
    void arrAdd();
    void arrVeiv();
    void menu();

};

void massa::arrAdd() {
    int arrA;

    cout << "Введите число: ";
    cin >> arrA;

    arr.push_back(arrA);
}

void massa::arrVeiv() {
    if (arr.empty()) { 
        cout << "Массив пуст!" << endl;
        return;
    }

    int max = arr[0]; 

    for (int i = 1; i < arr.size(); ++i) {
        if (arr[i] > max) {  
            max = arr[i];
        }
    }

    cout << "Максимальный элемент: " << max << endl;
}

void massa::menu() {
    int choose;
    do {
        cout << "\nВыберите действие:\n";
        cout << "1. Добавить элемент\n";
        cout << "2. Показать максимальный элемент\n";
        cout << "3. Выход\n";
        cout << "Ваш выбор: ";
        cin >> choose;

        switch (choose) {
        case 1:
            arrAdd();
            break;
        case 2:
            arrVeiv();
            break;
        case 3:
            cout << "Выход из программы.\n";
            break;
        default:
            cout << "Неверный выбор, попробуйте снова.\n";
            break;
        }
    } while (choose != 3);
}

int main() {
    massa mas;
    mas.menu(); 

    return 0;
}
