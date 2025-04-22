#include <gtkmm/application.h>
#include <gtkmm/window.h>

int main(int argc, char *argv[])
{
    // Создаем экземпляр приложения
    auto app = Gtk::Application::create(argc, argv, "org.gtkmm.example");

    // Создаем окно
    Gtk::Window window;
    window.set_default_size(800, 600);
    window.set_title("GTKmm Example");

    // Запускаем приложение и показываем окно
    return app->run(window);
}
