#include <iostream>
#include <string>

using namespace std;

struct Person {
    string Name;
    int Age;
    string Status;
    bool HasPass;
};

bool Ent(Person user, int currentHour) {
    if (user.Status == "visitor") {
        if (currentHour >= 9 && currentHour <= 18 && user.Age >= 18 && user.HasPass) {
            return true;
        } else {
            return false;
        }
    } 
    else if (user.Status == "employee") {
        if (currentHour >= 8 && currentHour <= 20 && user.HasPass) {
            return true;
        } else {
            return false;
        }
    } 
    else if (user.Status == "admin") {
        return true;
    } 

    return false;
}

int main() {
    Person user1 = {"Alice", 25, "visitor", true};
    Person user2 = {"Bob", 17, "employee", true};
    Person user3 = {"Charlie", 30, "admin", false};

    cout << "Alice can enter: " << Ent(user1, 2) << endl;
    cout << "Bob can enter: " << Ent(user2, 4) << endl;
    cout << "Charlie can enter: " << Ent(user3, 3) << endl;

    return 0;
}
