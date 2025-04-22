#include <iostream>
#include <stdlib.h>
#include <time.h> 
#include <iostream>
#include <stdio.h>

using namespace std;

class game
{
private:
    int pnuber;
    int randomN = 0;
    int live;
public:
    void difficult();
    void easy();
    void medium();
    void hard();
};

void game::difficult(){

    int choose;

    

    do{
        cout << " 1.Easy\n 2.Medium\n 3.Hard\n Choose difficult: ";
        cin >> choose;

        switch (choose)
        {
        case 1:
            easy();
            live = 0;
            break;
        case 2:
            medium();
            live = 0;
            break;
        case 3:
            hard();
            live = 0;
            break;
        case 4:
            cout << "Exit...";
            break;
        default:
            break;
        }

    }while(choose != 4);
}

void game::easy(){
    srand(time(0));
    randomN = rand() % 50;
    do{
        
        cout << "Nubmer: ";
        cin >> pnuber;
        live++;

        if(pnuber < randomN){
            cout << "Yoyr number small";
        }
        if(pnuber > randomN){
            cout << "Yoyr number big";
        }

    }while(pnuber != randomN && live <=10);

    if(pnuber == randomN){
        cout << "You win!\n";
    }
    else{
        cout << "You loses\n";
    }
}

void game::medium(){
    srand(time(0));
    randomN = rand() % 100;
    do{
        
        cout << "Nubmer: ";
        cin >> pnuber;
        live++;

        if(pnuber < randomN){
            cout << "Yoyr number small";
        }
        if(pnuber > randomN){
            cout << "Yoyr number big";
        }

    }while(pnuber != randomN && live <=7);

    if(pnuber == randomN){
        cout << "You win!\n";
    }
    else{
        cout << "You loses\n";
    }
}

void game::hard(){
    srand(time(0));
    randomN = rand() % 500;
    do{
        
        cout << "Nubmer: ";
        cin >> pnuber;
        live++;

        if(pnuber < randomN){
            cout << "Yoyr number small";
        }
        if(pnuber > randomN){
            cout << "Yoyr number big";
        }
        
    }while(pnuber != randomN && live <=5);

    if(pnuber == randomN){
        cout << "You win!\n";
    }
    else{
        cout << "You loses\n";
    }
}

int main(){
    game g;

    g.difficult();

    return 0;
}