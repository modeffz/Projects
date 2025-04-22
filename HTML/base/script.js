class Database {
    constructor() {
        this.tables = {};
        this.customTypes = {
            'email': {
                validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                errorMessage: 'Неверный формат email'
            },
            'phone': {
                validate: (value) => /^\+?[0-9]{10,12}$/.test(value),
                errorMessage: 'Неверный формат телефона'
            },
            'url': {
                validate: (value) => /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value),
                errorMessage: 'Неверный формат URL'
            }
        };
        this.templates = {};
        this.menuTemplates = {};
        this.autoSaveInterval = 5000; // Автосохранение каждые 5 секунд
        this.init();
    }

    async init() {
        await this.loadFromFile();
        this.initializeUI();
        this.initAutoSave();
    }

    initAutoSave() {
        setInterval(() => {
            this.saveToFile();
        }, this.autoSaveInterval);
    }

    async loadFromFile() {
        try {
            const response = await fetch('database.json');
            if (response.ok) {
                this.tables = await response.json();
            }
        } catch (error) {
            console.log('Загрузка из файла не удалась, использую localStorage');
            this.loadFromLocalStorage();
        }
    }

    async saveToFile() {
        try {
            const response = await fetch('/save-database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.tables)
            });
            
            if (response.ok) {
                console.log('База данных сохранена в файл');
            }
        } catch (error) {
            console.log('Сохранение в файл не удалось, использую localStorage');
            this.saveToLocalStorage();
        }
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('database');
        if (savedData) {
            this.tables = JSON.parse(savedData);
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('database', JSON.stringify(this.tables));
    }

    loadTemplates() {
        const savedTemplates = localStorage.getItem('templates');
        if (savedTemplates) {
            this.templates = JSON.parse(savedTemplates);
        }
    }

    saveTemplates() {
        localStorage.setItem('templates', JSON.stringify(this.templates));
    }

    loadMenuTemplates() {
        const savedMenuTemplates = localStorage.getItem('menuTemplates');
        if (savedMenuTemplates) {
            this.menuTemplates = JSON.parse(savedMenuTemplates);
        } else {
            // Добавляем стандартные шаблоны меню
            this.menuTemplates = {
                'Контакты': {
                    description: 'Шаблон для хранения контактной информации',
                    columns: {
                        'Имя': 'text',
                        'Телефон': 'phone',
                        'Email': 'email',
                        'Адрес': 'text'
                    },
                    required: ['Имя', 'Телефон']
                },
                'Товары': {
                    description: 'Шаблон для учета товаров',
                    columns: {
                        'Название': 'text',
                        'Цена': 'number',
                        'Количество': 'number',
                        'Категория': 'text'
                    },
                    required: ['Название', 'Цена']
                },
                'Задачи': {
                    description: 'Шаблон для управления задачами',
                    columns: {
                        'Название': 'text',
                        'Приоритет': 'text',
                        'Срок': 'date',
                        'Статус': 'text'
                    },
                    required: ['Название', 'Срок']
                }
            };
            this.saveMenuTemplates();
        }
    }

    saveMenuTemplates() {
        localStorage.setItem('menuTemplates', JSON.stringify(this.menuTemplates));
    }

    initializeUI() {
        this.modal = document.getElementById('modal');
        this.modalContent = document.getElementById('modalContent');
        this.tablesList = document.getElementById('tablesList');
        
        document.getElementById('createTableBtn').addEventListener('click', () => this.showCreateTableModal());
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('createTemplateBtn').addEventListener('click', 
            () => this.showCreateTemplateModal());
        document.getElementById('saveTemplateBtn').addEventListener('click',
            () => this.showSaveAsTemplateModal());
        
        this.updateTablesList();

        // Обновляем обработчики для кнопок импорта/экспорта
        document.getElementById('exportBtn').addEventListener('click', () => {
            const currentTable = document.getElementById('currentTableName').textContent;
            if (currentTable) {
                this.exportTableToCSV(currentTable);
            } else {
                this.exportToNewFile(); // Экспорт всей базы данных в новый файл
            }
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            this.importFromFile();
        });

        // Добавляем обработчик для автосохранения при изменениях
        window.addEventListener('beforeunload', async (e) => {
            e.preventDefault();
            await this.saveToFile();
        });
    }

    showCreateTableModal() {
        this.modalContent.innerHTML = `
            <h3>Создать новую таблицу</h3>
            <div>
                <label>Название таблицы:</label>
                <input type="text" id="tableNameInput">
            </div>
            <div id="columnsContainer">
                <h4>Колонки:</h4>
                <button onclick="db.addColumnInput()">Добавить колонку</button>
            </div>
            <button onclick="db.createTable()">Создать таблицу</button>
            <button onclick="db.showCustomTypeModal()">Добавить свой тип</button>
        `;
        this.addColumnInput();
        this.modal.style.display = 'block';
    }

    addColumnInput() {
        const container = document.createElement('div');
        const types = [...Object.keys(this.customTypes), 'text', 'number', 'date'];
        
        const typeOptions = types.map(type => 
            `<option value="${type}">${type}</option>`
        ).join('');

        container.innerHTML = `
            <div class="column-input">
                <input type="text" placeholder="Название колонки" class="columnName">
                <select class="columnType">
                    ${typeOptions}
                </select>
                <input type="checkbox" class="columnRequired"> Обязательное
                <button onclick="this.parentElement.remove()">Удалить</button>
            </div>
        `;
        document.getElementById('columnsContainer').appendChild(container);
    }

    showCustomTypeModal() {
        this.modalContent.innerHTML = `
            <h3>Добавить свой тип данных</h3>
            <div>
                <label>Название типа:</label>
                <input type="text" id="customTypeName">
            </div>
            <div>
                <label>Регулярное выражение для валидации:</label>
                <input type="text" id="customTypeRegex">
            </div>
            <div>
                <label>Сообщение об ошибке:</label>
                <input type="text" id="customTypeError">
            </div>
            <button onclick="db.createCustomType()">Добавить тип</button>
        `;
        this.modal.style.display = 'block';
    }

    createCustomType() {
        const name = document.getElementById('customTypeName').value;
        const regex = document.getElementById('customTypeRegex').value;
        const error = document.getElementById('customTypeError').value;

        this.addCustomType(
            name,
            (value) => new RegExp(regex).test(value),
            error
        );

        this.showCreateTableModal();
    }

    addCustomType(name, validator, errorMessage) {
        this.customTypes[name] = {
            validate: validator,
            errorMessage: errorMessage
        };
    }

    createTable() {
        const tableName = document.getElementById('tableNameInput')?.value;
        if (!tableName) {
            alert('Введите название таблицы');
            return;
        }

        const columns = {};
        const required = [];
        
        document.querySelectorAll('.column-input').forEach(input => {
            const name = input.querySelector('.columnName')?.value;
            const type = input.querySelector('.columnType')?.value;
            const isRequired = input.querySelector('.columnRequired')?.checked;
            
            if (name) {
                columns[name] = type;
                if (isRequired) {
                    required.push(name);
                }
            }
        });

        if (Object.keys(columns).length === 0) {
            alert('Добавьте хотя бы одну колонку');
            return;
        }

        this.tables[tableName] = {
            columns: columns,
            required: required,
            data: []
        };

        this.saveToFile();
        this.updateTablesList();
        this.closeModal();
        this.showTable(tableName);
    }

    updateTablesList() {
        this.tablesList.innerHTML = '';
        Object.keys(this.tables).forEach(tableName => {
            const tableItem = document.createElement('div');
            tableItem.className = 'table-item';
            tableItem.innerHTML = `
                <span>${tableName}</span>
                <button onclick="db.showTable('${tableName}')">Открыть</button>
                <button onclick="db.deleteTable('${tableName}')">Удалить</button>
            `;
            this.tablesList.appendChild(tableItem);
        });
    }

    showTable(tableName) {
        const table = this.tables[tableName];
        if (!table) return;

        document.getElementById('currentTableName').textContent = tableName;
        const container = document.getElementById('tableContainer');
        
        let html = '<table>';
        // Заголовки
        html += '<tr>';
        Object.keys(table.columns).forEach(column => {
            html += `<th>${column}</th>`;
        });
        html += '<th>Действия</th></tr>';

        // Данные
        table.data.forEach((record, index) => {
            html += '<tr>';
            Object.keys(table.columns).forEach(column => {
                html += `<td>${record[column] || ''}</td>`;
            });
            html += `<td>
                <button onclick="db.editRecord('${tableName}', ${index})">Редактировать</button>
                <button onclick="db.deleteRecord('${tableName}', ${index})">Удалить</button>
            </td></tr>`;
        });
        html += '</table>';
        
        container.innerHTML = html;
    }

    showAddRecordModal(tableName) {
        const table = this.tables[tableName];
        if (!table) return;

        this.modalContent.innerHTML = `
            <h3>Добавить запись</h3>
            <div class="form-group">
                ${Object.entries(table.columns).map(([column, type]) => `
                    <div>
                        <label>${column}${table.required.includes(column) ? ' *' : ''}:</label>
                        <input type="${type === 'date' ? 'date' : 'text'}" 
                               id="input_${column}" 
                               ${type === 'number' ? 'type="number"' : ''}>
                    </div>
                `).join('')}
            </div>
            <button onclick="db.addRecord('${tableName}')">Добавить</button>
        `;
        this.modal.style.display = 'block';
    }

    addRecord(tableName) {
        const table = this.tables[tableName];
        const record = {};
        
        Object.keys(table.columns).forEach(column => {
            record[column] = document.getElementById(`input_${column}`).value;
        });

        const errors = this.validateRecord(tableName, record);
        if (errors.length > 0) {
            alert('Ошибки валидации:\n' + errors.join('\n'));
            return;
        }

        table.data.push(record);
        this.saveToFile();
        this.showTable(tableName);
        this.closeModal();
    }

    validateRecord(tableName, record) {
        const table = this.tables[tableName];
        const errors = [];

        Object.entries(table.columns).forEach(([column, type]) => {
            const value = record[column];
            const customType = this.customTypes[type];

            if (table.required && table.required.includes(column) && !value) {
                errors.push(`Поле ${column} обязательно для заполнения`);
            }

            if (value && customType && !customType.validate(value)) {
                errors.push(`${column}: ${customType.errorMessage}`);
            }
        });

        return errors;
    }

    deleteRecord(tableName, index) {
        const table = this.tables[tableName];
        table.data.splice(index, 1);
        this.saveToFile();
        this.showTable(tableName);
    }

    deleteTable(tableName) {
        if (confirm(`Удалить таблицу "${tableName}"?`)) {
            delete this.tables[tableName];
            this.saveToFile();
            this.updateTablesList();
            document.getElementById('currentTableName').textContent = '';
            document.getElementById('tableContainer').innerHTML = '';
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    exportTableToCSV(tableName) {
        const table = this.tables[tableName];
        const columns = Object.keys(table.columns);
        const csvContent = [
            columns.join(','),
            ...table.data.map(row => 
                columns.map(col => `"${row[col] || ''}""`).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tableName}.csv`;
        a.click();
    }

    showCreateTemplateModal() {
        this.modalContent.innerHTML = `
            <h3>Создать шаблон таблицы</h3>
            <div class="form-group">
                <label>Название шаблона:</label>
                <input type="text" id="templateNameInput">
            </div>
            <div class="form-group">
                <label>Описание:</label>
                <textarea id="templateDescription"></textarea>
            </div>
            <div id="templateColumnsContainer">
                <h4>Колонки шаблона:</h4>
                <button onclick="db.addTemplateColumnInput()">Добавить колонку</button>
            </div>
            <button onclick="db.saveTemplate()">Сохранить шаблон</button>
        `;
        this.addTemplateColumnInput();
        this.modal.style.display = 'block';
    }

    addTemplateColumnInput() {
        const container = document.createElement('div');
        container.className = 'column-input';
        const types = [...Object.keys(this.customTypes), 'text', 'number', 'date'];
        
        const typeOptions = types.map(type => 
            `<option value="${type}">${type}</option>`
        ).join('');

        container.innerHTML = `
            <input type="text" placeholder="Название колонки" class="columnName">
            <select class="columnType">
                ${typeOptions}
            </select>
            <input type="checkbox" class="columnRequired"> Обязательное
            <input type="text" placeholder="Значение по умолчанию" class="defaultValue">
            <button onclick="this.parentElement.remove()">Удалить</button>
        `;
        document.getElementById('templateColumnsContainer').appendChild(container);
    }

    saveTemplate() {
        const name = document.getElementById('templateNameInput').value;
        const description = document.getElementById('templateDescription').value;
        const columnInputs = document.querySelectorAll('.columnName');
        const columnTypes = document.querySelectorAll('.columnType');
        const columnRequired = document.querySelectorAll('.columnRequired');
        const defaultValues = document.querySelectorAll('.defaultValue');

        const columns = {};
        const required = [];
        const defaults = {};

        columnInputs.forEach((input, index) => {
            if (input.value) {
                columns[input.value] = columnTypes[index].value;
                if (columnRequired[index].checked) {
                    required.push(input.value);
                }
                if (defaultValues[index].value) {
                    defaults[input.value] = defaultValues[index].value;
                }
            }
        });

        this.templates[name] = {
            description,
            columns,
            required,
            defaults
        };

        this.saveTemplates();
        this.updateTemplatesList();
        this.closeModal();
    }

    updateTemplatesList() {
        const templatesList = document.getElementById('templatesList');
        templatesList.innerHTML = '';
        
        Object.entries(this.templates).forEach(([name, template]) => {
            const templateItem = document.createElement('div');
            templateItem.className = 'template-item';
            templateItem.innerHTML = `
                <div>
                    <strong>${name}</strong>
                    <p>${template.description}</p>
                </div>
                <div class="action-buttons">
                    <button onclick="db.createTableFromTemplate('${name}')" class="template-btn">
                        Использовать
                    </button>
                    <button onclick="db.deleteTemplate('${name}')" class="delete-btn">
                        Удалить
                    </button>
                </div>
            `;
            templatesList.appendChild(templateItem);
        });
    }

    createTableFromTemplate(templateName) {
        const template = this.templates[templateName];
        this.modalContent.innerHTML = `
            <h3>Создать таблицу из шаблона "${templateName}"</h3>
            <div class="form-group">
                <label>Название таблицы:</label>
                <input type="text" id="tableNameInput">
            </div>
            <button onclick="db.createTableFromTemplateConfirm('${templateName}')">
                Создать таблицу
            </button>
        `;
        this.modal.style.display = 'block';
    }

    createTableFromTemplateConfirm(templateName) {
        const template = this.templates[templateName];
        const tableName = document.getElementById('tableNameInput').value;

        this.tables[tableName] = {
            columns: {...template.columns},
            required: [...template.required],
            defaults: {...template.defaults},
            data: []
        };

        this.saveToFile();
        this.updateTablesList();
        this.closeModal();
        this.showTable(tableName);
    }

    deleteTemplate(templateName) {
        if (confirm(`Удалить шаблон "${templateName}"?`)) {
            delete this.templates[templateName];
            this.saveTemplates();
            this.updateTemplatesList();
        }
    }

    showSaveAsTemplateModal() {
        const currentTable = document.getElementById('currentTableName').textContent;
        if (!currentTable) return;

        this.modalContent.innerHTML = `
            <h3>Сохранить таблицу как шаблон</h3>
            <div class="form-group">
                <label>Название шаблона:</label>
                <input type="text" id="templateNameInput" value="${currentTable}_template">
            </div>
            <div class="form-group">
                <label>Описание:</label>
                <textarea id="templateDescription"></textarea>
            </div>
            <button onclick="db.saveCurrentTableAsTemplate()">Сохранить</button>
        `;
        this.modal.style.display = 'block';
    }

    saveCurrentTableAsTemplate() {
        const currentTable = document.getElementById('currentTableName').textContent;
        const templateName = document.getElementById('templateNameInput').value;
        const description = document.getElementById('templateDescription').value;

        const table = this.tables[currentTable];
        this.templates[templateName] = {
            description,
            columns: {...table.columns},
            required: table.required || [],
            defaults: {}
        };

        this.saveTemplates();
        this.updateTemplatesList();
        this.closeModal();
    }

    showCreateMenuTemplateModal() {
        this.modalContent.innerHTML = `
            <h3>Создать шаблон меню</h3>
            <div class="form-group">
                <label>Название пункта меню:</label>
                <input type="text" id="menuNameInput">
            </div>
            <div class="form-group">
                <label>Описание:</label>
                <textarea id="menuDescription"></textarea>
            </div>
            <div class="form-group">
                <label>Иконка (emoji):</label>
                <input type="text" id="menuIcon" placeholder="📁">
            </div>
            <div id="menuItemsContainer">
                <h4>Подпункты меню:</h4>
                <button onclick="db.addMenuItemInput()">Добавить подпункт</button>
            </div>
            <button onclick="db.saveMenuTemplate()">Сохранить шаблон меню</button>
        `;
        this.addMenuItemInput();
        this.modal.style.display = 'block';
    }

    addMenuItemInput() {
        const container = document.createElement('div');
        container.className = 'menu-item-input';
        container.innerHTML = `
            <input type="text" placeholder="Название подпункта" class="menuItemName">
            <input type="text" placeholder="Ссылка или действие" class="menuItemAction">
            <input type="text" placeholder="Иконка" class="menuItemIcon">
            <button onclick="this.parentElement.remove()">Удалить</button>
        `;
        document.getElementById('menuItemsContainer').appendChild(container);
    }

    saveMenuTemplate() {
        const name = document.getElementById('menuNameInput').value;
        const description = document.getElementById('menuDescription').value;
        const icon = document.getElementById('menuIcon').value;
        const itemNames = document.querySelectorAll('.menuItemName');
        const itemActions = document.querySelectorAll('.menuItemAction');
        const itemIcons = document.querySelectorAll('.menuItemIcon');

        const items = [];
        itemNames.forEach((input, index) => {
            if (input.value) {
                items.push({
                    name: input.value,
                    action: itemActions[index].value,
                    icon: itemIcons[index].value || '📄'
                });
            }
        });

        this.menuTemplates[name] = {
            description,
            icon: icon || '📁',
            items
        };

        this.saveMenuTemplates();
        this.updateMenuTemplatesList();
        this.closeModal();
    }

    updateMenuTemplatesList() {
        const menuTemplatesList = document.getElementById('menuTemplatesList');
        menuTemplatesList.innerHTML = '<h3>Шаблоны меню</h3>';
        
        Object.entries(this.menuTemplates).forEach(([name, template]) => {
            const templateItem = document.createElement('div');
            templateItem.className = 'template-item';
            templateItem.innerHTML = `
                <div>
                    <strong>${template.icon} ${name}</strong>
                    <p>${template.description}</p>
                </div>
                <div class="action-buttons">
                    <button onclick="db.useMenuTemplate('${name}')" class="template-btn">
                        Использовать
                    </button>
                    <button onclick="db.deleteMenuTemplate('${name}')" class="delete-btn">
                        Удалить
                    </button>
                </div>
            `;
            menuTemplatesList.appendChild(templateItem);
        });
    }

    // Обновляем метод импорта файла
    async importFromFile() {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'JSON Files',
                    accept: {
                        'application/json': ['.json']
                    }
                }],
                multiple: false
            });

            const file = await fileHandle.getFile();
            const contents = await file.text();
            const data = JSON.parse(contents);

            if (this.validateDatabaseStructure(data)) {
                this.tables = data;
                await this.saveToFile();
                this.updateTablesList();
                alert('База данных успешно импортирована');
            } else {
                alert('Неверная структура файла базы данных');
            }
        } catch (error) {
            console.error('Ошибка при импорте файла:', error);
            alert('Ошибка при импорте файла');
        }
    }

    validateDatabaseStructure(data) {
        if (typeof data !== 'object' || data === null) return false;
        
        // Проверяем каждую таблицу
        for (const tableName in data) {
            const table = data[tableName];
            
            // Проверяем обязательные поля таблицы
            if (!table.columns || !table.data || !Array.isArray(table.data)) {
                return false;
            }
            
            // Проверяем типы колонок
            for (const columnName in table.columns) {
                const columnType = table.columns[columnName];
                if (!['text', 'number', 'date', 'phone', 'email', 'url'].includes(columnType)) {
                    return false;
                }
            }
        }
        
        return true;
    }

    // Добавляем метод для экспорта в новый файл
    async exportToNewFile() {
        try {
            const newFileHandle = await window.showSaveFilePicker({
                suggestedName: 'database_export.json',
                types: [{
                    description: 'JSON Files',
                    accept: {
                        'application/json': ['.json']
                    }
                }]
            });

            const writable = await newFileHandle.createWritable();
            await writable.write(JSON.stringify(this.tables, null, 2));
            await writable.close();

            alert('База данных успешно экспортирована');
        } catch (error) {
            console.error('Ошибка при экспорте файла:', error);
            alert('Ошибка при экспорте базы данных');
        }
    }
}

const db = new Database();
