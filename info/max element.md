### Пример с использованием `std::max_element`:

```cpp
#include <iostream>
#include <vector>
#include <algorithm>  // для std::max_element

using namespace std;

int main() {
    vector<int> v = {10, 20, 5, 15, 25, 30};

    // Поиск максимального значения
    auto max_it = max_element(v.begin(), v.end());

    if (max_it != v.end()) {
        cout << "Максимальное значение: " << *max_it << endl;
    } else {
        cout << "Вектор пуст." << endl;
    }

    return 0;
}
```

### Как это работает:
- `std::max_element(v.begin(), v.end())` возвращает итератор на максимальный элемент в диапазоне `[v.begin(), v.end())`.
- Если вектор не пуст, мы выводим значение, на которое указывает итератор `max_it`. В противном случае, проверяем, что вектор пуст.

### Альтернативный способ — с использованием цикла:

Если не хочется использовать стандартную библиотеку `<algorithm>`, можно найти максимальный элемент с помощью простого цикла:

```cpp
#include <iostream>
#include <vector>

using namespace std;

int main() {
    vector<int> v = {10, 20, 5, 15, 25, 30};

    if (v.empty()) {
        cout << "Вектор пуст." << endl;
        return 0;
    }

    // Инициализируем максимум первым элементом
    int max_value = v[0];

    // Ищем максимальное значение
    for (int i = 1; i < v.size(); ++i) {
        if (v[i] > max_value) {
            max_value = v[i];
        }
    }

    cout << "Максимальное значение: " << max_value << endl;

    return 0;
}
```

### Как работает цикл:
- Инициализируем переменную `max_value` первым элементом вектора.
- Проходим по остальным элементам вектора и обновляем значение `max_value`, если встречаем элемент больше текущего максимума.


