#include <opencv2/opencv.hpp>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

int main()
{
    int client_sock = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in server_addr;

    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(8080);                       // Порт, на который отправлять данные
    server_addr.sin_addr.s_addr = inet_addr("192.168.1.100"); // IP адрес сервера

    connect(client_sock, (struct sockaddr *)&server_addr, sizeof(server_addr));

    cv::VideoCapture cap(0); // Подключение к камере
    if (!cap.isOpened())
    {
        std::cout << "Ошибка открытия камеры" << std::endl;
        return -1;
    }

    cv::Mat frame;
    while (true)
    {
        cap >> frame; // Захват кадра
        if (frame.empty())
            break;

        // Преобразование кадра и отправка на сервер
        // (например, сериализация кадра в массив байтов)
    }

    close(client_sock);
    return 0;
}
