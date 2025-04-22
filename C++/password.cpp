#include <iostream>
#include <zip.h>
#include <string>
#include <vector>
#include <chrono>
#include <thread>

using namespace std;

// Функция для попытки открытия архива с паролем
bool tryPassword(const string &archivePath, const string &password)
{
    int err = 0;
    zip_t *archive = zip_open(archivePath.c_str(), ZIP_RDONLY, &err);

    if (archive == nullptr)
    {
        cerr << "Ошибка открытия архива: " << archivePath << endl;
        return false;
    }

    // Попробуем установить пароль
    if (zip_set_default_password(archive, password.c_str()) != 0)
    {
        zip_close(archive);
        return false;
    }

    // Попробуем открыть файл внутри архива
    zip_file_t *file = zip_fopen_index(archive, 0, 0); // Откроем первый файл в архиве
    if (file)
    {
        zip_fclose(file);
        zip_close(archive);
        return true; // Пароль подошел
    }

    zip_close(archive);
    return false;
}

// Функция для генерации всех комбинаций паролей заданной длины
void generatePasswords(const string &archivePath, const string &charset, string &currentPassword, int maxLength, bool &found)
{
    if (static_cast<int>(currentPassword.length()) == maxLength)
    {
        return; // Достигли максимальной длины
    }

    for (char c : charset)
    {
        if (found)
            return;

        currentPassword.push_back(c);

        if (tryPassword(archivePath, currentPassword))
        {
            cout << "Найден пароль: " << currentPassword << endl;
            found = true;
            return;
        }
        else
        {
            cout << "Не подошел пароль: " << currentPassword << endl;
        }

        generatePasswords(archivePath, charset, currentPassword, maxLength, found);
        currentPassword.pop_back();
    }
}

int main()
{
    string archivePath = "/home/modeffz/Видео/1.zip";        // Путь к вашему архиву
    string charset = "abcdefghijklmnopqrstuvwxyz0123456789"; // Набор символов для перебора
    std::string::size_type maxLength = 4;                    // Максимальная длина пароля

    string currentPassword;
    bool found = false;

    generatePasswords(archivePath, charset, currentPassword, maxLength, found);

    if (!found)
    {
        cout << "Пароль не найден." << endl;
    }

    return 0;
}
