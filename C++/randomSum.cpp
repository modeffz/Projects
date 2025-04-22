#include <iostream>
#include <vector>
#include <cstdlib> 
#include <ctime>  

using namespace std;

class rSum {
private:
    int sUser;
    vector<int> summ;

public:
    void menu();
    void generateRandomNumbers(); 
    void calculateSum();
    void calculateAverage();
};

void rSum::menu() {
    cout << "Введите количество случайных чисел: ";
    cin >> sUser;

    generateRandomNumbers();
    calculateSum();
    calculateAverage();
}

void rSum::generateRandomNumbers() {
    summ.clear();
    for (int i = 0; i < sUser; ++i) {
        summ.push_back(rand() % 100);
    }
}

void rSum::calculateSum() {
    int summa = 0;
    for (size_t i = 0; i < summ.size(); ++i) {
        summa += summ[i];
    }
    cout << "Сумма сгенерированных случайных чисел: " << summa << endl;
}

void rSum::calculateAverage() {
    if (sUser > 0) {
        int summa = 0;
        for (size_t i = 0; i < summ.size(); ++i) {
            summa += summ[i];
        }
        double average = static_cast<double>(summa) / sUser;
        cout << "Среднее значение сгенерированных случайных чисел: " << average << endl;
    } else {
        cout << "Количество случайных чисел должно быть больше 0." << endl;
    }
}

int main() {
    srand(static_cast<unsigned int>(time(0)));
    rSum randomSum;
    randomSum.menu();
    return 0;
}
