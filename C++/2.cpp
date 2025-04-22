#include <SDL2/SDL.h>
#include <iostream>


const char* vortexShaderSource = R"(
    #version 330 core
    layout (location = 0) in vec3 aPos;
    void main() {
    gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
    }
)";

const char* fragmentShaderSource = R"(
    #version 330 core
    out vec4 FragColor;
    void main() {
        FragColor = vec4(0.4f, 0.7f, 0.1f, 1.0f);
    }
)";

int main(){
    if(SDL_Init(SDL_INIT_VIDEO) < 0){
        std::cout << "init!";
        return -1;
    }

    SDL_Window* window = SDL_CreateWindow("2", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 800, 600, SDL_WINDOW_OPENGL | SDL_WINDOW_SHOWN);
    
    if(window == nullptr){
        std::cout << "window!";
        return -1;
    }
    
    SDL_GLContext glContext = SDL_GL_CreateContext(window);
    if(glContext == nullptr){
        std::cout << "GL!";
        return -1;
    }
    
    GLuint vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShadeSource(vortexShader, 1, &vortexShaderSource, nullptr);
    glCompileShader(vertexShader);

    GLuint fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShadeSource(fragmentShader, 1, &fragmentShaderSource, nullptr);
    glCompileShader(fragmentShader);

    GLuint shaderProgram = glCreateProgram();
    glAttachShader(shaderProgram, vortexShader);
    glAttachShader(shaderProgram, fragmentShader);
    glLinkProgram(shaderProgram);

    GLuint VBO;
    glGenBuffers(1, &VBO);
    glBindBuffer(GL_ARRAY_BUFFER, &VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    GLuint EBO;
    glGenBuffers(1, &EBO);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, &EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);
    
    bool quit = false;
    SDL_Event e;
    while(!quit){
        while(SDL_PollEvent(&e) != 0){
            if(e.type == SDL_QUIT){
                quit = true;
            } else if(e.key.keysym.sym == SDLK_ESCAPE){
                quit = true;
            }
        }



        glClearColor(0.7f, 0.4f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        //glDrawArrays(GL_TRIANGLES, 0, 3)
        glUseProgram(shaderProgram);
        glDrawArrays(GL_TRIANGLES, 0, 3);
        SDl_GL_SwapWindow(window);
    }
    glDeleteBuffers(1, &VBO);
    glDeleteBuffers(1, &EBO);
    glDeleteProgram(shaderProgram);

    SDL_GL_DeleteContext(glContext);
    SDL_DestroyWindow(window);
    SDl_Quit();
    return 0;
}
