#include <SDL2/SDL.h>
#define GLEW_STATIC
#include <GL/glew.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include <iostream>

// Вершинный шейдер
const char* vertexShaderSource = R"(
    #version 330 core
    layout (location = 0) in vec3 aPos;
    uniform mat4 model;
    uniform mat4 view;
    uniform mat4 projection;
    void main() {
        gl_Position = projection * view * model * vec4(aPos, 1.0);
    }
)";

// Фрагментный шейдер
const char* fragmentShaderSource = R"(
    #version 330 core
    out vec4 FragColor;
    void main() {
        FragColor = vec4(10.0, 0.0, 0.2, 1.0);
    }
)";

int main() {
    // Инициализация SDL
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        std::cout << "SDL не смог инициализироваться! SDL Error: " << SDL_GetError() << std::endl;
        return -1;
    }

    // Установка атрибутов OpenGL
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 3);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);
    SDL_GL_SetAttribute(SDL_GL_DOUBLEBUFFER, 1);
    SDL_GL_SetAttribute(SDL_GL_DEPTH_SIZE, 24);

    // Создание окна
    SDL_Window* window = SDL_CreateWindow(
        "3D Example",
        SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
        800, 600,
        SDL_WINDOW_OPENGL | SDL_WINDOW_SHOWN
    );

    if (window == nullptr) {
        std::cout << "Окно не может быть создано! SDL Error: " << SDL_GetError() << std::endl;
        return -1;
    }

    // Создание контекста OpenGL
    SDL_GLContext glContext = SDL_GL_CreateContext(window);
    if (glContext == nullptr) {
        std::cout << "OpenGL контекст не может быть создан! SDL Error: " << SDL_GetError() << std::endl;
        return -1;
    }

    // Инициализация GLEW
    glewExperimental = GL_TRUE;
    GLenum glewError = glewInit();
    if (glewError != GLEW_OK) {
        std::cout << "GLEW не смог инициализироваться! " << glewGetErrorString(glewError) << std::endl;
        return -1;
    }

    // Включение вертикальной синхронизации
    SDL_GL_SetSwapInterval(1);

    // Компиляция шейдеров
    GLuint vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
    glCompileShader(vertexShader);

    GLuint fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
    glCompileShader(fragmentShader);

    // Создание шейдерной программы
    GLuint shaderProgram = glCreateProgram();
    glAttachShader(shaderProgram, vertexShader);
    glAttachShader(shaderProgram, fragmentShader);
    glLinkProgram(shaderProgram);

    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);

    // Вершины куба
    float vertices[] = {
        // Передняя грань
        -0.5f, -0.5f,  0.5f,
         0.5f, -0.5f,  0.5f,
         0.5f,  0.5f,  0.5f,
        -0.5f,  0.5f,  0.5f,
        // Задняя грань
        -0.5f, -0.5f, -0.5f,
         0.5f, -0.5f, -0.5f,
         0.5f,  0.5f, -0.5f,
        -0.5f,  0.5f, -0.5f
    };

    GLuint indices[] = {
        // Передняя грань
        0, 1, 2,  2, 3, 0,
        // Правая грань
        1, 5, 6,  6, 2, 1,
        // Задняя грань
        5, 4, 7,  7, 6, 5,
        // Левая грань
        4, 0, 3,  3, 7, 4,
        // Верхняя грань
        3, 2, 6,  6, 7, 3,
        // Нижняя грань
        4, 5, 1,  1, 0, 4
    };

    // Создание и привязка VAO и VBO
    GLuint VBO, VAO, EBO;
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glGenBuffers(1, &EBO);

    glBindVertexArray(VAO);

    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);

    // Включение теста глубины
    glEnable(GL_DEPTH_TEST);

    bool quit = false;
    SDL_Event e;

    // Игровой цикл
    while (!quit) {
        // Обработка событий
        while (SDL_PollEvent(&e) != 0) {
            if (e.type == SDL_QUIT) {
                quit = true;
            }
            else if (e.type == SDL_KEYDOWN) {
                if (e.key.keysym.sym == SDLK_ESCAPE) {
                    quit = true;
                }
            }
        }

        // Очистка буфера
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        glUseProgram(shaderProgram);

        // Создание матриц преобразования
        glm::mat4 model = glm::mat4(1.0f);
        glm::mat4 view = glm::mat4(1.0f);
        glm::mat4 projection = glm::mat4(1.0f);

        // Вращение куба
        float time = SDL_GetTicks() / 1000.0f;
        model = glm::rotate(model, time, glm::vec3(0.5f, 1.0f, 0.0f));
        
        // Настройка камеры и проекции
        view = glm::translate(view, glm::vec3(0.0f, 0.0f, -3.0f));
        projection = glm::perspective(glm::radians(45.0f), 800.0f / 600.0f, 0.1f, 100.0f);

        // Передача матриц в шейдеры
        glUniformMatrix4fv(glGetUniformLocation(shaderProgram, "model"), 1, GL_FALSE, glm::value_ptr(model));
        glUniformMatrix4fv(glGetUniformLocation(shaderProgram, "view"), 1, GL_FALSE, glm::value_ptr(view));
        glUniformMatrix4fv(glGetUniformLocation(shaderProgram, "projection"), 1, GL_FALSE, glm::value_ptr(projection));

        // Отрисовка куба
        glBindVertexArray(VAO);
        glDrawElements(GL_TRIANGLES, 36, GL_UNSIGNED_INT, 0);

        // Обмен буферов
        SDL_GL_SwapWindow(window);
    }

    // Очистка
    glDeleteVertexArrays(1, &VAO);
    glDeleteBuffers(1, &VBO);
    glDeleteBuffers(1, &EBO);
    glDeleteProgram(shaderProgram);

    SDL_GL_DeleteContext(glContext);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
} 
