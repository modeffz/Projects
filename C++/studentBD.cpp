#include <iostream>
#include <string>
using namespace std;

class student {
private:
    string name[5];
    int age[5];
    float mark[5];

public:
    void inputStudentData();
    void displayStudentData(); 
};

void student::inputStudentData() {
    for (int i = 0; i < 5; ++i) {
        cout << "Enter name for student " << (i + 1) << ": ";
        cin >> name[i];
        cout << "Enter age for student " << (i + 1) << ": ";
        cin >> age[i];
        cout << "Enter mark for student " << (i + 1) << ": ";
        cin >> mark[i];
    }
}
void student::displayStudentData(){
    cout << "Student data:\n";
    for (int i=0;i<5;i++){
        cout << "Name:" << name[i] << " " << "Age: " << age[i] << " " << "Mark: " << mark[i] << endl;
    }
}

int main() {
    student st;
    st.inputStudentData();
    st.displayStudentData();
    return 0;
}