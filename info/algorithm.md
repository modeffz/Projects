В C++ стандартная библиотека предоставляет мощный набор алгоритмов в заголовке `<algorithm>`. Алгоритмы позволяют выполнять операции над контейнерами, такими как сортировка, поиск, модификация и другие. Они широко используются с контейнерами стандартной библиотеки, включая `std::vector`, `std::list`, `std::deque` и т.д.

### Основные алгоритмы `<algorithm>`

#### 1. **Поиск элементов**
- **`std::find`**: ищет элемент в диапазоне. Возвращает итератор на первый найденный элемент или итератор `end`, если элемент не найден.
  ```cpp
  #include <algorithm>
  #include <vector>
  #include <iostream>

  int main() {
      std::vector<int> v = {1, 2, 3, 4, 5};
      auto it = std::find(v.begin(), v.end(), 3);
      if (it != v.end()) {
          std::cout << "Элемент найден: " << *it << std::endl;
      }
  }
  ```

- **`std::find_if`**: ищет первый элемент, который удовлетворяет условию, переданному в виде лямбда-функции или предиката.
  ```cpp
  auto it = std::find_if(v.begin(), v.end(), [](int x) { return x > 3; });
  ```

#### 2. **Сортировка**
- **`std::sort`**: сортирует элементы диапазона по возрастанию (по умолчанию) или в соответствии с переданным компаратором.
  ```cpp
  std::sort(v.begin(), v.end());  // Сортировка по возрастанию
  std::sort(v.begin(), v.end(), std::greater<int>());  // Сортировка по убыванию
  ```

#### 3. **Минимальные и максимальные элементы**
- **`std::min_element` и `std::max_element`**: возвращают итератор на минимальный или максимальный элемент в диапазоне.
  ```cpp
  auto min_it = std::min_element(v.begin(), v.end());
  auto max_it = std::max_element(v.begin(), v.end());
  std::cout << "Min: " << *min_it << ", Max: " << *max_it << std::endl;
  ```

#### 4. **Подсчет**
- **`std::count` и `std::count_if`**: подсчитывают количество вхождений определенного элемента или количество элементов, удовлетворяющих условию.
  ```cpp
  int count_3 = std::count(v.begin(), v.end(), 3);
  int count_greater_than_2 = std::count_if(v.begin(), v.end(), [](int x) { return x > 2; });
  ```

#### 5. **Копирование и модификация**
- **`std::copy`**: копирует элементы из одного диапазона в другой.
  ```cpp
  std::vector<int> v2(v.size());
  std::copy(v.begin(), v.end(), v2.begin());
  ```

- **`std::transform`**: применяет функцию к каждому элементу диапазона и сохраняет результат в другой контейнер.
  ```cpp
  std::vector<int> v3(v.size());
  std::transform(v.begin(), v.end(), v3.begin(), [](int x) { return x * 2; });
  ```

#### 6. **Удаление элементов**
- **`std::remove` и `std::remove_if`**: удаляют элементы, перемещая оставшиеся элементы к началу диапазона. Возвращает итератор на новую "конечную" точку диапазона. После этого нужно вызвать `erase` для фактического удаления элементов из контейнера.
  ```cpp
  v.erase(std::remove(v.begin(), v.end(), 3), v.end());  // Удаляет все вхождения числа 3
  ```

#### 7. **Перестановки**
- **`std::reverse`**: изменяет порядок элементов на обратный.
  ```cpp
  std::reverse(v.begin(), v.end());
  ```

- **`std::next_permutation`**: генерирует следующую лексикографическую перестановку элементов.
  ```cpp
  std::next_permutation(v.begin(), v.end());
  ```

#### 8. **Проверки и условия**
- **`std::all_of`**: возвращает `true`, если все элементы диапазона удовлетворяют условию.
  ```cpp
  bool all_positive = std::all_of(v.begin(), v.end(), [](int x) { return x > 0; });
  ```

- **`std::any_of`**: возвращает `true`, если хотя бы один элемент диапазона удовлетворяет условию.
  ```cpp
  bool any_negative = std::any_of(v.begin(), v.end(), [](int x) { return x < 0; });
  ```

- **`std::none_of`**: возвращает `true`, если ни один элемент диапазона не удовлетворяет условию.
  ```cpp
  bool none_greater_than_10 = std::none_of(v.begin(), v.end(), [](int x) { return x > 10; });
  ```

### Пример использования нескольких алгоритмов:
```cpp
#include <iostream>
#include <vector>
#include <algorithm>  // для std::find, std::sort, std::max_element и других алгоритмов

int main() {
    std::vector<int> v = {5, 3, 8, 6, 2, 7};

    // Сортировка по возрастанию
    std::sort(v.begin(), v.end());
    std::cout << "Отсортированный вектор: ";
    for (int n : v) std::cout << n << " ";
    std::cout << std::endl;

    // Поиск максимального элемента
    auto max_it = std::max_element(v.begin(), v.end());
    if (max_it != v.end()) {
        std::cout << "Максимальный элемент: " << *max_it << std::endl;
    }

    // Подсчет элементов больше 5
    int count_greater_than_5 = std::count_if(v.begin(), v.end(), [](int x) { return x > 5; });
    std::cout << "Количество элементов больше 5: " << count_greater_than_5 << std::endl;

    // Удаление элемента 3
    v.erase(std::remove(v.begin(), v.end(), 3), v.end());
    std::cout << "Вектор после удаления 3: ";
    for (int n : v) std::cout << n << " ";
    std::cout << std::endl;

    return 0;
}
```

### Итог:
Алгоритмы из `<algorithm>` предоставляют мощный и универсальный способ работы с данными в контейнерах. Они позволяют писать код, который легко читать и поддерживать, используя готовые стандартные функции вместо ручного написания циклов и проверок.

Для поиска максимального значения в `std::vector` можно использовать несколько подходов. Один из самых удобных — это использование функции `std::max_element` из библиотеки `<algorithm>`. Эта функция возвращает итератор на максимальный элемент в диапазоне.

