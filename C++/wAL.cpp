#include <windows.h>
#include <wininet.h>
#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>
#include <vector>

#pragma comment(lib, "wininet.lib")

class Setup
{
public:
    // Метод для скачивания файла
    bool Download(const std::string &url, const std::string &destination)
    {
        HINTERNET hInternet = InternetOpenA("Downloader", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
        if (!hInternet)
        {
            std::cerr << "Не удалось инициализировать WinINet." << std::endl;
            return false;
        }

        HINTERNET hConnect = InternetOpenUrlA(hInternet, url.c_str(), NULL, 0, INTERNET_FLAG_RELOAD, 0);
        if (!hConnect)
        {
            std::cerr << "Ошибка при открытии URL: " << GetLastError() << std::endl;
            InternetCloseHandle(hInternet);
            return false;
        }

        std::ofstream outFile(destination, std::ios::binary);
        if (!outFile.is_open())
        {
            std::cerr << "Не удалось открыть файл для записи: " << destination << std::endl;
            InternetCloseHandle(hConnect);
            InternetCloseHandle(hInternet);
            return false;
        }

        char buffer[4096];
        DWORD bytesRead;
        while (InternetReadFile(hConnect, buffer, sizeof(buffer), &bytesRead) && bytesRead > 0)
        {
            outFile.write(buffer, bytesRead);
        }

        outFile.close();
        InternetCloseHandle(hConnect);
        InternetCloseHandle(hInternet);

        std::cout << "Файл успешно скачан: " << destination << std::endl;
        return true;
    }

    // Метод для перемещения файла в указанную директорию
    bool MoveFileToDirectory(const std::string &source, const std::string &targetDirectory)
    {
        std::string targetPath = targetDirectory + "\\" + std::filesystem::path(source).filename().string();

        if (std::filesystem::exists(targetPath))
        {
            std::cerr << "Файл уже существует в целевой директории: " << targetPath << std::endl;
            return false;
        }

        try
        {
            std::filesystem::rename(source, targetPath);
            std::cout << "Файл перемещён в: " << targetPath << std::endl;
            return true;
        }
        catch (const std::filesystem::filesystem_error &e)
        {
            std::cerr << "Ошибка при перемещении файла: " << e.what() << std::endl;
            return false;
        }
    }

    // Метод для добавления программы в автозагрузку
    void AddToStartup(const std::string &filePath)
    {
        HKEY hKey;
        if (RegOpenKeyExA(HKEY_CURRENT_USER, "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", 0, KEY_SET_VALUE, &hKey) == ERROR_SUCCESS)
        {
            RegSetValueExA(hKey, "MyProgram", 0, REG_SZ, (const BYTE *)filePath.c_str(), filePath.size() + 1);
            RegCloseKey(hKey);
            std::cout << "Программа добавлена в автозагрузку." << std::endl;
        }
        else
        {
            std::cerr << "Не удалось открыть реестр." << std::endl;
        }
    }
};

int main()
{
    using namespace std; // Ограничиваем область видимости для стандартного пространства имен

    Setup mySetup;

    // URL и целевые пути для скачивания
    vector<pair<string, string>> filesToDownload = {
        {"http://example.com/file1.exe", "C:\\Users\\User\\Downloads\\file1.exe"}, // Замените на URL и путь
        {"http://example.com/file2.exe", "C:\\Users\\User\\Downloads\\file2.exe"}, // Замените на URL и путь
        {"http://example.com/file3.exe", "C:\\Users\\User\\Downloads\\file3.exe"}  // Замените на URL и путь
    };

    string targetDirectory = "C:\\Path\\To\\Target\\Directory"; // Замените на целевую директорию

    // Скачивание и перемещение файлов
    for (const auto &[url, destination] : filesToDownload)
    {
        if (mySetup.Download(url, destination))
        {
            mySetup.MoveFileToDirectory(destination, targetDirectory);
        }
    }

    // Добавление одного из файлов в автозагрузку (например, первого файла)
    mySetup.AddToStartup("C:\\Users\\User\\Downloads\\file1.exe"); // Укажите нужный файл для автозагрузки

    return 0;
}
