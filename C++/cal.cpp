#include <iostream>
using namespace std;

class cal {
    private:
        int a;
    public:
        void call(int a);
        void calIn();
};

void cal::calIn() {
    cout << "Введите число: ";
    cin >> a;
    call(a);
}

void cal::call(int num) {
    cout << "Таблица умножения для " << num << ":\n";
    for(int i = 1; i <= 10; ++i) {
        int b = num * i;
        cout << num << " * " << i << " = " << b << endl;
    }
}

int main() {
    cal calculator;
    calculator.calIn();
    return 0;
}
