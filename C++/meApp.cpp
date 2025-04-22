#include <gtkmm.h>
#include <gtkmm/application.h>
#include <gtkmm/window.h>
#include <gtkmm/button.h>
#include <gtkmm/fixed.h>

class MyWindow : public Gtk::Window
{
public:
    MyWindow();

private:
    Gtk::Fixed m_fixed;   // Контейнер Fixed для точного позиционирования
    Gtk::Button m_button; // Кнопка
};

MyWindow::MyWindow() : m_button("Нажми меня") // Инициализация кнопки
{
    set_title("my app");
    set_default_size(1280, 720);

    // Добавляем кнопку в контейнер Fixed на определённой позиции
    m_fixed.put(m_button, 100, 150); // Координаты x = 100, y = 150

    // Добавляем контейнер Fixed в окно
    add(m_fixed);

    // Показываем все элементы
    m_fixed.show_all();
}

int main(int argc, char *argv[])
{
    auto app = Gtk::Application::create(argc, argv, "org.gtkmm.examples.base");

    MyWindow window;

    return app->run(window);
}
