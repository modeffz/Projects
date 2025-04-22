#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <fstream>
#include <map>

using namespace std;

class Anal {
private:
    vector<string> text; // Список всех слов
    map<string, int> wordCount; // Частота слов

public:
    void Choise();
    void File(const string& filename);
    int CountWords() const;
    int CountSentences() const;
    string LongestWord() const;
    void PrintWordFrequency() const;
};

void Anal::Choise() {
    string file;
    cout << "Введите имя файла: ";
    cin >> file;
    File(file);
}

void Anal::File(const string& filename) {
    ifstream inFile(filename);
    if (!inFile) {
        cout << "Не удалось открыть файл." << endl;
        return;
    }

    string word;
    while (inFile >> word) {
        // Убираем знаки препинания с концов слов
        word.erase(remove_if(word.begin(), word.end(), ::ispunct), word.end());
        text.push_back(word);
        wordCount[word]++; // Увеличиваем счетчик для каждого слова
    }

    inFile.close();

    cout << "Количество слов: " << CountWords() << endl;
    cout << "Количество предложений: " << CountSentences() << endl;
    cout << "Самое длинное слово: " << LongestWord() << endl;
    cout << "Список уникальных слов и их частота:" << endl;
    PrintWordFrequency();
}

int Anal::CountWords() const {
    return text.size(); // Количество всех слов в тексте
}

int Anal::CountSentences() const {
    int sentenceCount = 0;
    for (const auto& word : text) {
        if (!word.empty() && (word.back() == '.' || word.back() == '!' || word.back() == '?')) {
            sentenceCount++;
        }
    }
    return sentenceCount;
}

string Anal::LongestWord() const {
    string longest;
    for (const auto& word : text) {
        if (word.length() > longest.length()) {
            longest = word;
        }
    }
    return longest;
}

void Anal::PrintWordFrequency() const {
    for (const auto& entry : wordCount) {
        cout << "- " << entry.first << ": " << entry.second << endl;
    }
}

int main() {
    Anal a;
    a.Choise();
    return 0;
}
