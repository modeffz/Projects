#include <gtkmm.h>
#include <iostream>
#include <cstdlib>

class MyApp
{
public:
    MyApp()
    {
        auto refBuilder = Gtk::Builder::create_from_file("/home/modeffz/Документы/button.glade");

        refBuilder->get_widget("my_window", myWindow);
        if (myWindow)
        {
            refBuilder->get_widget("start_tl", startButton);
            if (startButton)
            {
                startButton->signal_clicked().connect(sigc::mem_fun(*this, &MyApp::on_click_start));
            }

            refBuilder->get_widget("button_MC", MCr);
            if (MCr)
            {
                MCr->signal_clicked().connect(sigc::mem_fun(*this, &MyApp::on_click_MC)); // Исправлено на MCr
            }

            refBuilder->get_widget("button_kr", KRB);
            if (KRB)
            {
                KRB->signal_clicked().connect(sigc::mem_fun(*this, &MyApp::on_clicked_KRB));
            }

            refBuilder->get_widget("button_CRIS", CRIS);
            if (CRIS)
            {
                CRIS->signal_clicked().connect(sigc::mem_fun(*this, &MyApp::on_click_CRIS));
            }

            refBuilder->get_widget("button_TBOI", TBOI);
            if (TBOI)
            {
                TBOI->signal_clicked().connect(sigc::mem_fun(*this, &MyApp::on_click_TBOI));
            }
            refBuilder->get_widget("button_P", POR);
            if (POR)
            {
                POR->signal_clicked().connect(sigc::mem_fun(*this, &MyApp::on_cliick_P));
            }
            myWindow->show_all();
        }
    }

    Gtk::Window *get_window()
    {
        return myWindow;
    }

protected:
    void on_click_start()
    {
        system("gnome-terminal -- bash -c 'java -jar ~/Рабочий\\ стол/TLauncher.jar.temp;  exec bash'");
    }

    void on_click_TBOI()
    {
        system("gnome-terminal -- bash -c 'cd ~/snap/TheBindingOfIsaacRebirth && ./run-x64.sh; exec bash'");
    }
    void on_click_MC()
    {
        system("gnome-terminal -- bash -c 'cd /home/modeffz/Загрузки/MCreator.2024.3.Linux.64bit/MCreator20243 && ./mcreator.sh; exec bash'");
    }

    void on_clicked_KRB()
    {
        std::cout << "Запуск Krita" << std::endl;
        system("gnome-terminal -- bash -c 'cd /home/modeffz/snap && ./krita.appimage; exec bash'");
    }

    void on_click_CRIS()
    {
        system("gnome-terminal -- bash -c 'cd /home/modeffz/snap && java -jar cristalix.jar; exec bash'");
        auto image = Gtk::Image("../Изображения/launcher/images.jpeg");
        startButton->set_image(image);
    }
    void on_cliick_P()
    {
        system("gnome-terminal -- bash -c 'cd /media/modeffz/linux_80/Portal2 && ./start.sh; exec bash'");
    }

private:
    Gtk::Window *myWindow = nullptr;
    Gtk::Button *startButton = nullptr;
    Gtk::Button *MCr = nullptr;
    Gtk::Button *KRB = nullptr;
    Gtk::Button *CRIS = nullptr;
    Gtk::Button *TBOI = nullptr;
    Gtk::Button *POR = nullptr;
};

int main(int argc, char *argv[])
{
    auto app = Gtk::Application::create(argc, argv, "org.gtkmm.example");

    MyApp m;

    return app->run(*m.get_window());
}
