'use strict';
// Передаем неотсортированный набор карточек data
function TripCardsSorter (data) {
	var tcs = this;
	tcs.itinerary = [];
	tcs.cards = [];
	tcs.hashTable = {};

	if(data)
		tcs.importCards(data);

	return tcs;
}

// Строим хеш-таблицу(ключ-значение) для пунктов назначения
// На выходе имеем таблицу с индексом и названием
TripCardsSorter.prototype.buildHashTable = function () {
	var tcs = this;
	tcs.cards.forEach(function(card, i) {
		tcs.hashTable[card.point.name] = i;
	});
}

// Помещаем набор несортированных карточек data в массив cards
// Здесь же строим хеш-таблицу buildHashTable()
TripCardsSorter.prototype.importCards = function (data) {
	var tcs = this;

	tcs.cards = [];

	if(data instanceof Array) {
		data.forEach(function(card) {
			if(!card.point.name || card.point.name === '') 
				console.error(JSON.strigify(card) + 'has not point.name')
			else if(!card.destination.name || card.destination.name === '')
				console.error(JSON.strigify(card) + 'has not destination.name')
		})
		tcs.cards = data;

		tcs.buildHashTable();
	}	
}

//Ищем первую карточку
//Создаем массив со всеми пунктами назначений
//Сравниваем их с пунктами отправления. Тот, которого нет в этом массиве,
//является первым пунктом в маршруте.
TripCardsSorter.prototype.findFirstPoint = function() {
	var tcs = this;
	var points = [];

	tcs.cards.forEach(function(card) {
		points.push(card.destination.name);
	});

	tcs.cards.forEach(function(card) {
		if(points.indexOf(card.point.name) === -1) {
			tcs.itinerary.push(card);
		}
	});
}

//Сартируем карточки в порядке от точки А к точке В
//Найдем пункт отправления. Далее ищем следующий пункт по хеш-таблице
TripCardsSorter.prototype.sortCards = function() {
	var tcs = this;
	tcs.firstPoint = tcs.findFirstPoint();

	for(var i = 0; i < tcs.cards.length - 1; i++) {
		var currentCard = tcs.itinerary[i];
		var nextCardIndex = tcs.hashTable[currentCard.destination.name];
		var nextCard = cards[nextCardIndex];
		tcs.itinerary.push(nextCard);
	}
}

//Имея правильный порядок карточек 
//можем пристопить к выводу указаний по маршруту.
TripCardsSorter.prototype.printItinerary = function () {
	var tcs = this;

	//Вывод информации о месте в транспорте
	var printSeat = function(card) {
		if(card.transport.seat)
			return ' Seat' + card.transport.seat + '.';
		else return ' No seat assignment. ';
	};

	//Вывод информации о багажной карусели
	var printBaggageDrop = function(card) {
		if(card.transport.baggageDrop)
			return ' Baggage drop at ticket counter ' + card.transport.baggageDrop + '.';
		else return ' Baggage will be automatically transferred from your last leg.';
	};

	//Создаем пункт инструкции
	var instruction = document.createElement('div');

	tcs.itinerary.forEach(function(card) {
		var cardInstruction = '';

		switch(card.transport.type) {
			case 'train':
				cardInstruction = '<span>Take train ' + card.transport.route + ' from ' + card.point.name + ' to ' + card.destination.name + '.' + printSeat(card) + '</span><br>';
				break;
			case 'airportBus':
				cardInstruction = '<span>Take the airport bus from ' + card.point.name + ' to ' + card.destination.name + '.' + printSeat(card) + '</span><br>';
				break;
			case 'plane' :
				cardInstruction = '<span>From ' + card.point.name + ', take flight ' + card.transport.route + ' to ' + card.destination.name + '. Gate ' + card.transport.gate + '.' + printSeat(card) + printBaggageDrop(card) + '</span><br>';
				 break;
			default: cardInstruction = '<span>From ' + card.point.name + ' to ' + card.destination.name + ' by ' + card.transport.type + '. </span><br>';
		}

	//Добавляем инстукцию
	instruction.innerHTML += cardInstruction;
	});
	document.getElementsByTagName('body')[0].appendChild(instruction);
}