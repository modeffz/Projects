#include<iostream>
#include<vector>
#include<string>
#include<algorithm>
using namespace std;

class poli{
    private:
    string user;
    public:
    void menu();
    void check();
};

void poli::menu(){
    string question;
    cout << "Введите слово для проверки: ";
    cin.ignore();
        getline(cin, question); 
        user = question; 
    check();
}

void poli::check(){
    string check;
    check = user;
    reverse(check.begin(), check.end());
    if(check == user){
        cout << "true";
    }
    else{
        cout << "false";
    }
}

int main(){
    poli p;
    p.menu();
}