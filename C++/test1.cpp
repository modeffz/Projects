#include <cstdlib> // Для функции system
#include <iostream>

int main()
{
    // Выполняем команду в терминале
    int result = system("ls -l"); // Например, команда для вывода списка файлов в каталоге

    // Проверяем результат выполнения команды
    if (result == 0)
    {
        std::cout << "Команда выполнена успешно." << std::endl;
    }
    else
    {
        std::cout << "Произошла ошибка при выполнении команды." << std::endl;
    }

    return 0;
}
