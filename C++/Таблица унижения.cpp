#include <iostream>
using namespace std;

class cal {
    private:
        int a;
    public:
        void call(int a);  // метод для вывода таблицы
        void calIn();      // метод для ввода числа
};

// Определение методов класса за пределами класса
void cal::calIn() {
    int num;
    cout << "Введите число: ";
    cin >> num;
    call(num);
}

void cal::call(int a) {
    cout << "Таблица умножения для " << a << ":\n";
    for(int i = 1; i <= 10; ++i) {
        int b = a * i;
        cout << a << " * " << i << " = " << b << endl;
    }
}

int main() {
    cal calculator;  // создаем объект класса cal
    calculator.calIn();  // вызываем метод для ввода числа и вывода таблицы умножения
    return 0;
}