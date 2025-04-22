#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <ctime> 

using namespace std;

class sortMain {
private:
    int user;
    vector<int> numb;

public:
    void sort();
    void menu();
    void result();
    void random();
};

void sortMain::menu() {
    string input;
    cout << "Введите количество случайных чисел: ";
    cin >> user;

    random();
}

void sortMain::random() {
    for (int i = 0; i < user; ++i) {
        numb.push_back(rand() % 100);
    }
    sort();
}

void sortMain::sort(){
    int n;
    vector<int> Sort;
    for(long long int i=0;i<numb.size();++i){
        Sort.push_back(numb[i]);
        n = numb[i];
    }
    std::sort(Sort.begin(), Sort.end());
    cout << Sort[0] << " " << n;
    cout << endl;
}

int main() {
    srand(static_cast<unsigned int>(time(0)));
    sortMain sorter;
    sorter.menu();
    return 0;
}
