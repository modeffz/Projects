#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <fstream>
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
    void EditInf();
    void Sort();
    void Search();
    void SaveToFile(const string& filename);
    void LoadFromFile(const string& filename);
};

void Employee::SaveToFile(const string& filename) {
    ofstream outFile(filename);

    if (!outFile) {
        cout << "Failed to open file for saving." << endl;
        return;
    }

    for (size_t i = 0; i < name.size(); ++i) {
        outFile << name[i] << " " << surname[i] << " " << age[i] << " " << title[i] << endl;
    }

    outFile.close();
    cout << "Data successfully saved to file." << endl;
}

void Employee::LoadFromFile(const string& filename) {
    ifstream inFile(filename);

    if (!inFile) {
        cout << "Failed to open file for loading." << endl;
        return;
    }

    name.clear();
    surname.clear();
    age.clear();
    title.clear();

    string empName, empSurname, empTitle;
    int empAge;

    while (inFile >> empName >> empSurname >> empAge >> empTitle) {
        name.push_back(empName);
        surname.push_back(empSurname);
        age.push_back(empAge);
        title.push_back(empTitle);
    }

    inFile.close();
    cout << "Data successfully loaded from file." << endl;
}

void Employee::Sort() {
    vector<pair<string, size_t>> Iname;

    for (size_t i = 0; i < name.size(); ++i) {
        Iname.emplace_back(name[i], i);
    }

    sort(Iname.begin(), Iname.end());

    cout << "Employees sorted by name:\n";
    for (const auto& p : Iname) {
        size_t i = p.second;
        cout << surname[i] << " " << name[i] << ", Age: " << age[i] << ", Title: " << title[i] << endl;
    }
}

void Employee::Search() {
    string sname;
    cout << "Enter name to search: ";
    cin >> sname;

    bool found = false;

    for (size_t i = 0; i < name.size(); ++i) {
        if (name[i] == sname) {
            cout << i << ". " << name[i] << " " << surname[i] << " " << age[i] << endl;
            found = true;
        }
    }
    if (!found) {
        cout << "Employee " << sname << " not found." << endl;
    }
}

void Employee::EditInf() {
    size_t editIndex;

    cout << "Enter employee index to edit: ";
    cin >> editIndex;

    if (editIndex < name.size()) {
        cout << "Current Info - Name: " << name[editIndex] 
             << ", Surname: " << surname[editIndex] 
             << ", Age: " << age[editIndex] << endl;

        cout << "Enter new name: ";
        cin >> name[editIndex];
        cout << "Enter new surname: ";
        cin >> surname[editIndex];
        cout << "Enter new age: ";
        cin >> age[editIndex];
    } else {
        cout << "Invalid index!" << endl;
    }
}

void Employee::InputEmployee() {
    string empName, empSurname, empTitle;
    int empAge;

    cout << "Enter employee name: ";
    cin >> empName;
    cout << "Enter employee surname: ";
    cin >> empSurname;
    cout << "Enter employee age: ";
    cin >> empAge;
    cout << "Enter employee title: ";
    cin >> empTitle;

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
    size_t removeIndex;
    cout << "Enter the index of the employee to delete: ";
    cin >> removeIndex;

    if (removeIndex < name.size()) {
        name.erase(name.begin() + removeIndex);
        surname.erase(surname.begin() + removeIndex);
        age.erase(age.begin() + removeIndex);
        title.erase(title.begin() + removeIndex);
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
        cout << "4. Edit employee info\n";
        cout << "5. Search employee\n";
        cout << "6. Sort employees\n";
        cout << "7. Save to file\n";
        cout << "8. Load from file\n";
        cout << "9. Exit\n";
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
                EditInf();
                break;
            case 5:
                Search();
                break;
            case 6:
                Sort();
                break;
            case 7: {
                string filename;
                cout << "Enter filename to save: ";
                cin >> filename;
                SaveToFile(filename);
                break;
            }
            case 8: {
                string filename;
                cout << "Enter filename to load: ";
                cin >> filename;
                LoadFromFile(filename);
                break;
            }
            case 9:
                cout << "Exiting...\n";
                break;
            default:
                cout << "Invalid choice! Try again.\n";
        }
    } while (choice != 9);
}

int main() {
    Employee em;
    em.Menu();
    return 0;
}
