#include <SDL2/SDL.h>
#include <iostream>

int main() {
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        std::cout << "Ошибка инициализации SDL: " << SDL_GetError() << std::endl;
        return -1;
    }

    SDL_Window* window = SDL_CreateWindow("First Window", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 800, 600, SDL_WINDOW_OPENGL | SDL_WINDOW_SHOWN);
    if (window == nullptr) {
        std::cout << "Ошибка создания окна: " << SDL_GetError() << std::endl;
        return -1;
    }

    bool quit = false;
    SDL_Event e;

    // Добавление OpenGL контекста
    SDL_GLContext glContext = SDL_GL_CreateContext(window);
    if (glContext == nullptr) {
        std::cout << "Не удалось создать OpenGL контекст: " << SDL_GetError() << std::endl;
        return -1;
    }

    while (!quit) {
        while (SDL_PollEvent(&e) != 0) {
            if (e.type == SDL_QUIT) {
                quit = true;
            }
        }

        // Добавь задержку, чтобы окно не закрывалось сразу
        SDL_Delay(10);
    }

    SDL_GL_DeleteContext(glContext);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
}

