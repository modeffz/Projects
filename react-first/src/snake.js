import React, { useEffect, useRef } from 'react';

function Snake() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        const snake = {
            x: 0,
            y: 0,
            dx: 10,
            dy: 0,
            cells: [],
            maxCells: 4,
        };

        const apple = {
            x: 200,
            y: 200
        };

        let count = 0;

        function gameLoop() {
            requestAnimationFrame(gameLoop);
            
            if (++count < 4) return;
            count = 0;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Движение змейки
            snake.x += snake.dx;
            snake.y += snake.dy;
            
            // Проверка границ
            if (snake.x < 0) snake.x = canvas.width - 10;
            if (snake.x >= canvas.width) snake.x = 0;
            if (snake.y < 0) snake.y = canvas.height - 10;
            if (snake.y >= canvas.height) snake.y = 0;
            
            // Сохраняем позицию
            snake.cells.unshift({x: snake.x, y: snake.y});
            
            // Удаляем лишние ячейки
            if (snake.cells.length > snake.maxCells) {
                snake.cells.pop();
            }
            
            // Проверка столкновения с яблоком
            if (snake.x === apple.x && snake.y === apple.y) {
                snake.maxCells++;
                apple.x = Math.floor(Math.random() * (canvas.width / 10)) * 10;
                apple.y = Math.floor(Math.random() * (canvas.height / 10)) * 10;
            }
            
            // Отрисовка яблока
            ctx.fillStyle = 'red';
            ctx.fillRect(apple.x, apple.y, 10, 10);
            
            // Отрисовка змейки
            ctx.fillStyle = 'green';
            snake.cells.forEach(function(cell) {
                ctx.fillRect(cell.x, cell.y, 10, 10);
            });
        }

        // Обновляем обработчик клавиш
        function handleKeyPress(e) {
            if (e.key === 'ArrowLeft' && snake.dx === 0) {
                snake.dx = -10;
                snake.dy = 0;
            }
            else if (e.key === 'ArrowRight' && snake.dx === 0) {
                snake.dx = 10;
                snake.dy = 0;
            }
            else if (e.key === 'ArrowUp' && snake.dy === 0) {
                snake.dx = 0;
                snake.dy = -10;
            }
            else if (e.key === 'ArrowDown' && snake.dy === 0) {
                snake.dx = 0;
                snake.dy = 10;
            }
        }

        document.addEventListener('keydown', handleKeyPress);
        gameLoop();

        // Очистка при размонтировании компонента
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []); // Пустой массив зависимостей означает, что эффект запустится только один раз

    return (
        <div>
            <h1>Snake</h1>
            <canvas ref={canvasRef} width="500" height="500"></canvas>
        </div>
    );
}

export default Snake;