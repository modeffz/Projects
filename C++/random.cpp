#include <iostream>
#include <vector>
#include <string>
#include <ctime> 

using namespace std;

class O {
private:
    vector<string> W;
    size_t A = 0;     

public:
    void answer();   
    void menu();     
    void random();   
};

void O::menu() {
    string question;
    
    do {
        cout << "\nEnter a question: ";
        cin.ignore();
        getline(cin,question); 
        W.push_back(question); 
        answer();

    } while (A != 3);
}

void O::random() {
    A = rand() % 2;
}

void O::answer() {
    random(); 
    if (A > 0) {
        cout << "\nYes";
    } else {
        cout << "\nNo";
    }
}

int main() {
    srand(static_cast<unsigned int>(time(0)));
    
    O obj;
    obj.menu(); 
    return 0;
}
