#include<iostream>
#include<string>
#include <vector>

using namespace std;

class fact {
    private:
    int us;
    long long answer;
    public:
    void menu();
    void mat();
};

void fact::mat(){
    answer = 1;
    for(int i = 1; i <= us; ++i){
        answer *= i;
    }

    cout << "\nОтвет: " << answer;
}

void fact::menu(){
    cout << "Введите число: ";
    cin >> us;
    if(us < 0) {
        cout << "Факториал отрицательного числа не существует!";
    } else {
        mat();
    }
}

int main(){
    fact f;
    f.menu();
}
