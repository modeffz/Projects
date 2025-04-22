#include <iostream>
#include <string>
#include <vector>
using namespace std;

class Employee {
private:
    vector<string> name;
    vector<string> surname;
    vector<int> age;
    vector<string> title;

public:
    void InputEmployee();
    void DeleteEmp();
    void List();
    void Menu();
};

void Employee::InputEmployee() {
    string empName, empSurname, empTitle;
    int empAge;

    cout << "Enter your name: ";
    cin >> empName;
    cout << "Enter your surname: ";
    cin >> empSurname;
    cout << "Enter your age: ";
    cin >> empAge;
    cout << "Enter your title: ";
    cin >> empTitle;

    // Добавляем информацию в соответствующие вектора
    name.push_back(empName);
    surname.push_back(empSurname);
    age.push_back(empAge);
    title.push_back(empTitle);

    cout << "Employee added successfully!\n";
}

void Employee::List() {
    if (name.empty()) {
        cout << "No employees available.\n";
        return;
    }
    for (size_t i = 0; i < name.size(); ++i) {
        cout << i << ". " << surname[i] << " " << name[i] << ", Age: " << age[i] << ", Title: " << title[i] << endl;
    }
}

void Employee::DeleteEmp() {
    int remove;
    cout << "Enter the index of the employee to delete: ";
    cin >> remove;

    if (remove >= 0 && remove < name.size()) {
        name.erase(name.begin() + remove);
        surname.erase(surname.begin() + remove);
        age.erase(age.begin() + remove);
        title.erase(title.begin() + remove);
        cout << "Employee removed successfully.\n";
    } else {
        cout << "Invalid index!\n";
    }
}

void Employee::Menu() {
    int choice;
    do {
        cout << "\nChoose an action:\n";
        cout << "1. Add employee\n";
        cout << "2. List employees\n";
        cout << "3. Delete employee\n";
        cout << "4. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1:
                InputEmployee();
                break;
            case 2:
                List();
                break;
            case 3:
                DeleteEmp();
                break;
            case 4:
                cout << "Exiting...\n";
                break;
            default:
                cout << "Invalid choice! Try again.\n";
        }
    } while (choice != 4);
}

int main() {
    Employee em;
    em.Menu();
    return 0;
}
