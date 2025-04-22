#include<SDL2/SDL.h>
#include<iostream>

const char* vShader = R"(
    #version 330 core
    layout(local = 0) in vec3 aPos;
    void main(){
        gl_Position = vec4(aPos, 1.0);
    }
)";

const char* fShader = R"(
    #version 330 core
    out vec4 fragColor
    void main(){
        fragColor = vec4(0.4f, 0.7f, 0.7f, 1.0f)
    }
)"; 

int main(){

    if(SDL_Init(SDL_INIT_VIDEO) <0){
        std::cout << "INIT!";
        return -1;
    }
    
    SDL_Window* window = SDL_CreateWindow("Window", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 800, 600, SDL_WINDOW_OPENGL | SDL_WINDOW_SHOWN);
    
    if(!window){
        std::cout << "WINDOW!";
        return -1;
    }

    SDL_GLCONTEXT glContext = SDL_GL_CreateContext(window);
    
    if(!glContext){
        std::cout << "Context";
        return -1;
    }

    glewExperimental = GL_TRUE;
    glewinit()

}
