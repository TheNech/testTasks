(function(root, factory) {
	// Инициализируем фреймворк
	// root - среда инициализации
	// factory - функция возвращающая объкт с методами
	root.jsFrm = factory();

})(this, function() {

	// Фабрика объектов
	var jsFrm = function(selector, context) {
		return new jsFrm.prototype.init(selector, context);
	};

	// Поиск элемента
	// string - селектор
	// false, если элемент не найден
	var find = function(string) {

		if (string) {
			var element = [];

			if (string[0] === '#' && document.getElementById(string.substring(1))) {
				element[0] = document.getElementById(string.substring(1));
			} else if (document.getElementsByTagName(string).length) {
					element = document.getElementsByTagName(string);
			} else {
					element = document.getElementsByClassName(string.substring(1));
			}

			if (element.length) return element;
		}
		return false;
	};

	// Прототип фабрики объектов
	// init - метод, который возвращает объект со всеми методами, и найденными элементами
	// context -  контекст для установки нового элемента
	// Возвращает объект с найденным элементом или без
	jsFrm.prototype = {
		constructor: jsFrm,
		length: 0,
		init: function(selector, context) {
			var element = find(selector);

			if (element) {
				if (element.length === 1) {
					this.length = 1;
					this[0] = element[0];
				} else {
					this.length = element.length;
					for (var i = 0; i < this.length; i++) {
						this[i] = element[i];
					}
				}
			} else if (selector[0] === '<' && selector[selector.length - 1] === '>') {
				this.length = 1;
				this[0] = document.createElement(selector.substring(1, selector.length - 1));

				if (context) {
					find(context)[0].appendChild(this[0]);
				}
			}
			return this;
		}
	};

	// Добавляем прототип методу init
	jsFrm.prototype.init.prototype = jsFrm.prototype;

	// Методы для работы с DOM и CSS элементами
	// this[0] - найденный элемент

	// Метод конструктора для добавления или удаления классов
	// action - действие - удаления, добавление
	// self - ссылка на прототип конструктора
	// args - имена классов
	jsFrm.act = function(action, self, args) {
		var num = 0 ;
		
		var length = args.length;

		if (action && length) {
			if (typeof args[length - 1] !== 'string' && self.length > 1) {
				num = args[length - 1];
				length -= 1;
			}

			for (var i = 0; i < length; i++) {
				self[num].classList[action](args[i]);
			}
		}
	};

	// Метод возвращает true, если заданный класс name есть у элемента
	// Возвращает false, если заданного класса у элемента нет
	jsFrm.prototype.hasClass = function(name) {
		for (var i = 0; i < this[0].classList.length; i++) {
			if (this[0].classList[i] === name) return true;
		}
		return false;
	};

	// Вывод класса или классов
	jsFrm.prototype.classList = function() {
		var classAll = [];
		for (var i = 0; i < this.length; i++) {
			classAll[i] = this[i].classList;
		}
		return classAll;
	};

	// Добавление новых классов элементу
	jsFrm.prototype.addClass = function(name) {
		jsFrm.act('add', this, arguments);
		return this;
	};

	// Удаление классов элемента
	jsFrm.prototype.removeClass = function(name) {
		jsFrm.act('remove', this, arguments);
		return this;
	};

	return jsFrm;
});
