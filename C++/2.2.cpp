#include <SDL2/SDL.h>
#include <GL/glew.h>
#include <iostream>

const char* vShader = R"(
    #version 330 core
    layout(location=0) in vec3 aPos;
    void main(){
        gl_Position = vec4(aPos, 1.0);
    }
)";

const char* fShader = R"(
    #version 330 core
    out vec4 FragColor;
    void main(){
        FragColor = vec4(0.9f, 0.0f, 0.9f, 1.0);
    }
)";

int main() {
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        std::cout << "Ошибка инициализации SDL!\n";
        return -1;
    }

    SDL_Window* window = SDL_CreateWindow("2.2", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 800, 600, SDL_WINDOW_OPENGL | SDL_WINDOW_SHOWN);
    if (!window) {
        std::cout << "Ошибка создания окна!\n";
        return -1;
    }

    SDL_GLContext glContext = SDL_GL_CreateContext(window);
    if (!glContext) {
        std::cout << "Ошибка создания OpenGL контекста!\n";
        return -1;
    }

    glewExperimental = GL_TRUE;
    glewInit();

    // Создание вершинного шейдера
    GLuint vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertexShader, 1, &vShader, nullptr);
    glCompileShader(vertexShader);

    // Создание фрагментного шейдера
    GLuint fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragmentShader, 1, &fShader, nullptr);
    glCompileShader(fragmentShader);

    // Создание шейдерной программы
    GLuint shaderProgram = glCreateProgram();
    glAttachShader(shaderProgram, vertexShader);
    glAttachShader(shaderProgram, fragmentShader);
    glLinkProgram(shaderProgram);

    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);

    // Вершины пятиугольника
    float vertices[] = {
        0.0f,  0.5f,  0.0f,  // 0
       -0.5f,  0.0f,  0.0f,  // 1
        0.5f,  0.0f,  0.0f,  // 2
       -0.3f, -0.5f,  0.0f,  // 3
        0.3f, -0.5f,  0.0f   // 4
    };

    // Индексы треугольников
    GLuint indices[] = {
        0, 1, 2,
        1, 3, 4
        //1, 2, 4
        //2, 4, 3
    };

    GLuint VBO, VAO, EBO;
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glGenBuffers(1, &EBO);

    glBindVertexArray(VAO);

    // Заполняем VBO
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    // Заполняем EBO
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

    // Указываем как OpenGL должен интерпретировать VBO
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);

    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glBindVertexArray(0);

    bool quit = false;
    SDL_Event e;

    while (!quit) {
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_QUIT) {
                quit = true;
            }
        }

        glClear(GL_COLOR_BUFFER_BIT);
        glUseProgram(shaderProgram);
        glBindVertexArray(VAO);
        glDrawElements(GL_TRIANGLES, 12, GL_UNSIGNED_INT, 0);
        glBindVertexArray(0);
        SDL_GL_SwapWindow(window);
    }

    glDeleteVertexArrays(1, &VAO);
    glDeleteBuffers(1, &VBO);
    glDeleteBuffers(1, &EBO);
    glDeleteProgram(shaderProgram);
    SDL_GL_DeleteContext(glContext);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
}

