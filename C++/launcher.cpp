#include <gtkmm.h>
#include <iostream>

class MyWindow : public Gtk::Window
{
public:
    MyWindow()
    {
        set_title("GTK Button Example");
        set_default_size(400, 200);

        // Настройка кнопки
        button.set_label("Click Me");
        button.signal_clicked().connect(sigc::mem_fun(*this, &MyWindow::on_button_clicked));

        // Добавляем кнопку в окно
        add(button);

        // Отображаем все виджеты
        button.show();
    }

protected:
    void on_button_clicked()
    {
        std::cout << "Button clicked!" << std::endl;
    }

    Gtk::Button button;
};

int main(int argc, char *argv[])
{
    auto app = Gtk::Application::create(argc, argv, "org.gtkmm.example");

    MyWindow window;

    // Запуск приложения
    return app->run(window);
}
