#include <SDL2/SDL.h>
#include <GL/glew.h>
#include <iostream>

int main() {
    // Инициализация SDL
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        std::cout << "error init";
        return -1;
    }

    // Создание окна с OpenGL контекстом
    SDL_Window* window = SDL_CreateWindow("First Window", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 800, 600, SDL_WINDOW_OPENGL | SDL_WINDOW_SHOWN);
    if (window == nullptr) {
        std::cout << "error window";
        return -1;
    }

    // Создание контекста OpenGL
    SDL_GLContext glContext = SDL_GL_CreateContext(window);
    if (glContext == nullptr) {
        std::cout << "error OpenGL context";
        return -1;
    }

    // Инициализация GLEW
    glewExperimental = GL_TRUE;
    if (glewInit() != GLEW_OK) {
        std::cout << "GLEW initialization failed!" << std::endl;
        return -1;
    }

    // Игровой цикл
    bool quit = false;
    SDL_Event e;
    while (!quit) {
        while (SDL_PollEvent(&e) != 0) {
            if (e.type == SDL_QUIT) {
                quit = true;
            }
        }

        // Очистка экрана перед рисованием
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);  // Устанавливаем цвет фона
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);  // Очищаем экран и глубину

        // Задержка, чтобы видеть результат
        SDL_GL_SwapWindow(window);
        SDL_Delay(100);  // Пауза для наблюдения
    }

    // Очистка
    SDL_GL_DeleteContext(glContext);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
}

