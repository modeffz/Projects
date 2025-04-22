#include <opencv2/opencv.hpp>

int main()
{
    cv::VideoCapture cap(0); // 0 - номер устройства камеры
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
        {
            std::cout << "Нет видео" << std::endl;
            break;
        }
        cv::imshow("Камера", frame); // Отображение кадра
        if (cv::waitKey(30) >= 0)
            break; // Выход по нажатию клавиши
    }

    return 0;
}
